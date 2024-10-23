import { Inject, Injectable } from '@nestjs/common';
import { and, eq, is, isNotNull, isNull, sql } from 'drizzle-orm';
import { BorrowingRecord, Repository } from 'src/db/drizzle';
import { authors } from 'src/db/schema/author.schema';
import { books } from 'src/db/schema/books.schema';
import { borrowingRecords } from 'src/db/schema/borrowingRecords.schema';
import { shelfLocations } from 'src/db/schema/shelfLocations.schema';
import { users } from 'src/db/schema/user.schema';
import { AnalyticsModels } from 'src/models/analytics.models';
import { BookModels } from 'src/models/book.models';
import { DRIZZLE } from 'src/modules/drizzle.module';

@Injectable()
export class BorrowingRecordsRepository {
  constructor(
    @Inject(DRIZZLE) private readonly repository: Repository<BorrowingRecord>,
  ) {}

  async getById(id: number) {
    const borrowingRecord = await this.repository
      .select()
      .from(borrowingRecords)
      .where(eq(borrowingRecords.id, id))
      .execute();

    return borrowingRecord[0];
  }

  getAll() {
    return this.repository.select().from(borrowingRecords).execute();
  }

  async getReturnedRecord(data: BookModels.BorrowReq) {
    const { bookId, userId } = data;
    const record = await this.repository
      .select()
      .from(borrowingRecords)
      .where(
        and(
          eq(borrowingRecords.bookId, bookId),
          eq(borrowingRecords.userId, userId),
          isNull(borrowingRecords.returnedAt),
        ),
      )
      .execute();

    return record[0];
  }

  async getUnReturnedRecord(data: BookModels.ReturnReq) {
    const { bookId, userId } = data;
    const record = await this.repository
      .select()
      .from(borrowingRecords)
      .where(
        and(
          eq(borrowingRecords.bookId, bookId),
          eq(borrowingRecords.userId, userId),
          isNull(borrowingRecords.returnedAt),
        ),
      )
      .execute();

    return record[0];
  }

  getBorrowingHistory(data: AnalyticsModels.BorrowingAnalyticsReq) {
    return this.repository
      .select({
        user: {
          id: users.id,
          name: users.username,
          email: users.email,
          registeredAt: users.registeredAt,
        },
        books: {
          id: books.id,
          title: books.title,
          ISBN: books.ISBN,
          author: authors.name,
          shelfLocation: shelfLocations.name,
          borrowedAt: borrowingRecords.borrowedAt,
          IsOverDue: sql`
          CASE
            WHEN ${borrowingRecords.returnedAt} IS NOT NULL THEN ${borrowingRecords.returnedAt} > ${borrowingRecords.dueDate}
            ELSE CURRENT_DATE > ${borrowingRecords.dueDate}
          END
        `,
        },
      })
      .from(borrowingRecords)
      .innerJoin(users, eq(borrowingRecords.userId, users.id))
      .innerJoin(books, eq(borrowingRecords.bookId, books.id))
      .innerJoin(authors, eq(books.authorId, authors.id))
      .innerJoin(shelfLocations, eq(books.shelfLocationId, shelfLocations.id))
      .execute();
  }
}

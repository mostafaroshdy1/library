import { Inject, Injectable } from '@nestjs/common';
import { and, eq, is, isNotNull, isNull } from 'drizzle-orm';
import { BorrowingRecord, Repository } from 'src/db/drizzle';
import { borrowingRecords } from 'src/db/schema/borrowingRecords.schema';
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
}

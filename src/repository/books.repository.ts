import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gte, isNull, like, lte, sql } from 'drizzle-orm';
import { title } from 'process';
import { dateHelper } from 'src/common/helpers/date.helper';
import { Book, Repository } from 'src/db/drizzle';
import { authors } from 'src/db/schema/author.schema';
import { books } from 'src/db/schema/books.schema';
import { borrowingRecords } from 'src/db/schema/borrowingRecords.schema';
import { shelfLocations } from 'src/db/schema/shelfLocations.schema';
import { BookDtos } from 'src/dtos/book.dtos';
import { BookModels } from 'src/models/book.models';
import { DRIZZLE } from 'src/modules/drizzle.module';

@Injectable()
export class BookRepository {
  constructor(@Inject(DRIZZLE) private readonly repository: Repository<Book>) {}

  async getById(id: number) {
    const book = await this.repository
      .select()
      .from(books)
      .where(eq(books.id, id))
      .execute();

    return book[0];
  }

  async getByISBN(ISBN: string) {
    const book = await this.repository
      .select()
      .from(books)
      .where(like(books.ISBN, ISBN))
      .execute();

    return book[0];
  }

  getByTitle(title: string) {
    return this.repository
      .select()
      .from(books)
      .where(like(books.title, title))
      .execute();
  }

  create(data: BookDtos.model) {
    return this.repository.insert(books).values(data).returning().execute();
  }

  update(id: number, data: BookDtos.model) {
    return this.repository
      .update(books)
      .set(data)
      .where(eq(books.id, id))
      .returning()
      .execute();
  }

  deleteById(id: number) {
    return this.repository.delete(books).where(eq(books.id, id)).execute();
  }

  getAll(data: BookModels.GetAllReq): Promise<BookModels.GetAllRes[]> {
    const { limit, offset, ISBN, title, id, author } = data;

    const query = this.repository
      .select({
        id: books.id,
        title: books.title,
        ISBN: books.ISBN,
        shelfLocations: shelfLocations.name,
        author: authors.name,
        qty: books.qty,
      })
      .from(books)
      .innerJoin(authors, eq(books.authorId, authors.id))
      .innerJoin(shelfLocations, eq(books.shelfLocationId, shelfLocations.id))
      .limit(limit)
      .offset(offset);

    if (ISBN) query.where(eq(books.ISBN, ISBN));
    if (title) query.where(eq(books.title, title));
    if (id) query.where(eq(books.id, id));
    if (author) query.where(eq(authors.name, author));

    return query.execute();
  }

  async returnBook(data: BookModels.ReturnReq) {
    const { bookId, userId } = data;
    await this.repository.transaction(async (trx) => {
      await Promise.all([
        trx
          .update(books)
          .set({ qty: sql`${books.id} + 1` })
          .where(eq(books.id, bookId)),

        trx
          .update(borrowingRecords)
          .set({ returnedAt: dateHelper.date() })
          .where(
            and(
              eq(borrowingRecords.bookId, bookId),
              eq(borrowingRecords.userId, userId),
            ),
          ),
      ]);
    });
  }

  async borrowBook(bookId: number, userId: number, dueDate: Date) {
    await this.repository.transaction(async (trx) => {
      await Promise.all([
        trx
          .update(books)
          .set({ qty: sql`${books.qty} - 1` })
          .where(eq(books.id, bookId)),

        trx
          .insert(borrowingRecords)
          .values({
            bookId,
            userId,
            dueDate,
            borrowedAt: dateHelper.date(),
          })
          .execute(),
      ]);
    });
  }

  getBorrowedBooks(userId: number) {
    return this.repository
      .select({
        id: books.id,
        title: books.title,
        ISBN: books.ISBN,
        author: authors.name,
        shelfLocation: shelfLocations.name,
      })
      .from(borrowingRecords)
      .innerJoin(books, eq(borrowingRecords.bookId, books.id))
      .innerJoin(authors, eq(books.authorId, authors.id))
      .innerJoin(shelfLocations, eq(books.shelfLocationId, shelfLocations.id))
      .where(
        and(
          eq(borrowingRecords.userId, userId),
          isNull(borrowingRecords.returnedAt),
        ),
      )

      .execute();
  }

  getOverdueBooks() {
    return this.repository
      .select({
        id: books.id,
        title: books.title,
        ISBN: books.ISBN,
      })
      .from(books)
      .innerJoin(borrowingRecords, eq(books.id, borrowingRecords.bookId))
      .where(
        and(
          isNull(borrowingRecords.returnedAt),
          lte(borrowingRecords.dueDate, dateHelper.date()),
        ),
      );
  }
}

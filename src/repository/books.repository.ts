import { Inject, Injectable } from '@nestjs/common';
import { and, eq, like, sql } from 'drizzle-orm';
import { dateHelper } from 'src/common/helpers/date.helper';
import { Book, Repository } from 'src/db/drizzle';
import { books } from 'src/db/schema/books.schema';
import { borrowingRecords } from 'src/db/schema/borrowingRecords.schema';
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

  getByAuther(author: string) {
    return this.repository
      .select()
      .from(books)
      .where(like(books.author, author))
      .execute();
  }

  create(data: {
    title: string;
    ISBN: string;
    author: string;
    qty: number;
    shelfLocation: string;
  }) {
    return this.repository.insert(books).values(data).execute();
  }

  update(
    id: number,
    data: {
      title: string;
      ISBN: string;
      author: string;
      qty: number;
      shelfLocation: string;
    },
  ) {
    return this.repository
      .update(books)
      .set(data)
      .where(eq(books.id, id))
      .execute();
  }

  deleteById(id: number) {
    return this.repository.delete(books).where(eq(books.id, id)).execute();
  }

  getAll() {
    return this.repository.select().from(books).execute();
  }

  async returnBook(bookId: number, userId: number) {
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
}

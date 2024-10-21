import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BorrowingRecord, Repository } from 'src/db/drizzle';
import { borrowingRecords } from 'src/db/schema/borrowingRecords.schema';
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

  borrowBook(data: { userId: number; bookId: number; dueDate: Date }) {
    return this.repository.insert(borrowingRecords).values(data).execute();
  }

  // markAsReturned(id: number) {
  //   return this.repository
  //     .update(borrowingRecords)
  //     .set({ returnedAt: dateHelper.date() })
  //     .where(eq(borrowingRecords.id, id))
  //     .execute();
  // }
}

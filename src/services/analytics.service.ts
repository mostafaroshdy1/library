import { Injectable } from '@nestjs/common';
import { AnalyticsModels } from 'src/models/analytics.models';
import { BorrowingRecordsRepository } from 'src/repository/borrowingRecords.repository';
import { format } from 'fast-csv'; // Using fast-csv to generate CSV
import * as streamBuffers from 'stream-buffers';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly borrowingRecordsRepository: BorrowingRecordsRepository,
  ) {}

  async getBorrowingAnalytics(data: AnalyticsModels.BorrowingAnalyticsReq) {
    const records =
      await this.borrowingRecordsRepository.getBorrowingHistory(data);

    const writableStream = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024,
      incrementAmount: 10 * 1024,
    });

    const csvStream = format({ headers: true });
    csvStream.pipe(writableStream);
    records.forEach((record) => {
      csvStream.write({
        UserId: record.user.id,
        Name: record.user.name,
        Email: record.user.email,
        RegisteredAt: record.user.registeredAt,
        BookId: record.books.id,
        Title: record.books.title,
        ISBN: record.books.ISBN,
        Author: record.books.author,
        ShelfLocation: record.books.shelfLocation,
        BorrowedAt: record.books.borrowedAt,
        IsOverdue: record.books.IsOverDue ? 'Yes' : 'No',
      });
    });
    csvStream.end();

    return new Promise((resolve, reject) => {
      csvStream.on('end', () => {
        resolve(writableStream.getContents() as Buffer);
      });
      csvStream.on('error', (err) => reject(err));
    });
  }
}

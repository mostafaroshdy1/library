import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle.module';
import { UserRepository } from 'src/repository/users.repository';
import { BookRepository } from 'src/repository/books.repository';
import { AuthorRepository } from 'src/repository/author.repository';
import { ShelfLocationRepository } from 'src/repository/shelfLocation.repository';
import { BorrowingRecordsRepository } from 'src/repository/borrowingRecords.repository';

@Module({
  imports: [DrizzleModule],
  providers: [
    UserRepository,
    BookRepository,
    AuthorRepository,
    ShelfLocationRepository,
    BorrowingRecordsRepository,
  ],
  exports: [
    UserRepository,
    BookRepository,
    AuthorRepository,
    ShelfLocationRepository,
    BorrowingRecordsRepository,
  ],
})
export class RepositoryModule {}

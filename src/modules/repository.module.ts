import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle.module';
import { UserRepository } from 'src/repository/users.repository';
import { BookRepository } from 'src/repository/books.repository';

@Module({
  imports: [DrizzleModule],
  providers: [UserRepository, BookRepository],
  exports: [UserRepository, BookRepository],
})
export class RepositoryModule {}

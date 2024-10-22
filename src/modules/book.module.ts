import { Module } from '@nestjs/common';
import { BookController } from 'src/controllers/book.controller';
import { BookService } from 'src/services/book.service';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}

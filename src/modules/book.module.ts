import { Module } from '@nestjs/common';
import { BookController } from 'src/controllers/book.controller';
import { BookService } from 'src/services/book.service';
import { RepositoryModule } from './repository.module';
import { CommonModule } from './common.module';

@Module({
  imports: [RepositoryModule, CommonModule],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}

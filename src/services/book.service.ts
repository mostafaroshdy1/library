import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { dateHelper } from 'src/common/helpers/date.helper';
import { ResponseModels } from 'src/common/models/response.model';
import { BookDtos } from 'src/dtos/book.dtos';
import { BookModels } from 'src/models/book.models';
import { AuthorRepository } from 'src/repository/author.repository';
import { BookRepository } from 'src/repository/books.repository';
import { ShelfLocationRepository } from 'src/repository/shelfLocation.repository';
import { UserRepository } from 'src/repository/users.repository';
import { LocalStorageService } from './localStorage.service';
import { BorrowingRecordsRepository } from 'src/repository/borrowingRecords.repository';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly authorRepository: AuthorRepository,
    private readonly shelfLocationRepository: ShelfLocationRepository,
    private readonly userRepository: UserRepository,
    private readonly localStorageService: LocalStorageService,
    private readonly borrowingRecordsRepository: BorrowingRecordsRepository,
  ) {}

  async create(data: BookModels.CreateReq) {
    const { author, ISBN, qty, shelfLocation, title } = data;
    const createdBook: BookDtos.model = new BookDtos.model({
      ISBN,
      qty,
      title,
    });

    const foundBook = await this.bookRepository.getByISBN(ISBN);
    if (foundBook) throw new ConflictException(ErrorMessages.book.ISBNExists);

    const [foundAuthor, foundshelfLocation] = await Promise.all([
      this.authorRepository.getByName(author),
      this.shelfLocationRepository.getByName(shelfLocation),
    ]);
    if (!foundAuthor) {
      const createdAuthor = await this.authorRepository.create({
        name: author,
      });
      createdBook.authorId = createdAuthor.id;
    } else {
      createdBook.authorId = foundAuthor.id;
    }

    if (!foundshelfLocation) {
      const createdShelfLocation =
        await this.shelfLocationRepository.create(shelfLocation);
      createdBook.shelfLocationId = createdShelfLocation.id;
    } else {
      createdBook.shelfLocationId = foundshelfLocation.id;
    }
    return this.bookRepository.create(createdBook);
  }

  async update(id: number, data: BookModels.UpdateReq) {
    const { author, ISBN, shelfLocation, qty, title } = data;
    const updatedBook: BookDtos.model = new BookDtos.model({
      ISBN,
      qty,
      title,
    });
    const foundBook = await this.bookRepository.getById(id);
    if (!foundBook) throw new ConflictException(ErrorMessages.book.notFound);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(ErrorMessages.common.emptyUpdateData);
    }

    if (ISBN && foundBook.ISBN !== ISBN) {
      const isbnCheckBook = await this.bookRepository.getByISBN(ISBN);

      if (isbnCheckBook)
        throw new ConflictException(ErrorMessages.book.ISBNExists);
    }

    const [foundAuthor, foundshelfLocation] = await Promise.all([
      this.authorRepository.getByName(author),
      this.shelfLocationRepository.getByName(shelfLocation),
    ]);

    if (!foundAuthor) {
      const createdAuthor = await this.authorRepository.create({
        name: author,
      });
      updatedBook.authorId = createdAuthor.id;
    } else {
      updatedBook.authorId = foundAuthor.id;
    }

    if (!foundshelfLocation) {
      const createdShelfLocation =
        await this.shelfLocationRepository.create(shelfLocation);
      updatedBook.shelfLocationId = createdShelfLocation.id;
    } else {
      updatedBook.shelfLocationId = foundshelfLocation.id;
    }

    return this.bookRepository.update(id, updatedBook);
  }

  async delete(id: number): Promise<ResponseModels.ack> {
    const deleteResult = await this.bookRepository.deleteById(id);
    if (deleteResult.rowCount === 0)
      throw new NotFoundException(ErrorMessages.book.notFound);

    return { result: true };
  }

  getAll(data: BookModels.GetAllReq): Promise<BookModels.GetAllRes[]> {
    return this.bookRepository.getAll(data);
  }

  async borrowBook(data: BookModels.BorrowReq): Promise<ResponseModels.ack> {
    if (!data.userId)
      data.userId = this.localStorageService.getCurrentUser().id;

    if (dateHelper.isPast(data.dueDate))
      throw new BadRequestException(ErrorMessages.book.invalidDueDate);

    const foundUser = await this.userRepository.getById(data.userId);
    if (!foundUser) throw new NotFoundException(ErrorMessages.user.notFound);

    const foundBook = await this.bookRepository.getById(data.bookId);
    if (!foundBook) throw new NotFoundException(ErrorMessages.book.notFound);

    if (foundBook.qty === 0)
      throw new BadRequestException(ErrorMessages.book.outOfStock);

    const foundBorrowingRecord =
      await this.borrowingRecordsRepository.getReturnedRecord(data);
    if (foundBorrowingRecord)
      throw new ConflictException(ErrorMessages.book.alreadyBorrowed);

    try {
      await this.bookRepository.borrowBook(
        data.bookId,
        data.userId,
        data.dueDate,
      );
      return { result: true };
    } catch (error) {
      throw new BadRequestException(ErrorMessages.book.borrowFailed);
    }
  }

  async returnBook(data: BookModels.ReturnReq): Promise<ResponseModels.ack> {
    if (!data.userId)
      data.userId = this.localStorageService.getCurrentUser().id;

    const foundUser = await this.userRepository.getById(data.userId);
    if (!foundUser) throw new NotFoundException(ErrorMessages.user.notFound);

    const foundBook = await this.bookRepository.getById(data.bookId);
    if (!foundBook) throw new NotFoundException(ErrorMessages.book.notFound);

    const foundBorrowingRecord =
      await this.borrowingRecordsRepository.getUnReturnedRecord(data);
    if (!foundBorrowingRecord)
      throw new NotFoundException(ErrorMessages.book.notBorrowed);

    try {
      await this.bookRepository.returnBook(data);
      return { result: true };
    } catch (error) {
      throw new BadRequestException(ErrorMessages.book.returnFailed);
    }
  }
}

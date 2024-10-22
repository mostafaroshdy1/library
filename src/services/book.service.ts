import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { ResponseModels } from 'src/common/models/response.model';
import { BookDtos } from 'src/dtos/book.dtos';
import { BookModels } from 'src/models/book.models';
import { AuthorRepository } from 'src/repository/author.repository';
import { BookRepository } from 'src/repository/books.repository';
import { ShelfLocationRepository } from 'src/repository/shelfLocation.repository';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly authorRepository: AuthorRepository,
    private readonly shelfLocationRepository: ShelfLocationRepository,
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
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { ResponseModels } from 'src/common/models/response.model';
import { HashService } from 'src/common/services/hash.service';
import { UserModels } from 'src/models/user.models';
import { BookRepository } from 'src/repository/books.repository';
import { UserRepository } from 'src/repository/users.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly bookRepository: BookRepository,
  ) {}

  async create(data: UserModels.CreateReq) {
    const foundUser = await this.userRepository.getByEmail(data.email);
    if (foundUser) throw new ConflictException(ErrorMessages.user.emailExists);
    data.password = await this.hashService.hash(data.password);
    return this.userRepository.create(data);
  }

  async update(id: number, data: UserModels.UpdateReq) {
    const foundUser = await this.userRepository.getById(id);
    if (!foundUser)
      throw new NotFoundException(ErrorMessages.user.userNotFound);

    if (data.password)
      data.password = await this.hashService.hash(data.password);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(ErrorMessages.common.emptyUpdateData);
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: number): Promise<ResponseModels.ack> {
    const deleteResult = await this.userRepository.deleteById(id);
    if (deleteResult.rowCount === 0)
      throw new NotFoundException(ErrorMessages.user.userNotFound);
    return { result: true };
  }

  getAll(data: UserModels.GetAllReq) {
    return this.userRepository.getAll(data);
  }

  getBorrowedBooks(id: number) {
    return this.bookRepository.getBorrowedBooks(id);
  }
}

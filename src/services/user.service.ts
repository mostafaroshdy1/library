import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { HashService } from 'src/common/services/hash.service';
import { UserModels } from 'src/models/user.models';
import { UserRepository } from 'src/repository/users.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async create(data: UserModels.CreateReq) {
    const foundUser = await this.userRepository.getByEmail(data.email);
    if (foundUser) throw new ConflictException(ErrorMessages.user.emailExists);
    data.password = await this.hashService.hash(data.password);
    return this.userRepository.create(data);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { LocalStorageService } from './localStorage.service';
import { UserRepository } from 'src/repository/users.repository';
import { HashService } from 'src/common/services/hash.service';
import { UserModels } from 'src/models/user.models';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { JwtSignService } from './JwtSign.Service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly jwtSignService: JwtSignService,
    private readonly localStorageService: LocalStorageService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersRepository.getByEmail(email);
    if (user && (await this.hashService.compare(pass, user.password))) {
      const { id } = user;
      return { id };
    }
    return null;
  }

  async login(user: UserModels.CurrentUser) {
    const payload: UserModels.CurrentUser = { id: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtSignService.accessTokenSign(payload),
      this.jwtSignService.refreshTokenSign(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async refresh() {
    const currentUser = this.localStorageService.getCurrentUser();

    const user = await this.usersRepository.getById(currentUser.id);

    if (!user) throw new BadRequestException(ErrorMessages.user.notFound);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtSignService.accessTokenSign(currentUser),
      this.jwtSignService.refreshTokenSign(currentUser),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

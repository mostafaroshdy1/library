import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { LocalStorageModels } from 'src/models/localStorage.models';
import { UserModels } from 'src/models/user.models';

@Injectable()
export class LocalStorageService {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorage<LocalStorageModels>,
  ) {}

  getCurrentUser(): UserModels.CurrentUser {
    const currentUser = this.asyncLocalStorage.getStore()?.currentUser;
    if (!currentUser)
      throw new InternalServerErrorException(
        ErrorMessages.localStorage.storeNotFound,
      );
    return currentUser;
  }
}

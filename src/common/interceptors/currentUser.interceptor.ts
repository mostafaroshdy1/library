import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';
import { LocalStorageModels } from 'src/models/localStorage.models';
import { UserModels } from 'src/models/user.models';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private readonly asyncLocalStorage: AsyncLocalStorage<LocalStorageModels>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const currentUser: UserModels.CurrentUser = {
      id: request.user?.id,
    };
    this.asyncLocalStorage.enterWith({ currentUser });
    return next.handle();
  }
}

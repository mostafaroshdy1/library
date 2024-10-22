import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AsyncLocalStorage } from 'async_hooks';
import { LocalStorageModels } from 'src/models/localStorage.models';
import { UserModels } from 'src/models/user.models';

@Injectable()
export class AccessTokenGuard extends AuthGuard('AccessStrategy') {}

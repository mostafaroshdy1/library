import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppConfig } from '../config/App.Config';
import { constants } from '../constants/constants';
import { ErrorMessages } from '../enums/error-messages.enum';

@Injectable()
export class HashService {
  constructor(private readonly appConfig: AppConfig) {}

  hash(data: string): Promise<string> {
    if (data.length > constants.hash.maxPasswordLength)
      throw new BadRequestException(ErrorMessages.hash.limit);

    return bcrypt.hash(data, this.appConfig.config.Hash.saltRounds);
  }

  compare(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
}

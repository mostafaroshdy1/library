import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { constants } from 'src/common/constants/constants';
import { BaseFilter } from 'src/common/models/base-filter.model';

export namespace UserModels {
  export class CurrentUser {
    id: number;
  }

  export class CreateReq {
    @IsNotEmpty()
    @IsString()
    @MaxLength(constants.stringMaxLength.username)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(constants.stringMaxLength.email)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(constants.stringMaxLength.password)
    password: string;
  }
  export class UpdateReq {
    @IsOptional()
    @IsString()
    @MaxLength(constants.stringMaxLength.username)
    username: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(constants.stringMaxLength.email)
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(constants.stringMaxLength.password)
    password: string;
  }

  export class Res {
    username: string;
    email: string;
  }

  export class GetAllReq extends BaseFilter {
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;
  }
}

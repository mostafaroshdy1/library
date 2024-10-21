import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { constants } from 'src/common/constants/constants';

export namespace UserModels {
  export interface CurrentUser {
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
}

import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class Auth {
  @IsString()
  jwtAccessSecret: string;

  @IsString()
  jwtRefreshSecret: string;

  @IsString()
  jwtAccessLifespan: string;

  @IsString()
  jwtRefreshLifespan: string;
}

class Database {
  @IsString()
  DATABASE_URL: string;
}

class Hash {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  saltRounds: number;
}

class Host {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  port: number;
}

export class Config {
  @IsString()
  Env: string;

  @ValidateNested()
  @Type(() => Auth)
  Auth: Auth;

  @ValidateNested()
  @Type(() => Database)
  Database: Database;

  @ValidateNested()
  @Type(() => Hash)
  Hash: Hash;

  @ValidateNested()
  @Type(() => Host)
  Host: Host;
}

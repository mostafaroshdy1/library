import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { BaseFilter } from 'src/common/models/base-filter.model';

export namespace BookModels {
  export class CreateReq {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    ISBN: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    author: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    qty: number;

    @IsNotEmpty()
    @IsString()
    shelfLocation: string;
  }

  export class UpdateReq {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    ISBN: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    author: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    qty: number;

    @IsOptional()
    @IsString()
    shelfLocation: string;
  }
  export class GetAllReq extends BaseFilter {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    ISBN: string;

    @IsOptional()
    @IsString()
    author: string;

    @IsOptional()
    @IsString()
    @Min(1)
    qty: number;

    @IsOptional()
    @IsString()
    shelfLocation: string;
  }

  export class CreateRes {
    id: number;
    title: string;
    ISBN: string;
    authorId: number;
    qty: number;
    shelfLocationId: number;
  }

  export class GetAllRes {
    id: number;
    title: string;
    ISBN: string;
    shelfLocations: string;
    author: string;
    qty: number;
  }
}

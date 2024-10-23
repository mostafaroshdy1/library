import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { dateHelper } from 'src/common/helpers/date.helper';

export namespace AnalyticsModels {
  export class BorrowingAnalyticsReq {
    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => dateHelper.date(value))
    fromDate: Date;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => dateHelper.date(value))
    toDate: Date;
  }
}

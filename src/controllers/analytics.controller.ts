import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AnalyticsModels } from 'src/models/analytics.models';
import { AnalyticsService } from 'src/services/analytics.service';
import { FastifyReply } from 'fastify';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('borrowing')
  async getBorrowingAnalytics(
    @Res() res: FastifyReply,
    @Query() data: AnalyticsModels.BorrowingAnalyticsReq,
  ) {
    const csvBuffer = await this.analyticsService.getBorrowingAnalytics(data);
    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename="borrowing_history.csv"',
    );

    return res.send(csvBuffer);
  }

  @Get('overdue/past-month')
  async getOverduePastMonthAnalytics(@Res() res: FastifyReply) {
    const csvBuffer =
      await this.analyticsService.getOverduePastMonthAnalytics();
    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename="overdue_past_month.csv"',
    );

    return res.send(csvBuffer);
  }

  @Get('records/past-month')
  async getBorrowingRecordsPastMonth(@Res() res: FastifyReply) {
    const csvBuffer =
      await this.analyticsService.getPastMonthBorrowingRecords();
    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename="borrowing_history.csv"',
    );

    return res.send(csvBuffer);
  }
}

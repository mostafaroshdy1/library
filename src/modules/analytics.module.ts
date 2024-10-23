import { Module } from '@nestjs/common';
import { AnalyticsController } from 'src/controllers/analytics.controller';
import { AnalyticsService } from 'src/services/analytics.service';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

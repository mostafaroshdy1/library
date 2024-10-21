import { Module } from '@nestjs/common';
import { AppConfig } from 'src/common/config/App.Config';
import { HashService } from 'src/common/services/hash.service';

@Module({
  providers: [AppConfig, HashService],
  exports: [AppConfig, HashService],
})
export class CommonModule {}

import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AppConfig } from 'src/common/config/App.Config';
import { HashService } from 'src/common/services/hash.service';
import { LocalStorageService } from 'src/services/localStorage.service';

@Module({
  providers: [
    AppConfig,
    HashService,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    LocalStorageService,
  ],
  exports: [AppConfig, HashService, AsyncLocalStorage, LocalStorageService],
})
export class CommonModule {}

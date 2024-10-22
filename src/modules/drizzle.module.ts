import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { books } from 'src/db/schema/books.schema';
import { users } from 'src/db/schema/user.schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { authors } from 'src/db/schema/author.schema';
import { shelfLocations } from 'src/db/schema/shelfLocations.schema';

const schema = {
  users,
  books,
  authors,
  shelfLocations,
};

export const DRIZZLE = Symbol('drizzle-connection');
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString: databaseUrl,
        });
        return drizzle(pool, { schema });
      },
    },
  ],

  exports: [DRIZZLE],
})
export class DrizzleModule {}

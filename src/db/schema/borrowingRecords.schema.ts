import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { books } from './books.schema';

export const borrowingRecords = pgTable(
  'borrowingRecords',
  {
    id: serial().primaryKey().notNull(),
    userId: integer()
      .references(() => users.id)
      .notNull(),
    bookId: integer()
      .references(() => books.id)
      .notNull(),
    borrowedAt: timestamp().defaultNow().notNull(),
    dueDate: timestamp().notNull(),
    returnedAt: timestamp(),
  },
  (table) => ({
    uniqueUserBook: unique()
      .on(table.userId, table.bookId, table.returnedAt)
      .nullsNotDistinct(),
  }),
);

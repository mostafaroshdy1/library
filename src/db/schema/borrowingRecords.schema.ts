import { date, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { books } from './books.schema';

export const borrowingRecords = pgTable('borrowingRecords', {
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
});

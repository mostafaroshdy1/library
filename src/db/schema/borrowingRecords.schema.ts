import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { books } from './books.schema';

export const borrowingRecords = pgTable('borrowingRecords', {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  userId: integer()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  bookId: integer()
    .references(() => books.id)
    .notNull(),
  borrowedAt: timestamp().defaultNow().notNull(),
  dueDate: timestamp().notNull(),
  returnedAt: timestamp(),
});

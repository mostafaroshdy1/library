import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  registeredAt: timestamp().defaultNow().notNull(),
});

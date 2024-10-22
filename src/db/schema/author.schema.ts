import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const authors = pgTable('authors', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
});

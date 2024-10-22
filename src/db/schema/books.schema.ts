import { sql } from 'drizzle-orm';
import { check, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { authors } from './author.schema';
import { shelfLocations } from './shelfLocations.schema';

export const books = pgTable(
  'books',
  {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    ISBN: varchar({ length: 255 }).unique().notNull(),
    authorId: integer()
      .references(() => authors.id)
      .notNull(),
    shelfLocationId: integer()
      .references(() => shelfLocations.id)
      .notNull(),
    qty: integer().notNull(),
  },
  (table) => ({
    checkConstraint: check('book_stock_check', sql`${table.qty} >= 0`),
  }),
);

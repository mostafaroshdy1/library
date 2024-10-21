import { sql } from 'drizzle-orm';
import { check, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const books = pgTable(
  'books',
  {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    ISBN: varchar({ length: 255 }).unique().notNull(),
    author: varchar({ length: 255 }).notNull(),
    qty: integer().notNull(),
    shelfLocation: varchar({ length: 255 }).notNull(),
  },
  (table) => ({
    checkConstraint: check('book_stock_check', sql`${table.qty} >= 0`),
  }),
);

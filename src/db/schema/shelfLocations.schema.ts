import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const shelfLocations = pgTable('shelfLocations', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
});

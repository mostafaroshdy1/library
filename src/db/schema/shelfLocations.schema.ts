import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const shelfLocations = pgTable('shelfLocations', {
  id: integer().primaryKey().generatedAlwaysAsIdentity().notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
});

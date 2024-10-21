import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { books } from './schema/books.schema';
import { borrowingRecords } from './schema/borrowingRecords.schema';
import { users } from './schema/user.schema';

export type Repository<T> = NodePgDatabase<T>;
export type User = typeof users;
export type Book = typeof books;
export type BorrowingRecord = typeof borrowingRecords;

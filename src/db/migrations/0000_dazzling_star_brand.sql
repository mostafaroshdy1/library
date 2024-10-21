CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"ISBN" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"qty" integer NOT NULL,
	"shelfLocation" varchar(255) NOT NULL,
	CONSTRAINT "books_ISBN_unique" UNIQUE("ISBN"),
	CONSTRAINT "book_stock_check" CHECK ("books"."qty" >= 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "borrowingRecords" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"bookId" integer NOT NULL,
	"borrowedAt" timestamp DEFAULT now() NOT NULL,
	"dueDate" timestamp NOT NULL,
	"returnedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"registeredAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrowingRecords" ADD CONSTRAINT "borrowingRecords_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrowingRecords" ADD CONSTRAINT "borrowingRecords_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "borrowingRecords" DROP CONSTRAINT "borrowingRecords_userId_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "borrowingRecords" ADD CONSTRAINT "borrowingRecords_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

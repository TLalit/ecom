ALTER TABLE "currency" ADD COLUMN "updated_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "currency" DROP COLUMN IF EXISTS "updatedBy";
ALTER TABLE "region" ADD COLUMN "currency_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "region" ADD COLUMN "updated_by" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "region" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "region" DROP COLUMN IF EXISTS "currency";
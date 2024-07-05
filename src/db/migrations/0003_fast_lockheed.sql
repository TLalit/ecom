DROP INDEX IF EXISTS "currency_name_index";--> statement-breakpoint
ALTER TABLE "currency" ADD COLUMN "value" text NOT NULL;--> statement-breakpoint
ALTER TABLE "currency" DROP COLUMN IF EXISTS "archived_at";--> statement-breakpoint
ALTER TABLE "currency" ADD CONSTRAINT "currency_symbol_unique" UNIQUE("symbol");
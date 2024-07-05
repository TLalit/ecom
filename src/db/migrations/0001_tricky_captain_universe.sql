CREATE TABLE IF NOT EXISTS "currency" (
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"code" text NOT NULL,
	"is_default" boolean NOT NULL,
	"is_available" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"archived_at" timestamp with time zone,
	CONSTRAINT "currency_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "currency_name_index" ON "currency" USING btree (name) WHERE "currency"."archived_at" is null;
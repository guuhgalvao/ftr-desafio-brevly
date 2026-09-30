CREATE TABLE "links" (
	"id" uuid PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "links_access_count_check" CHECK ("links"."access_count" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "links_short_url_unique" ON "links" USING btree ("short_url");
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"description" text DEFAULT 'This my comment',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

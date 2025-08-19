CREATE TABLE "program_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_program_id" uuid NOT NULL,
	"related_program_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "program_relations" ADD CONSTRAINT "program_relations_parent_program_id_programs_id_fk" FOREIGN KEY ("parent_program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_relations" ADD CONSTRAINT "program_relations_related_program_id_programs_id_fk" FOREIGN KEY ("related_program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
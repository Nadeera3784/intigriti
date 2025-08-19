CREATE TYPE "public"."eligibility" AS ENUM('eligible', 'ineligible');--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "eligibility" "eligibility" DEFAULT 'eligible' NOT NULL;
import { pgTable, uuid, varchar, timestamp, text, pgEnum } from 'drizzle-orm/pg-core'

export const assetTypeEnum = pgEnum('asset_type', ['web', 'mobile'])

export const eligibilityEnum = pgEnum('eligibility', ['eligible', 'ineligible'])

export const programs = pgTable('programs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  website: varchar('website', { length: 500 }),
  twitter: varchar('twitter', { length: 100 }),
  type: assetTypeEnum('type'),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  description: text('description'),
  eligibility: eligibilityEnum('eligibility').notNull().default('eligible'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const programRelations = pgTable('program_relations', {
  id: uuid('id').defaultRandom().primaryKey(),
  parentProgramId: uuid('parent_program_id').references(() => programs.id, { onDelete: 'cascade' }).notNull(),
  relatedProgramId: uuid('related_program_id').references(() => programs.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Program = typeof programs.$inferSelect
export type NewProgram = typeof programs.$inferInsert
export type ProgramRelation = typeof programRelations.$inferSelect
export type NewProgramRelation = typeof programRelations.$inferInsert

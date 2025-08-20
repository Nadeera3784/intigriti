import { db } from "@/lib/database";
import { programs } from "@/schemas/database/schema";
import { faker } from "@faker-js/faker";

export interface TestProgram {
  name: string;
  startDate: Date;
  website?: string;
  twitter?: string;
  type?: "web" | "mobile";
  identifier: string;
  description?: string;
  eligibility?: "eligible" | "ineligible";
}

export const createTestProgram = (
  overrides: Partial<TestProgram> = {},
): TestProgram => ({
  name: faker.company.name(),
  startDate: faker.date.future(),
  website: faker.internet.url(),
  twitter: `@${faker.internet.username()}`,
  type: faker.helpers.arrayElement(["web", "mobile"] as const),
  identifier: faker.string.alphanumeric(8),
  description: faker.lorem.sentence(),
  eligibility: faker.helpers.arrayElement(["eligible", "ineligible"] as const),
  ...overrides,
});

export const insertTestProgram = async (
  programData: Partial<TestProgram> = {},
) => {
  const testProgram = createTestProgram(programData);
  const [insertedProgram] = await db
    .insert(programs)
    .values({
      name: testProgram.name,
      startDate: testProgram.startDate,
      website: testProgram.website || null,
      twitter: testProgram.twitter || null,
      type: testProgram.type,
      identifier: testProgram.identifier,
      description: testProgram.description || null,
      eligibility: testProgram.eligibility || "eligible",
    })
    .returning();

  return insertedProgram;
};

export const insertMultipleTestPrograms = async (count: number = 5) => {
  const programsData = Array.from({ length: count }, () => createTestProgram());

  const insertedPrograms = await db
    .insert(programs)
    .values(
      programsData.map((program) => ({
        name: program.name,
        startDate: program.startDate,
        website: program.website || null,
        twitter: program.twitter || null,
        type: program.type,
        identifier: program.identifier,
        description: program.description || null,
        eligibility: program.eligibility || "eligible",
      })),
    )
    .returning();

  return insertedPrograms;
};

export const cleanupTestData = async () => {
  await db.delete(programs);
};

export const createValidProgramPayload = (
  overrides: Partial<TestProgram> = {},
) => {
  const testProgram = createTestProgram(overrides);
  return {
    name: testProgram.name,
    startDate: testProgram.startDate.toISOString(),
    website: testProgram.website,
    twitter: testProgram.twitter,
    type: testProgram.type,
    identifier: testProgram.identifier,
    description: testProgram.description,
    relatedPrograms: [],
  };
};

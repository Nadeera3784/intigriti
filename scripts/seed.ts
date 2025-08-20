import { faker } from "@faker-js/faker";
import { db } from "../lib/database";
import { programs } from "../schemas/database/schema";

type AssetType = "web" | "mobile";
type EligibilityType = "eligible" | "ineligible";

function generateAssetIdentifier(type: AssetType): string {
  if (type === "web") {
    const options = [
      faker.internet.domainName(),
      `${faker.internet.domainWord()}.${faker.internet.domainSuffix()}`,
      `api.${faker.internet.domainName()}`,
      `app.${faker.internet.domainName()}`,
      `${faker.internet.domainWord()}-${faker.internet.domainWord()}.com`,
    ];
    return faker.helpers.arrayElement(options);
  } else {
    const options = [
      `com.${faker.internet.domainWord()}.${faker.internet.domainWord()}`,
      `org.${faker.internet.domainWord()}.${faker.internet.domainWord()}`,
      `io.${faker.internet.domainWord()}.${faker.internet.domainWord()}`,
      `app.${faker.internet.domainWord()}.${faker.internet.domainWord()}`,
      `${faker.internet.domainWord()}.${faker.internet.domainWord()}.mobile`,
    ];
    return faker.helpers.arrayElement(options);
  }
}

function generateTwitterHandle(): string {
  const options = [
    `@${faker.internet.username()}`,
    `@${faker.company
      .name()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")}`,
    `@${faker.internet.domainWord()}`,
    `@${faker.internet.domainWord()}${faker.number.int({ min: 10, max: 99 })}`,
  ];
  return faker.helpers.arrayElement(options).substring(0, 16); // Twitter handle max length
}

function generateProgramDescription(): string {
  const templates = [
    `We are committed to ensuring the security of our ${faker.hacker.noun()} platform. This bug bounty program rewards security researchers who responsibly disclose vulnerabilities in our ${faker.hacker.noun()} systems.`,

    `${faker.company.name()} runs a comprehensive security program. We encourage ethical hackers to help us identify and fix security issues in our ${faker.hacker.noun()} infrastructure.`,

    `Our bug bounty program covers security vulnerabilities in our ${faker.hacker.noun()} application. We value the security community's efforts in keeping our users safe and secure.`,

    `This program is designed to reward security researchers for finding and reporting security vulnerabilities in our ${faker.hacker.noun()} services. All reports are carefully reviewed by our security team.`,

    `We believe in working with the security community to improve our platform's security. This bug bounty program provides a safe harbor for researchers testing our ${faker.hacker.noun()} systems.`,
  ];

  return faker.helpers.arrayElement(templates);
}

function generateFakeProgram() {
  const assetType = faker.helpers.arrayElement([
    "web",
    "mobile",
  ] as AssetType[]);
  const eligibility = faker.helpers.arrayElement([
    "eligible",
    "ineligible",
  ] as EligibilityType[]);

  const startDate = faker.date.between({
    from: new Date("2023-01-01"),
    to: new Date("2024-12-31"),
  });

  const hasWebsite = faker.datatype.boolean({ probability: 0.8 });
  const hasTwitter = faker.datatype.boolean({ probability: 0.7 });
  const hasDescription = faker.datatype.boolean({ probability: 0.9 });

  return {
    name: `${faker.company.name()} Bug Bounty Program`,
    startDate,
    website: hasWebsite ? faker.internet.url() : null,
    twitter: hasTwitter ? generateTwitterHandle() : null,
    type: assetType,
    identifier: generateAssetIdentifier(assetType),
    description: hasDescription ? generateProgramDescription() : null,
    eligibility,
  };
}

async function seedPrograms() {
  try {
    console.log("Starting database seeding...");

    await db.delete(programs);

    const numberOfPrograms = 25;
    console.log(`Generating ${numberOfPrograms} fake programs...`);

    const fakePrograms = Array.from(
      { length: numberOfPrograms },
      generateFakeProgram,
    );

    const batchSize = 10;

    for (let i = 0; i < fakePrograms.length; i += batchSize) {
      const batch = fakePrograms.slice(i, i + batchSize);
      await db.insert(programs).values(batch);
      console.log(
        `Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(fakePrograms.length / batchSize)}`,
      );
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  seedPrograms();
}

export { seedPrograms, generateFakeProgram };

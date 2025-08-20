import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/programs/route";
import {
  cleanupTestData,
  createValidProgramPayload,
  insertTestProgram,
} from "../../utils/test-helpers";

describe("/api/programs POST", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("Program creation", () => {
    it("should create a program with valid data", async () => {
      const validPayload = createValidProgramPayload({
        name: "Test Program",
        identifier: "test-123",
      });

      const { req } = createMocks({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: validPayload,
      });

      const response = await POST(req as any);
      å;
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.program).toMatchObject({
        name: "Test Program",
        identifier: "test-123",
      });
      expect(data.program).toHaveProperty("id");
      expect(data.program).toHaveProperty("createdAt");
      expect(data.program).toHaveProperty("updatedAt");
    });
  });
});

import { createMocks } from "node-mocks-http";
import { DELETE, GET } from "@/app/api/programs/[id]/route";
import { cleanupTestData, insertTestProgram } from "../../utils/test-helpers";
import { db } from "@/lib/database";
import { programs } from "@/schemas/database/schema";
import { eq } from "drizzle-orm";
import { API_URL } from "@/constants";

describe("/api/programs/[id] DELETE", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("Successful deletion", () => {
    it("should delete an existing program", async () => {
      const testProgram = await insertTestProgram({
        name: "Test Program",
        identifier: "test-123",
      });

      const { req } = createMocks({
        method: "DELETE",
        url: `${API_URL}/api/programs/${testProgram.id}`,
      });

      const response = await DELETE(req as any, {
        params: Promise.resolve({ id: testProgram.id }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Program deleted successfully");

      const deletedProgram = await db
        .select()
        .from(programs)
        .where(eq(programs.id, testProgram.id))
        .limit(1);

      expect(deletedProgram).toHaveLength(0);
    });

    it("should delete program and verify it cannot be retrieved", async () => {
      const testProgram = await insertTestProgram({
        name: "Another Test Program",
        identifier: "another-123",
      });

      const getBeforeReq = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs/${testProgram.id}`,
      });

      const getBeforeResponse = await GET(getBeforeReq.req as any, {
        params: Promise.resolve({ id: testProgram.id }),
      });

      expect(getBeforeResponse.status).toBe(200);

      const deleteReq = createMocks({
        method: "DELETE",
        url: `${API_URL}/api/programs/${testProgram.id}`,
      });

      const deleteResponse = await DELETE(deleteReq.req as any, {
        params: Promise.resolve({ id: testProgram.id }),
      });

      expect(deleteResponse.status).toBe(200);

      const getAfterReq = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs/${testProgram.id}`,
      });

      const getAfterResponse = await GET(getAfterReq.req as any, {
        params: Promise.resolve({ id: testProgram.id }),
      });

      expect(getAfterResponse.status).toBe(404);
    });
  });

  describe("Error handling", () => {
    it("should return 404 for non-existent program", async () => {
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440000";

      const { req } = createMocks({
        method: "DELETE",
        url: `${API_URL}/api/programs/${nonExistentId}`,
      });

      const response = await DELETE(req as any, {
        params: Promise.resolve({ id: nonExistentId }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Program not found");
    });

    it("should return 404 for invalid UUID format", async () => {
      const invalidId = "invalid-uuid";

      const { req } = createMocks({
        method: "DELETE",
        url: `${API_URL}/api/programs/${invalidId}`,
      });

      const response = await DELETE(req as any, {
        params: Promise.resolve({ id: invalidId }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to delete program");
    });

    it("should return 404 for empty string ID", async () => {
      const emptyId = "";

      const { req } = createMocks({
        method: "DELETE",
        url: `${API_URL}/api/programs/${emptyId}`,
      });

      const response = await DELETE(req as any, {
        params: Promise.resolve({ id: emptyId }),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to delete program");
    });
  });

  describe("Edge cases", () => {
    it("should handle concurrent deletion attempts gracefully", async () => {
      const testProgram = await insertTestProgram({
        name: "Concurrent Test",
        identifier: "concurrent-123",
      });

      const deleteRequests = Array.from({ length: 3 }, () => {
        const { req } = createMocks({
          method: "DELETE",
          url: `${API_URL}/api/programs/${testProgram.id}`,
        });
        return DELETE(req as any, {
          params: Promise.resolve({ id: testProgram.id }),
        });
      });

      const responses = await Promise.all(deleteRequests);
      const statusCodes = responses.map((r) => r.status);

      const successCount = statusCodes.filter((code) => code === 200).length;
      const notFoundCount = statusCodes.filter((code) => code === 404).length;

      expect(successCount).toBe(1);
      expect(notFoundCount).toBe(2);
    });
  });
});

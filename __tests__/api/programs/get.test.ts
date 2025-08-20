import { createMocks } from "node-mocks-http";
import { GET } from "@/app/api/programs/route";
import {
  cleanupTestData,
  insertMultipleTestPrograms,
  insertTestProgram,
} from "../../utils/test-helpers";
import { API_URL } from "@/constants";

describe("/api/programs GET", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("Basic", () => {
    it("should return empty programs list when no programs exist", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toEqual([]);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it("should return programs with default pagination", async () => {
      await insertMultipleTestPrograms(5);

      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/program`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(5);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        totalCount: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it("should return programs with correct structure", async () => {
      const testProgram = await insertTestProgram({
        name: "Test Program",
        identifier: "test-123",
        eligibility: "eligible",
      });

      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs[0]).toMatchObject({
        id: testProgram.id,
        name: "Test Program",
        identifier: "test-123",
        eligibility: "eligible",
      });
      expect(data.programs[0]).toHaveProperty("startDate");
      expect(data.programs[0]).toHaveProperty("createdAt");
      expect(data.programs[0]).toHaveProperty("updatedAt");
    });
  });

  describe("Pagination", () => {
    beforeEach(async () => {
      await insertMultipleTestPrograms(25); // Create 25 test programs
    });

    it("should handle pagination correctly", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?page=2&limit=10`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(10);
      expect(data.pagination).toEqual({
        page: 2,
        limit: 10,
        totalCount: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it("should handle last page correctly", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?page=3&limit=10`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(5);
      expect(data.pagination).toEqual({
        page: 3,
        limit: 10,
        totalCount: 25,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it("should handle custom page size", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?page=1&limit=5`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(5);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 5,
        totalCount: 25,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });
  });

  describe("Sorting", () => {
    beforeEach(async () => {
      await insertTestProgram({
        name: "Alpha Program",
        eligibility: "eligible",
      });
      await insertTestProgram({
        name: "Beta Program",
        eligibility: "ineligible",
      });
      await insertTestProgram({
        name: "Charlie Program",
        eligibility: "eligible",
      });
    });

    it("should sort by name ascending", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?sortBy=name&sortOrder=asc`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(3);
      expect(data.programs[0].name).toBe("Alpha Program");
      expect(data.programs[1].name).toBe("Beta Program");
      expect(data.programs[2].name).toBe("Charlie Program");
    });

    it("should sort by name descending", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?sortBy=name&sortOrder=desc`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs[0].name).toBe("Charlie Program");
      expect(data.programs[1].name).toBe("Beta Program");
      expect(data.programs[2].name).toBe("Alpha Program");
    });

    it("should sort by eligibility", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?sortBy=eligibility&sortOrder=asc`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs[0].eligibility).toBe("eligible");
      expect(data.programs[2].eligibility).toBe("ineligible");
    });
  });

  describe("Combined pagination and sorting", () => {
    beforeEach(async () => {
      for (let i = 1; i <= 15; i++) {
        await insertTestProgram({
          name: `Program ${i.toString().padStart(2, "0")}`,
          eligibility: i % 2 === 0 ? "eligible" : "ineligible",
        });
      }
    });

    it("should combine sorting and pagination correctly", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?sortBy=name&sortOrder=asc&page=2&limit=5`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(5);
      expect(data.programs[0].name).toBe("Program 06");
      expect(data.programs[4].name).toBe("Program 10");
      expect(data.pagination).toEqual({
        page: 2,
        limit: 5,
        totalCount: 15,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });
  });

  describe("Error handling", () => {
    it("should return 400 for invalid sortBy field", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?sortBy=invalidField`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid sortBy field");
    });

    it("should return 400 for invalid sortOrder", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?sortOrder=invalid`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid sortOrder. Must be "asc" or "desc"');
    });

    it("should return 400 for invalid page number", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?page=0`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Page must be greater than 0");
    });

    it("should return 400 for invalid limit", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?limit=101`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Limit must be between 1 and 100");
    });

    it("should return 400 for limit less than 1", async () => {
      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs?limit=0`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Limit must be between 1 and 100");
    });
  });

  describe("Default values", () => {
    it("should use default sorting when not specified", async () => {
      await insertTestProgram({ name: "Test Program" });

      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(1);
    });

    it("should use default pagination when not specified", async () => {
      await insertMultipleTestPrograms(5);

      const { req } = createMocks({
        method: "GET",
        url: `${API_URL}/api/programs`,
      });

      const response = await GET(req as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });
  });
});

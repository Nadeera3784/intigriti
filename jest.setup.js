beforeAll(() => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ||
    "postgresql://psuser:pspassord@localhost:5332/test_psdtabase";
});

afterAll(() => {});

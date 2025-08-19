// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://psuser:pspassord@localhost:5332/test_psdtabase'
})

// Clean up after tests
afterAll(() => {
  // Any cleanup if needed
})

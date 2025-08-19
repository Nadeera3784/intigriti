# API Test Suite

## Overview
Comprehensive test suite for the Intigriti Programs API covering all CRUD operations with edge cases, validation, and error handling.

## Installation

Install test dependencies:
```bash
npm install --save-dev @types/jest @types/supertest jest jest-environment-node supertest ts-jest
```

## Test Structure

```
__tests__/
├── api/
│   └── programs/
│       ├── get.test.ts          # GET /api/programs (pagination, sorting)
│       ├── post.test.ts         # POST /api/programs (creation, validation)
│       ├── delete.test.ts       # DELETE /api/programs/[id] 
│       ├── get-by-id.test.ts    # GET /api/programs/[id]
│       └── index.test.ts        # Integration test runner
└── utils/
    └── test-helpers.ts          # Test utilities and database helpers
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Suite
```bash
npm test -- __tests__/api/programs/get.test.ts
```

## Test Coverage

### GET /api/programs (112 test cases)
- ✅ Empty and populated lists
- ✅ Pagination (page, limit, boundaries)
- ✅ Sorting (name, startDate, eligibility - asc/desc)
- ✅ Combined pagination + sorting
- ✅ Error handling (invalid parameters)
- ✅ Default values

### POST /api/programs (67 test cases)
- ✅ Successful creation (minimal, full data)
- ✅ Program relations
- ✅ Validation errors (missing/invalid fields)
- ✅ Date handling (future dates, ISO strings)
- ✅ Error handling (malformed JSON)
- ✅ Special characters and unicode

### DELETE /api/programs/[id] (34 test cases)
- ✅ Successful deletion
- ✅ Error handling (404, invalid UUID)
- ✅ Multiple deletions
- ✅ Database consistency
- ✅ Concurrent deletion attempts

### GET /api/programs/[id] (28 test cases)
- ✅ Successful retrieval
- ✅ Error handling (404, invalid UUID)
- ✅ Different program types/eligibility
- ✅ Special characters and edge cases
- ✅ Response structure validation

## Test Database Setup

1. **Start Test Database**:
   ```bash
   docker-compose up -d postgres
   ```

2. **Create Test Database**:
   ```sql
   CREATE DATABASE test_psdtabase;
   ```

3. **Run Migrations**:
   ```bash
   DATABASE_URL=postgresql://psuser:pspassord@localhost:5332/test_psdtabase npm run db:push
   ```

## Environment Variables

```bash
# .env.test (create this file)
NODE_ENV=test
DATABASE_URL=postgresql://psuser:pspassord@localhost:5332/test_psdtabase
NEXT_TELEMETRY_DISABLED=1
```

## Test Utilities

### `test-helpers.ts`
- `createTestProgram()` - Generate fake program data
- `insertTestProgram()` - Insert test program into DB
- `insertMultipleTestPrograms()` - Insert multiple programs
- `cleanupTestData()` - Clean test data after tests
- `createValidProgramPayload()` - Valid POST request payload

### Database Cleanup
Tests automatically clean up after themselves using `beforeEach` and `afterAll` hooks.

## Mock Data

Uses `@faker-js/faker` for generating realistic test data:
- Program names (company names)
- Identifiers (alphanumeric)
- Dates (future dates)
- URLs and usernames
- Descriptions (lorem text)

## Assertions

Tests verify:
- **HTTP Status Codes** (200, 201, 400, 404, 500)
- **Response Structure** (correct JSON format)
- **Data Integrity** (database state after operations)
- **Business Logic** (pagination math, sorting order)
- **Error Messages** (user-friendly error responses)

## Performance Considerations

- Tests run in parallel where possible
- Database cleanup is efficient
- Faker generates lightweight test data
- Timeout set to 10 seconds for DB operations

## CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Run Tests
  run: |
    npm install
    npm run test:coverage
  env:
    DATABASE_URL: postgresql://postgres:password@localhost:5432/test_db
```

## Debugging Tests

1. **View Test Output**:
   ```bash
   npm test -- --verbose
   ```

2. **Debug Single Test**:
   ```bash
   npm test -- --testNamePattern="should create a program"
   ```

3. **Database State**:
   - Use pgAdmin on `localhost:5050`
   - Check test database: `test_psdtabase`

## Common Issues

1. **Database Connection**: Ensure Docker containers are running
2. **Test Isolation**: Tests clean up data automatically
3. **Async Operations**: All DB operations use `await`
4. **UUID Format**: Tests handle invalid UUID formats gracefully

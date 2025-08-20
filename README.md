# Intigriti

A Next.js application for managing bug bounty programs with sorting, pagination, and CRUD operations.

## Prerequisites

- **Node.js** (22 or higher)
- **npm**
- **Docker** and **Docker Compose** (for database)
- **Git**

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd intigriti
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Database

Start PostgreSQL and pgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This will start:

- **PostgreSQL** on port `5332`
- **pgAdmin** on port `5050` (admin@admin.com / admin)

### 4. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://psuser:pspassord@localhost:5332/psdtabase"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Database Migration

Run the database migrations:

```bash
npm run db:push
# or
npx drizzle-kit push
```

### 6. Seed Database (Optional)

If you have a seed script:

```bash
npm run db:seed
# or
node scripts/seed.ts
```

### 7. Start the Development Server

```bash
npm run dev

```

The application will be available at `http://localhost:3000`

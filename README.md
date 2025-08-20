# Intigriti

A Next.js application for managing bug bounty programs with sorting, pagination, and CRUD operations.

## Prerequisites

- **Docker** and **Docker Compose**
- **Git**

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd intigriti
```

### Start the docker

Start PostgreSQL and pgAdmin using Docker Compose:

```bash
docker-compose up -d --build
```

This will start:

- **PostgreSQL** on port `5332`
- **npm run dev** on port `3000`
- **pgAdmin** on port `5050` (admin@admin.com / admin)


### 2. Database Migration

Run the database migrations(run inside the docker container):

```bash
npm run db:push
# or
npx drizzle-kit push
```

### 3. Seed Database (Optional)

If you have a seed script(run inside the docker container):

```bash
npm run db:seed
# or
node scripts/seed.ts
```


The application will be available at `http://localhost:3000`

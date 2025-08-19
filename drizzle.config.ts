import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './schemas/database/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.NEXT_POSTGRES_URL || '',
  },
})


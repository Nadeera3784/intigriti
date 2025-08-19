import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../schemas/database/schema'

const connectionString = process.env.NEXT_POSTGRES_URL || ''

const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });

export const migrationClient = postgres(connectionString, { max: 1 })

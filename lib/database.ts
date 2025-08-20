import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schemas/database/schema";
import { POSTGRES_URL } from "@/constants";

const queryClient = postgres(POSTGRES_URL);

export const db = drizzle(queryClient, { schema });

export const migrationClient = postgres(POSTGRES_URL, { max: 1 });

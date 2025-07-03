import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient);

export async function resetDatabase() {
  try {
    // Drop all tables
    await db.execute(sql`DROP TABLE IF EXISTS "chat-pro_contact" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "chat-pro_user" CASCADE`);

    // Recreate tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "chat-pro_user" (
        "id" text PRIMARY KEY,
        "name" varchar(256),
        "email" varchar(256),
        "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp with time zone
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "chat-pro_contact" (
        "userId" text REFERENCES "chat-pro_user"("id") ON DELETE CASCADE,
        "contactId" text REFERENCES "chat-pro_user"("id") ON DELETE CASCADE,
        "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp with time zone,
        PRIMARY KEY ("userId", "contactId")
      )
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "idx_contacts_user_id" ON "chat-pro_contact" ("userId")
    `);

    console.log("Database reset successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw error;
  } finally {
    await queryClient.end();
  }
}

// Allow running directly from command line
if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to reset database:", error);
      process.exit(1);
    });
}

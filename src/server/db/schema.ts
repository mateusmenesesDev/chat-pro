// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `chat-pro_${name}`);

export const users = createTable("user", (d) => ({
  id: d.text().primaryKey(),
  name: d.varchar({ length: 256 }),
  email: d.varchar({ length: 256 }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const contacts = createTable(
  "contact",
  (d) => ({
    userId: d.text().references(() => users.id, { onDelete: "cascade" }),
    contactId: d.text().references(() => users.id, { onDelete: "cascade" }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (table) => [
    primaryKey({ columns: [table.userId, table.contactId] }),
    index("idx_contacts_user_id").on(table.userId),
  ],
);

export const contactsRelations = relations(contacts, ({ one }) => ({
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
  contact: one(users, {
    fields: [contacts.contactId],
    references: [users.id],
  }),
}));

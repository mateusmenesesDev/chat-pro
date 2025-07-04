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

export const conversations = createTable(
  "conversation",
  (d) => ({
    id: d.text().primaryKey(),
    userAId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userBId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    lastMessageAt: d.timestamp({ withTimezone: true }),
  }),
  (table) => [
    index("idx_conversations_user_a_id").on(table.userAId),
    index("idx_conversations_user_b_id").on(table.userBId),
    index("idx_conversations_last_message_at").on(table.lastMessageAt),
  ],
);

export const conversationRelations = relations(
  conversations,
  ({ one, many }) => ({
    userA: one(users, {
      fields: [conversations.userAId],
      references: [users.id],
      relationName: "userA",
    }),
    userB: one(users, {
      fields: [conversations.userBId],
      references: [users.id],
      relationName: "userB",
    }),
    messages: many(messages),
  }),
);

export const messages = createTable(
  "message",
  (d) => ({
    id: d.text().primaryKey(),
    conversationId: d
      .text()
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: d.varchar({ length: 5000 }).notNull(),
    sentAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    readAt: d.timestamp({ withTimezone: true }),
  }),
  (table) => [
    index("idx_messages_conversation_id").on(table.conversationId),
    index("idx_messages_sender_id").on(table.senderId),
  ],
);

export const messageRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

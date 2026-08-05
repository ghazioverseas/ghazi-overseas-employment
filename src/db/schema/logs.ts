import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const systemLogs = pgTable(
  "system_logs",
  {
    id: text("id").primaryKey(),
    level: text("level").notNull(), // 'info' | 'warn' | 'error' | 'fatal'
    category: text("category").notNull(), // 'auth' | 'server' | 'upload' | 'database' | 'validation'
    message: text("message").notNull(),
    metadata: jsonb("metadata"),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    levelIdx: index("log_level_idx").on(table.level),
    categoryIdx: index("log_category_idx").on(table.category),
    createdIdx: index("log_created_idx").on(table.createdAt),
  })
);

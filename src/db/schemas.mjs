import { text, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(), 
  email: text("email").notNull(),
  description: text("description").default("This my comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export { leads };

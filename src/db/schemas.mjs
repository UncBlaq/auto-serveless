import { text, pgTable, timestamp, uuid, boolean, integer, pgEnum} from "drizzle-orm/pg-core";


const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(), 
  email: text("email").notNull(),
  description: text("description").default("This my comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),
  password: text('password').notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
  discordId: text('discord_id').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),

  address: text('address'),
  nonce: integer('nonce'),
});


export { leads, users };

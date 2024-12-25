import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  real,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

export const RoleEnum = pgEnum("roles", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  twoFactorEnabled: boolean("twoFactorEnabled").notNull().default(false),
  role: RoleEnum("roles").notNull().default("USER"),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const emailVerificationTokens = pgTable(
  "email_verification_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

export const passwordResetTokens = pgTable("password_reset_token", {
  token: text("token").notNull(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const twoFactorTokens = pgTable("two_factor_token", {
  token: text("token").notNull(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  price: real("price").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" })
    .default(sql.raw("CURRENT_TIMESTAMP"))
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .default(sql.raw("CURRENT_TIMESTAMP"))
    .notNull(),
});

export const productVariants = pgTable("product_variant", {
  id: serial("id").primaryKey().notNull(),
  color: text("color").notNull(),
  productType: text("product_type").notNull(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

export const variantImages = pgTable("variant_image", {
  id: serial("id").primaryKey().notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  variantId: integer("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const variantTags = pgTable("variant_tag", {
  id: serial("id").primaryKey().notNull(),
  tag: text("tag").notNull(),
  variantId: integer("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

export const productRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  reviews: many(reviews),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),

    tags: many(variantTags),
    images: many(variantImages),
  })
);

export const variantImagesRelations = relations(variantImages, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantImages.variantId],
    references: [productVariants.id],
  }),
}));

export const variantTagsRelations = relations(variantTags, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantTags.variantId],
    references: [productVariants.id],
  }),
}));

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" })
    .default(sql.raw("CURRENT_TIMESTAMP"))
    .notNull(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

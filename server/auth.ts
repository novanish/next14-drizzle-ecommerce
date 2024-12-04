import { loginSchema } from "@/types/login-schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq, sql } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from ".";
import { accounts, users } from "./schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (!token.sub) return session;
      Object.assign(session.user, token);
      session.user.id = token.sub;

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const [
        user,
        {
          rows: [{ isOAuth }],
        },
      ] = await Promise.all([
        db.query.users.findFirst({
          columns: { password: false },
          where: eq(users.id, token.sub),
        }),

        db.execute<{ isOAuth: boolean }>(
          sql`select exists (select 1 from ${accounts} where ${accounts.userId} = ${token.sub}) as "isOAuth"`
        ),
      ]);

      if (!user) return token;

      token.isOAuth = isOAuth;
      token.role = user.role;
      token.twoFactorEnabled = user.twoFactorEnabled;
      token.name = user.name;
      token.image = user.image;

      return token;
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email } = validatedFields.data;
        const user = await db.query.users.findFirst({
          columns: { password: false },
          where: eq(users.email, email),
        });
        return user ?? null;
      },
    }),
  ],
});

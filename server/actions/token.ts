"use server";

import { eq, sql } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "..";
import {
  emailVerificationTokens,
  passwordResetTokens,
  users,
} from "@/server/schema";

export async function generateEmailVerificationToken(userId: string) {
  const token = crypto.randomBytes(64).toString("hex");
  await db
    .insert(emailVerificationTokens)
    .values({
      token,
      userId,
      expires: sql`NOW() + INTERVAL '1 DAY'`,
    })
    .onConflictDoUpdate({
      target: emailVerificationTokens.userId,
      set: {
        token,
        expires: sql.raw(`EXCLUDED.${emailVerificationTokens.expires.name}`),
      },
    });

  return token;
}

export async function verifyEmailVerificationToken(token: string) {
  const now = new Date();
  const verificationToken = await db.query.emailVerificationTokens.findFirst({
    columns: { id: false },
    where: eq(emailVerificationTokens.token, token),
  });
  if (!verificationToken) {
    return { error: "Invalid token" };
  }

  if (verificationToken.expires < now) {
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));
    return { error: "Token expired" };
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, token));

      await tx
        .update(users)
        .set({ emailVerified: sql.raw("NOW()") })
        .where(eq(users.id, verificationToken.userId));
    });
  } catch (e) {
    console.error(e);
    return { error: "An error occurred" };
  }

  return null;
}

export async function generateForgotPasswordVerificationToken(userId: string) {
  const token = crypto.randomBytes(64).toString("hex");
  const hashedToken = await hashToken(token);

  await db
    .insert(passwordResetTokens)
    .values({
      userId,
      token: hashedToken,
      expires: sql`NOW() + INTERVAL '7 MINUTES'`,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: hashedToken,
        expires: sql.raw(`EXCLUDED.${passwordResetTokens.expires.name}`),
      },
    });

  return token;
}

export async function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

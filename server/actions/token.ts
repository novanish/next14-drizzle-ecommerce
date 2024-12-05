"use server";

import { eq, sql } from "drizzle-orm";
import crypto from "node:crypto";
import { db } from "..";
import {
  emailVerificationTokens,
  passwordResetTokens,
  twoFactorTokens,
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

export async function verfiyTwoFactorToken(token: string) {
  const now = new Date();
  const twoFactorToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.token, token),
  });

  if (!twoFactorToken) {
    return { error: "Invalid token" };
  }

  await db.delete(twoFactorTokens).where(eq(twoFactorTokens.token, token));

  if (twoFactorToken.expires < now) {
    return { error: "Token expired" };
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

export async function generateOTPForTwoFactor(userId: string) {
  const otp = generateOTP();

  await db
    .insert(twoFactorTokens)
    .values({ userId, token: otp, expires: sql`NOW() + INTERVAL '7 MINUTES'` })
    .onConflictDoUpdate({
      target: twoFactorTokens.userId,
      set: {
        token: otp,
        expires: sql.raw(`EXCLUDED.${twoFactorTokens.expires.name}`),
      },
    });

  return otp;
}

function generateOTP(length = 6) {
  return crypto
    .randomInt(0, 10 ** length)
    .toString()
    .padStart(length, "0");
}

export async function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

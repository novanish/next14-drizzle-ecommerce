"use server";

import { resetPasswordSchema } from "@/types/reset-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { passwordResetTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { hashToken } from "./token";

const actionClient = createSafeActionClient();

export const resetPassword = actionClient
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    const hashedToken = await hashToken(parsedInput.token);
    const forgotPasswordToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, hashedToken),
    });

    if (!forgotPasswordToken) {
      return { error: "Invalid token" };
    }

    if (forgotPasswordToken.expires < new Date()) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, hashedToken));
      return { error: "Token expired" };
    }

    try {
      const hashedPassword = await bcrypt.hash(parsedInput.password, 10);

      await await db.transaction(async (tx) => {
        await tx
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.token, hashedToken));

        await tx
          .update(users)
          .set({
            password: hashedPassword,
          })
          .where(eq(users.id, forgotPasswordToken.userId));
      });
    } catch (error) {
      console.error(error);
    }
  });

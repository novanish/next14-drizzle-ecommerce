"use server";

import { forgotPasswordSchema } from "@/types/forgot-password-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import {
  generateEmailVerificationToken,
  generateForgotPasswordVerificationToken,
} from "./token";
import { sendForgotPasswordEmail } from "./email";

const actionClient = createSafeActionClient();

export const forgotPassword = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    const user = await db.query.users.findFirst({
      columns: { id: true, emailVerified: true },
      where: eq(users.email, parsedInput.email),
    });

    if (user && !user.emailVerified) {
      const token = await generateEmailVerificationToken(user.id);
      // await sendVerificationEmail(parsedInput.email, token);
      console.log(token);
    }

    if (user && user.emailVerified) {
      const token = await generateForgotPasswordVerificationToken(user.id);
      await sendForgotPasswordEmail(parsedInput.email, token);
      console.log(token);
    }

    return {
      message: "Please check your email",
    };
  });

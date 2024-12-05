"use server";

import { loginSchema } from "@/types/login-schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "@/server/schema";
import {
  generateEmailVerificationToken,
  generateOTPForTwoFactor,
  verfiyTwoFactorToken,
} from "./token";
import { signIn } from "@/server/auth";

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        password: true,
        emailVerified: true,
        twoFactorEnabled: true,
      },
      where: eq(users.email, parsedInput.email),
    });
    if (!user) {
      return { error: "Invalid credientals" };
    }

    const isValidPassword = await bcrypt.compare(
      parsedInput.password,
      user.password
    );
    if (!isValidPassword) {
      return { error: "Invalid credientals" };
    }

    if (!user.emailVerified) {
      const token = await generateEmailVerificationToken(user.id);
      // await sendVerificationEmail(parsedInput.email, token);
      console.log(token);
      return { error: "Please verify your email" };
    }

    if (!parsedInput.code && user.twoFactorEnabled) {
      const token = await generateOTPForTwoFactor(user.id);
      // send two factor code to user email
      console.log(token);

      return { showTwoFactor: true };
    }

    if (parsedInput.code && user.twoFactorEnabled) {
      const isValidToken = await verfiyTwoFactorToken(parsedInput.code);
      if (isValidToken != null) return isValidToken;
    }

    await signIn("credentials", {
      email: parsedInput.email,
      password: parsedInput.password,
      redirectTo: "/",
    });
  });

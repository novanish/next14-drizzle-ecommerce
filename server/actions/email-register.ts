"use server";

import { registerSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { generateEmailVerificationToken } from "./token";
import { sendVerificationEmail } from "./email";
import { isDatabaseError, PostgresErrorCode } from "../database-error";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const hashedPassword = await bcrypt.hash(parsedInput.password, 10);
      const user = await db
        .insert(users)
        .values({
          name: parsedInput.name,
          email: parsedInput.email,
          password: hashedPassword,
          image: null,
          role: "USER",
        })
        .returning({ insertedId: users.id });

      const token = await generateEmailVerificationToken(user[0].insertedId);
      await sendVerificationEmail(parsedInput.email, token);

      return { message: "Please check your email to verify your account" };
    } catch (e) {
      if (
        isDatabaseError(e) &&
        e.code === PostgresErrorCode.UniqueViolation &&
        e.detail.includes("email")
      ) {
        return { error: "Email is already registered" };
      }

      console.error(e);
      return { error: "An error occurred" };
    }
  });

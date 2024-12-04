"use server";

import { settingSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

const actionClient = createSafeActionClient();

export const settings = actionClient
  .schema(settingSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session) return { error: "You must be logged in." };
    if (session.user.isOAuth) {
      Object.assign(parsedInput, { twoFactorEnabled: undefined });
    }

    await db
      .update(users)
      .set(parsedInput)
      .where(eq(users.id, session.user.id));

    return { message: "Settings updated successfully." };
  });

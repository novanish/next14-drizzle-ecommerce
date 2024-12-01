import * as z from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be between 8 and 30 characters" })
      .max(30, { message: "Password must be between 8 and 30 characters" }),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .superRefine((data) => {
    if (data.password !== data.confirmPassword) {
      return { confirmPassword: "Passwords do not match" };
    }

    return {};
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

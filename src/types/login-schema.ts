import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string(),
  code: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

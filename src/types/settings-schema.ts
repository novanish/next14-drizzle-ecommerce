import * as z from "zod";

export const settingSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
});

export type SettingSchema = z.infer<typeof settingSchema>;

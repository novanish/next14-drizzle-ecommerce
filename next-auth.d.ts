import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  name: string;
  role: string;
  twoFactorEnabled: boolean;
  isOAuth: boolean;
  id: string;
  image?: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

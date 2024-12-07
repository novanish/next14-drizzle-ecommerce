import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { SettingCard } from "./setting-card";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/");

  return <SettingCard session={session} />;
}

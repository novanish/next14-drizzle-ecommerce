import { auth } from "@/server/auth";
import { DashboardNav } from "@/components/navigation/dashboard-nav";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div>
      <DashboardNav isAdmin={isAdmin} />
      {children}
    </div>
  );
}

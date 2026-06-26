import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Sidebar from "~/app/_components/@molecules/Sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-main-background-primary">
      <Sidebar />
      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}

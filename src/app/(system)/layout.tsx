import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "~/common/components/Header";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  if (!user.userId) {
    redirect("/login");
  }

  return (
    <main>
      <Header />
      {children}
    </main>
  );
}

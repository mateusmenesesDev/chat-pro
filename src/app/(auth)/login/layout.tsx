import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  if (user.userId) {
    redirect("/");
  }

  return <main>{children}</main>;
}

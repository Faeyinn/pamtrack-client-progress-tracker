import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function requireAdminSession(): Promise<{ userId: string }> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("admin_session")?.value;

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    cookieStore.delete("admin_session");
    throw new Error("UNAUTHORIZED");
  }

  return { userId: user.id };
}

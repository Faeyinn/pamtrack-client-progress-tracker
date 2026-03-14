import { requireAdminSession } from "@/lib/api/admin";
import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./profile-client";

export default async function AdminProfilePage() {
  const { userId } = await requireAdminSession();
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      createdAt: true,
    }
  });

  return <ProfileClient initialUser={user} />;
}

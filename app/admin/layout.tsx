import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Halaman administrasi PAM Techno Progress Tracker",
  robots: {
    index: false,
    follow: false,
  },
};

import { AdminShell } from "@/components/admin/shared/admin-shell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}

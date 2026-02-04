"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/shared/sidebar";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/login";

  return (
    <div className="flex min-h-screen bg-background">
      {!hideSidebar && <Sidebar />}
      <div
        className={
          hideSidebar
            ? "flex-1"
            : "flex-1 md:ml-72 px-4 sm:px-6 lg:px-8 transition-all duration-300"
        }
      >
        {children}
      </div>
    </div>
  );
}

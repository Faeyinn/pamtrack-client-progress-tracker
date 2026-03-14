"use client";

import { ReactNode, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/shared/sidebar";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

import { PageBackground } from "@/components/shared/page-background";

interface AdminShellProps {
  children: ReactNode;
}

const subscribe = () => () => {};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/login";
  const { isCollapsed } = useSidebarStore();
  
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="premium-bg">
        <PageBackground variant="simple" />
        {!hideSidebar && <div className="hidden md:block h-screen w-72 border-r border-border/40 bg-background/60 relative z-20" />}
        <div className={cn("flex-1 px-4 sm:px-6 lg:px-8 relative z-10", !hideSidebar && "md:ml-72")}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="premium-bg">
      <PageBackground variant="simple" />
      {!hideSidebar && <Sidebar />}
      <motion.div
        initial={false}
        animate={{ 
          marginLeft: hideSidebar ? 0 : isCollapsed ? 96 : 288 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-1 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

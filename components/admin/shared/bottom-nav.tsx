"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NewProjectModal } from "@/components/admin/dashboard/new-project-modal";

interface BottomNavProps {
  onProjectCreated?: () => void;
}

export function BottomNav({ onProjectCreated }: BottomNavProps) {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    {
      href: "/admin/dashboard",
      icon: Home,
      label: "Dashboard",
      isActive: pathname === "/admin/dashboard",
    },
    {
      icon: Plus,
      label: "Tambah",
      isButton: true,
    },
    {
      href: "/admin/projects",
      icon: FolderKanban,
      label: "Proyek",
      isActive: pathname.startsWith("/admin/projects"),
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item, index) => {
            if (item.isButton) {
              return (
                <button
                  key={index}
                  onClick={() => setShowModal(true)}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-2 -mt-4"
                >
                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95">
                    <item.icon className="w-6 h-6" />
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={index}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-15 rounded-lg transition-all touch-target",
                  item.isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "relative p-1.5 rounded-lg transition-colors",
                    item.isActive && "bg-foreground/10",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-foreground" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Modal triggered by bottom nav */}
      {showModal && (
        <NewProjectModal
          onSuccess={() => {
            setShowModal(false);
            onProjectCreated?.();
          }}
          triggerButton={false}
          open={showModal}
          onOpenChange={setShowModal}
        />
      )}
    </>
  );
}

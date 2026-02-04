"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/components/admin/hooks/use-current-user";

export function DashboardHeader() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-8 h-8 transition-transform duration-300 group-hover:rotate-12">
            <div className="absolute inset-0 bg-primary/10 rounded-lg rotate-3 transition-transform group-hover:rotate-6" />
            <div className="absolute inset-0 bg-background rounded-lg border border-border/20 flex items-center justify-center p-1.5 shadow-sm">
              <Image
                src="/logo-pure.png"
                alt="PAM Logo"
                width={24}
                height={24}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-foreground leading-tight tracking-tight">
              PAM Techno
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium">
              Panel Admin
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-8 h-8 bg-muted/50 border border-border/20 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="User menu"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 mt-2 p-2"
              sideOffset={4}
            >
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user
                      ? `${user.username}@pamtechno.com`
                      : "admin@pamtechno.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild className="rounded-md">
                <Link
                  href="/admin/profile"
                  className="cursor-pointer flex items-center font-medium"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Lihat Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:bg-destructive focus:text-white cursor-pointer rounded-md font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

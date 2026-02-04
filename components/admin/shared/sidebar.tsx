"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Loader2,
  Search,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/components/admin/hooks/use-current-user";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Proyek",
    href: "/admin/projects",
    icon: FolderKanban,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [projectQuery, setProjectQuery] = React.useState("");
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProjectSearch = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") return;
    const query = projectQuery.trim();

    if (query.length === 0) {
      router.push("/admin/projects");
      return;
    }

    router.push(`/admin/projects?search=${encodeURIComponent(query)}`);
  };

  return (
    <aside className="hidden md:flex h-screen w-72 flex-col fixed left-0 top-0 border-r border-border/40 bg-background/60 backdrop-blur-3xl z-50 overflow-hidden">
      {/* Soft background glows for premium feel */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      {/* Logo Area */}
      <div className="h-24 flex items-center px-8 border-b border-border/10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-foreground/5 group overflow-hidden transition-transform hover:scale-105 active:scale-95 duration-500 border border-border/10">
            <Image
              src="/logo-pure.png"
              alt="PAM Techno"
              width={28}
              height={28}
              className="object-contain"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="leading-tight">
            <span className="block font-black text-xl tracking-tighter uppercase text-foreground">
              PAM<span className="text-primary">.</span>Techno
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Panel Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 px-5 space-y-8 relative z-10 overflow-y-auto custom-scrollbar">
        {/* Search Matrix */}
        <div className="space-y-3">
          <p className="px-3 text-[9px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">
            Pencarian
          </p>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
            <Input
              value={projectQuery}
              onChange={(event) => setProjectQuery(event.target.value)}
              onKeyDown={handleProjectSearch}
              placeholder="Cari proyek..."
              className="h-11 rounded-2xl pl-11 bg-foreground/[0.03] border-border/40 focus:ring-2 focus:ring-foreground/5 transition-all text-[11px] font-bold tracking-tight"
            />
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-3">
          <p className="px-3 text-[9px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">
            Menu Utama
          </p>
          <div className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group outline-none",
                    isActive
                      ? "bg-foreground text-background shadow-2xl shadow-foreground/10"
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-all duration-500 group-hover:scale-110",
                      isActive ? "text-background" : "text-muted-foreground",
                    )}
                  />
                  {link.title}
                  {isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Rapid Deployment */}
        <div className="space-y-4">
          <p className="px-3 text-[9px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">
            Aksi Cepat
          </p>
          <Button
            size="lg"
            className="w-full h-14 justify-start rounded-2xl bg-foreground/[0.02] border border-border/40 hover:bg-foreground/5 hover:border-border/60 text-foreground transition-all duration-300 gap-3 group px-4"
            onClick={() => router.push("/admin/projects?newProject=true")}
          >
            <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center shadow-lg group-hover:rotate-90 transition-transform duration-500">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Proyek Baru
            </span>
          </Button>
        </div>
      </div>

      {/* Footer / High Command */}
      <div className="p-6 border-t border-border/10 bg-foreground/[0.01] space-y-6 relative z-10">
        <Link href="/admin/profile">
          <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-background/40 border border-border/40 transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/5 group cursor-pointer hover:bg-background/60">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background text-xs font-black shadow-xl group-hover:-rotate-3 transition-transform">
                {user?.username
                  ? user.username.substring(0, 2).toUpperCase()
                  : "AD"}
              </div>
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-xl border-[3px] border-background bg-emerald-500 animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-foreground uppercase tracking-wider mb-0.5 group-hover:text-primary transition-colors">
                {user?.username || "Administrator"}
              </p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10 w-fit">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  Online
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Button
          variant="ghost"
          className="w-full h-14 justify-start text-destructive hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all duration-300 gap-3 px-4"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isLoggingOut ? "Keluar..." : "Log Out"}
          </span>
        </Button>
      </div>
    </aside>
  );
}

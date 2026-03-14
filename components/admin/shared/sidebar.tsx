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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/components/admin/hooks/use-current-user";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "motion/react";

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
  const { isCollapsed, toggle } = useSidebarStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 96 : 288 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex h-screen flex-col fixed left-0 top-0 border-r border-border/40 bg-background/80 backdrop-blur-xl z-50 transition-colors duration-300"
      >
        {/* Soft background glows */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />
        
        {/* Toggle Button - Now fully visible outside clipped area */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-12 w-6 h-12 bg-background border border-border/60 rounded-full flex items-center justify-center shadow-xl z-[60] hover:bg-primary/5 hover:border-primary/30 transition-all group cursor-pointer"
          aria-label={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>

        {/* Content Container with hidden overflow */}
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Logo Area */}
          <div className={cn(
            "h-24 flex items-center border-b border-border/10 relative z-10 shrink-0",
            isCollapsed ? "px-6 justify-center" : "px-8"
          )}>
            <div className="flex items-center gap-4">
              <div className="relative w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-foreground/5 group overflow-hidden transition-transform hover:scale-105 active:scale-95 duration-500 border border-border/10 shrink-0">
                <Image
                  src="/logo-pure.png"
                  alt="PAM Techno"
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="leading-tight whitespace-nowrap"
                  >
                    <span className="block font-bold text-xl tracking-tighter uppercase text-foreground font-[family:var(--font-display)]">
                      PAM<span className="text-primary">.</span>Techno
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        Panel Admin
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-8 px-5 space-y-8 relative z-10 overflow-y-auto custom-scrollbar overflow-x-hidden">
            {/* Search Matrix */}
            {!isCollapsed ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="px-3 text-[9px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
                  Pencarian
                </p>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
                  <Input
                    value={projectQuery}
                    onChange={(event) => setProjectQuery(event.target.value)}
                    onKeyDown={handleProjectSearch}
                    placeholder="Cari proyek…"
                    className="h-11 rounded-2xl pl-11 bg-foreground/[0.03] border-border/40 focus-visible:ring-2 focus-visible:ring-foreground/20 text-[11px] font-bold tracking-tight"
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                 <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-foreground/[0.03] text-muted-foreground hover:text-foreground transition-all">
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Pencarian</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Primary Navigation */}
            <div className="space-y-3">
              {!isCollapsed && (
                <p className="px-3 text-[9px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
                  Menu Utama
                </p>
              )}
              <div className="space-y-2">
                {sidebarLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  const Icon = link.icon;

                  const linkContent = (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative flex items-center transition-all duration-300 group rounded-2xl",
                        isCollapsed ? "justify-center h-14 w-14 mx-auto" : "gap-3 px-4 py-3.5",
                        isActive
                          ? "bg-foreground text-background shadow-2xl shadow-foreground/10"
                          : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-transform duration-500 group-hover:scale-110 shrink-0",
                          isActive ? "text-background" : "text-muted-foreground",
                        )}
                      />
                      {!isCollapsed && (
                        <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap animate-in fade-in">
                          {link.title}
                        </span>
                      )}
                      {isActive && !isCollapsed && (
                        <motion.div 
                          layoutId="active-nav"
                          className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                        />
                      )}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={link.href}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right">{link.title}</TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </div>
            </div>

            {/* Rapid Deployment */}
            <div className="space-y-4">
              {!isCollapsed && (
                <p className="px-3 text-[9px] font-bold tracking-[0.3em] text-muted-foreground/40 uppercase">
                  Aksi Cepat
                </p>
              )}
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-2xl bg-foreground text-background shadow-lg hover:scale-110 active:scale-95 transition-all mx-auto"
                      onClick={() => router.push("/admin/projects?newProject=true")}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Proyek Baru</TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  size="lg"
                  className="w-full h-14 justify-start rounded-2xl bg-foreground/[0.02] border border-border/40 hover:bg-foreground/5 hover:border-border/60 text-foreground transition-all duration-300 gap-3 group px-4"
                  onClick={() => router.push("/admin/projects?newProject=true")}
                >
                  <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center shadow-lg group-hover:rotate-90 transition-transform duration-500">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Proyek Baru
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Footer / Profile Area */}
          <div className={cn(
            "border-t border-border/10 bg-foreground/[0.01] relative z-10 mt-auto",
            isCollapsed ? "p-4 space-y-4" : "p-6 space-y-6"
          )}>
            <Link href="/admin/profile">
              <div className={cn(
                "flex items-center rounded-[2rem] bg-background/40 border border-border/40 transition-all duration-500 hover:shadow-xl group cursor-pointer hover:bg-background/60",
                isCollapsed ? "h-14 w-14 justify-center rounded-2xl" : "gap-4 p-4"
              )}>
                <div className="relative shrink-0">
                  <div className={cn(
                    "flex items-center justify-center bg-foreground text-background text-xs font-bold shadow-xl group-hover:-rotate-3 transition-transform",
                    isCollapsed ? "h-10 w-10 rounded-xl" : "h-12 w-12 rounded-2xl"
                  )}>
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : "AD"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-[2px] border-background bg-emerald-500 animate-pulse" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 animate-in fade-in slide-in-from-left-2 overflow-hidden">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-0.5 group-hover:text-primary transition-colors truncate">
                      {user?.username || "Admin"}
                    </p>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10 w-fit">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                )}
              </div>
            </Link>

            <Button
              variant="ghost"
              className={cn(
                "text-destructive hover:text-destructive hover:bg-destructive/5 transition-all duration-300 group",
                isCollapsed ? "h-14 w-14 rounded-2xl justify-center mx-auto" : "w-full h-14 justify-start gap-3 px-4 rounded-2xl"
              )}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              )}
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-widest animate-in fade-in">
                  Log Out
                </span>
              )}
            </Button>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

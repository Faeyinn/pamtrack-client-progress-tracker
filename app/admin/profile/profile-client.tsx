"use client";

import { User, Shield, ArrowLeft, Calendar, Mail, LogOut, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfileClientProps {
  initialUser: {
    username: string;
    createdAt: string | Date;
  } | null;
}

export function ProfileClient({ initialUser }: ProfileClientProps) {
  const router = useRouter();

  const user = {
    username: initialUser?.username || "Admin",
    email: initialUser ? `${initialUser.username}@pamtechno.com` : "admin@pamtechno.com",
    role: "Super Administrator",
    joinDate: initialUser?.createdAt
      ? format(new Date(initialUser.createdAt), "MMMM yyyy", { locale: id })
      : "Januari 2026",
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative">
      <DashboardHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="mb-10" data-aos="fade-up">
            <Link href="/admin/dashboard" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-6 group">
                <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center mr-3 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                    <ArrowLeft className="w-3.5 h-3.5" />
                </div>
                Kembali ke Dashboard
            </Link>
            <div className="flex items-center gap-4">
                <div className="h-12 w-1.5 bg-primary rounded-full" />
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight font-[family:var(--font-display)] uppercase">
                        PROFIL PENGGUNA<span className="text-primary">.</span>
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium mt-1 opacity-70">
                        Kelola informasi akun dan preferensi keamanan Anda.
                    </p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Identity Card */}
            <div className="lg:col-span-1 space-y-6" data-aos="fade-up" data-aos-delay="100">
                <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-foreground/[0.03] rounded-[2rem] overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                    <CardContent className="pt-16 px-6 pb-8 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-28 h-28 rounded-[2.5rem] bg-background border-4 border-background shadow-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 relative ring-1 ring-border/50">
                                <User className="w-12 h-12 text-foreground/80" />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-background flex items-center justify-center shadow-xl ring-1 ring-border/50">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">{user.username}</h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-bold mt-2 mb-6 opacity-60">{user.role}</p>
                            
                            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Terverifikasi</span>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-border/50">
                             <Button 
                                variant="destructive" 
                                className="w-full justify-center gap-3 h-12 rounded-2xl bg-destructive/5 text-destructive hover:bg-destructive hover:text-white border border-destructive/10 transition-all duration-300 font-bold uppercase tracking-widest text-[10px]"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                             </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/40 backdrop-blur-md rounded-[1.5rem] p-5 shadow-sm overflow-hidden relative">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">Keamanan Akun</p>
                            <p className="text-[10px] text-muted-foreground">Sistem terlindungi secara end-to-end.</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-2 space-y-8" data-aos="fade-up" data-aos-delay="200">
                <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-foreground/[0.03] rounded-[2rem]">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            <CardTitle className="text-xl font-bold tracking-tight">Informasi Detail</CardTitle>
                        </div>
                        <CardDescription className="ml-4.5 text-xs font-medium opacity-70">
                            Informasi pribadi dan kredensial akses administrator.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-8">
                        <div className="grid gap-8 md:grid-cols-2">
                             <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-60">
                                    Username
                                </label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/60 group hover:border-primary/30 hover:bg-background transition-all duration-300 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-lg shadow-foreground/5">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground tracking-tight">{user.username}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-60">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/60 group hover:border-primary/30 hover:bg-background transition-all duration-300 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground tracking-tight">{user.email}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-60">
                                    Akses Level
                                </label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/60 group hover:border-primary/30 hover:bg-background transition-all duration-300 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground tracking-tight">{user.role}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1 opacity-60">
                                    Terdaftar
                                </label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/60 group hover:border-primary/30 hover:bg-background transition-all duration-300 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground tracking-tight">{user.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="border-border/60 bg-card/40 backdrop-blur-md rounded-[2rem] shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    <CardHeader className="px-8 pt-8 pb-4">
                        <CardTitle className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Aktivitas Login
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-2">
                        <div className="flex items-center justify-between p-5 rounded-2xl bg-background/40 border border-border/40 hover:bg-background/60 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-foreground">Sesi Saat Ini</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight opacity-70">Web Browser • Windows • Jakarta, ID</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                                Online
                            </div>
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}

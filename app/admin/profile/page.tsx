"use client";

import Link from "next/link";
import { User, Shield, ArrowLeft, Calendar, Mail, LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { useCurrentUser } from "@/components/admin/hooks/use-current-user";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminProfilePage() {
  const { user: currentUser } = useCurrentUser();
  const router = useRouter();

  const user = {
    username: currentUser?.username || "jaeyi",
    email: currentUser ? `${currentUser.username}@pamtechno.com` : "admin@pamtechno.com",
    role: "Super Administrator",
    joinDate: currentUser?.createdAt
      ? format(new Date(currentUser.createdAt), "MMMM yyyy", { locale: id })
      : "Januari 2026",
    status: "Active"
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
    <div className="min-h-screen bg-background relative overflow-hidden">
       {/* Premium Background Decorations */}
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <DashboardHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="mb-8">
            <Link href="/admin/dashboard" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
            Profil Pengguna
            </h1>
            <p className="text-muted-foreground mt-1">
                Kelola informasi akun dan preferensi keamanan Anda.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Identity Card */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                    <CardContent className="pt-12 px-6 pb-8 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-background to-muted border-4 border-background shadow-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500 relative">
                                <User className="w-10 h-10 text-foreground" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-background flex items-center justify-center shadow-lg">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-foreground">{user.username}</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1 mb-4">{user.role}</p>
                            
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Akun Terverifikasi</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border/50">
                             <Button 
                                variant="destructive" 
                                className="w-full justify-start gap-3 h-11 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Keluar</span>
                             </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Shield className="w-5 h-5 text-primary" />
                            Informasi Detail
                        </CardTitle>
                        <CardDescription>
                            Informasi pribadi dan kredensial akun Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Username
                                </label>
                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-background/50 border border-border/50 group hover:border-primary/30 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{user.username}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-background/50 border border-border/50 group hover:border-primary/30 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{user.email}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Role Access
                                </label>
                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-background/50 border border-border/50 group hover:border-primary/30 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <Shield className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{user.role}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Bergabung Sejak
                                </label>
                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-background/50 border border-border/50 group hover:border-primary/30 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-purple-500" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{user.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-sm opacity-80">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-muted-foreground">
                            Aktivitas Login Terakhir
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-foreground">Sesi Saat Ini</p>
                                    <p className="text-[10px] text-muted-foreground">Web Browser • Windows</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Online</span>
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  );
}

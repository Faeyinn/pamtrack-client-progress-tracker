"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { PageBackground } from "@/components/shared/page-background";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Email atau password salah.");
      }
    } catch {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="premium-bg flex items-center justify-center p-4">
      <PageBackground />
      
      <div className="w-full max-w-md relative z-10" data-aos="fade-up">
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex p-4 rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/60 shadow-2xl shadow-foreground/5 mb-2">
            <Image
              src="/logo-pure.png"
              alt="Logo"
              width={60}
              height={60}
              className="dark:invert opacity-90"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-[family:var(--font-display)] uppercase">
              Admin Access<span className="text-primary">.</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Internal panel PAM Techno Progress Tracker
            </p>
          </div>
        </div>

        <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-2xl shadow-foreground/5 overflow-hidden rounded-[2rem]">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          <CardHeader className="space-y-1 pt-8 px-8">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Masukkan kredensial Anda untuk masuk ke dashboard.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Email Work
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@pamtrack.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-11 h-12 bg-background/50 border-border/60 rounded-xl focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Password
                    </Label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-11 h-12 bg-background/50 border-border/60 rounded-xl focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 text-xs font-semibold text-destructive bg-destructive/5 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold tracking-tight shadow-xl shadow-foreground/10 active:scale-[0.98] transition-all group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Masuk ke Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center mt-8 text-[11px] font-medium text-muted-foreground tracking-wide">
          &copy; {new Date().getFullYear()} PAM Techno. All rights reserved.
        </p>
      </div>
    </div>
  );
}

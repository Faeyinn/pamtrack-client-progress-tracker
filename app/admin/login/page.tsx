import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login/login-form";
import { AuroraBackground } from "@/components/anim/aurora-background";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-dvh lg:min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Side - Branding & Visuals */}
      <div className="hidden lg:block relative h-full">
        <AuroraBackground className="flex h-full flex-col items-start justify-between bg-zinc-50 dark:bg-black p-16 font-sans text-foreground">
          {/* Logo */}
          <div className="relative z-10 flex items-center gap-0 animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="relative w-16 h-16 bg-white rounded-2xl p-2 shadow-2xl border border-border/10">
              <Image
                src="/logo-pure.png"
                alt="Logo"
                fill
                sizes="64px"
                className="object-contain p-2"
              />
            </div>
            <span className="ml-5 text-3xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-white dark:to-white/70">
              PAM Techno
            </span>
          </div>

          {/* Hero Text */}
          <div className="relative z-10 space-y-8 max-w-lg mb-12 animate-in fade-in slide-in-from-left-6 duration-1000 delay-200">
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
              Admin <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800/40 to-zinc-800/10 dark:from-white/40 dark:to-white/10">
                Console
              </span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium tracking-wide leading-relaxed border-l-2 border-accent/30 pl-6">
              Pusat kendali proyek digital Kamu. Pantau, kelola, dan sampaikan
              hasil terbaik untuk klien.
            </p>
          </div>

          {/* Footer info */}
          <div className="relative z-10 text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground/60 animate-in fade-in duration-1000 delay-500">
            &copy; 2026 PAM Techno. Restricted Access.
          </div>
        </AuroraBackground>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex min-h-dvh items-start justify-center bg-background px-4 py-8 sm:px-6 sm:py-12 lg:min-h-screen lg:items-center lg:px-16 relative overflow-y-auto lg:overflow-visible transition-colors duration-500">
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md space-y-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {/* Mobile Logo (Visible only on lg and below) */}
          <div className="lg:hidden flex flex-col items-center space-y-4 mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="relative w-20 h-20 bg-white rounded-3xl p-3 shadow-2xl border border-border/10">
              <Image
                src="/logo-pure.png"
                alt="Logo"
                fill
                sizes="80px"
                className="object-contain p-3"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              PAM Techno
            </h1>
          </div>

          <div className="bg-card/80 backdrop-blur-xl p-10 sm:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-border/50 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300">
            <LoginForm />
          </div>

          <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2 group py-2"
            >
              <span className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

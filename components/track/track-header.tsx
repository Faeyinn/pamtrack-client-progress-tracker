import Image from "next/image";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";

export function TrackHeader() {
  return (
    <header className="bg-background/40 backdrop-blur-2xl border-b border-border/40 sticky top-0 z-50 supports-backdrop-filter:bg-background/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-foreground/5 bg-white border border-border/10 p-2 shrink-0 group">
              <Image
                src="/logo-pure.png"
                alt="PAM Techno Logo"
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tighter uppercase leading-none">
                PAM Techno<span className="text-primary">.</span>
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                Monitoring Progres & Milestone Proyek
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

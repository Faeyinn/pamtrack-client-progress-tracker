import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";

export function TrackHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/78 backdrop-blur-xl transition-colors duration-300 data-[scrolled=true]:bg-background/92 data-[scrolled=true]:backdrop-blur-2xl"
      data-aos="fade-down"
      data-scrolled={isScrolled}
    >
      <div
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 transition-[padding] duration-300 data-[scrolled=true]:py-2 sm:px-6 lg:px-8"
        data-scrolled={isScrolled}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm sm:h-11 sm:w-11">
            <Image
              src="/logo-pure.png"
              alt="PAM Techno"
              width={44}
              height={44}
              priority
              className="h-full w-full object-contain p-1.5"
            />
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              PAM Techno
            </p>
            <p className="truncate text-xs text-foreground/80 sm:text-sm">
              Client Progress Tracker
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

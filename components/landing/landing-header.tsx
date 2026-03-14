"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollToAccessLink } from "@/components/landing/scroll-to-access-link";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";

type SectionId = "access" | "workflow" | "faq" | null;

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>(null);

  const navItems = useMemo(
    () => [
      { id: "workflow", label: "Cara Kerja", href: "#workflow" },
      { id: "faq", label: "FAQ", href: "#faq" },
    ],
    [],
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["access", "workflow", "faq"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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

        <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
                data-active={activeSection === item.id}
                aria-current={activeSection === item.id ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-full border-border/60 bg-background/70 px-4 shadow-sm sm:inline-flex"
          >
            <Link href="/admin/login">Portal Admin</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full px-3 shadow-sm sm:px-5"
          >
            <ScrollToAccessLink aria-current={activeSection === "access" ? "location" : undefined}>
              Akses Proyek
            </ScrollToAccessLink>
          </Button>
        </nav>
      </div>
    </header>
  );
}

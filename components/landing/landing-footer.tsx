import Link from "next/link";

import { ScrollToAccessLink } from "@/components/landing/scroll-to-access-link";

export function LandingFooter() {
  const supportPhone =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || "62895600077007";

  return (
    <footer className="grid gap-6 py-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
      <div className="space-y-3" data-aos="fade-up">
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-muted-foreground">
          PAM Techno
        </p>
        <p className="max-w-xl text-sm leading-6 text-foreground/78">
          Portal ini membantu klien memantau progres proyek dengan struktur yang
          lebih rapi, cepat dipahami, dan aman diakses.
        </p>
      </div>

      <div
        className="flex flex-col items-start gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        <ScrollToAccessLink className="transition-colors hover:text-foreground">
          Akses Proyek
        </ScrollToAccessLink>
        <Link
          href="/admin/login"
          className="transition-colors hover:text-foreground"
        >
          Portal Admin
        </Link>
        <a
          href={`https://wa.me/${supportPhone}`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Hubungi Support
        </a>
        <span className="text-xs">© 2026 PAM Techno</span>
      </div>
    </footer>
  );
}

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ScrollToAccessLink } from "@/components/landing/scroll-to-access-link";
import { ArrowRight, MessageCircleMore } from "lucide-react";

export function HeroSection({ children }: { children?: ReactNode }) {
  const supportPhone =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || "62895600077007";
  const waHref = `https://wa.me/${supportPhone}`;

  return (
    <div className="relative flex flex-col gap-6 pt-4 sm:gap-7 sm:pt-0">
      <div
        className="max-w-3xl space-y-4 sm:space-y-5"
        data-aos="fade-up"
        data-aos-delay="40"
      >
        <h1 className="text-balance font-sans text-4xl font-bold leading-[0.96] tracking-[-0.03em] text-foreground min-[420px]:text-5xl sm:text-6xl lg:text-[5.15rem] lg:leading-[0.9] xl:text-[5.5rem] xl:leading-[0.88]">
          Pantau progres proyek
        </h1>

        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:text-xl">
          Satu halaman untuk melihat status terkini, file penting, dan riwayat
          revisi tanpa harus bolak-balik chat. Fokus pada informasi yang
          memang Anda butuhkan.
        </p>
      </div>

      <div
        className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        <Button
          asChild
          size="lg"
          className="h-12 rounded-full px-6 text-sm shadow-lg shadow-primary/15 sm:h-14 sm:px-8 sm:text-base"
        >
          <ScrollToAccessLink>
            Akses Progress <ArrowRight className="ml-2 h-4 w-4" />
          </ScrollToAccessLink>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 rounded-full border-border/60 bg-background/70 px-6 text-sm shadow-sm backdrop-blur-sm sm:h-14 sm:px-8 sm:text-base"
        >
          <a href={waHref} target="_blank" rel="noreferrer">
            Hubungi Support <MessageCircleMore className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="grid max-w-3xl gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div
          className="rounded-3xl border border-border/60 bg-card/75 p-4 shadow-sm backdrop-blur-md"
          data-aos="fade-up"
          data-aos-delay="180"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Status
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight">
            Update terstruktur
          </p>
        </div>
        <div
          className="rounded-3xl border border-border/60 bg-card/75 p-4 shadow-sm backdrop-blur-md"
          data-aos="fade-up"
          data-aos-delay="240"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Akses
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight">
            Magic link privat
          </p>
        </div>
        <div
          className="rounded-3xl border border-border/60 bg-card/75 p-4 shadow-sm backdrop-blur-md"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Arsip
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight">
            Semua revisi terdokumentasi
          </p>
        </div>
      </div>

      <div data-aos="fade-up" data-aos-delay="360">
        {children}
      </div>

      <div className="fixed inset-x-3 bottom-3 z-40 rounded-full border border-border/70 bg-background/88 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur-xl sm:inset-x-4 sm:bottom-4 lg:hidden">
        <Button asChild size="lg" className="h-11 w-full rounded-full px-4 text-sm sm:h-12">
          <ScrollToAccessLink>
            Masuk ke Akses Proyek <ArrowRight className="ml-2 h-4 w-4" />
          </ScrollToAccessLink>
        </Button>
      </div>
    </div>
  );
}

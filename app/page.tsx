import { Boxes } from "@/components/anim/background-boxes";
import { HeroSection } from "@/components/landing/hero-section";
import Image from "next/image";
import { LandingFooter } from "@/components/landing/landing-footer";
import { FeatureHighlights } from "../components/landing/feature-highlights";
import { AccessPanel } from "@/components/landing/access-panel";
import { ScrollToAccessLink } from "@/components/landing/scroll-to-access-link";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-svh w-full relative overflow-hidden selection:bg-foreground selection:text-background">
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute inset-0 w-full h-full bg-background z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
      </div>

      <div className="relative z-10 pointer-events-none">
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300 pointer-events-auto">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-9 w-9 bg-white rounded-xl p-1.5 shadow-sm border border-border/10 overflow-hidden transition-transform group-hover:scale-105">
                <Image
                  src="/logo-pure.png"
                  alt="PAM Techno"
                  fill
                  sizes="36px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <span className="text-lg font-bold tracking-tight">
                PAM Techno
              </span>
            </Link>

            <nav className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                asChild
                size="sm"
                className="rounded-full px-5 font-medium shadow-sm"
              >
                <Link href="/admin/login">Admin</Link>
              </Button>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-6 lg:px-8 pt-24 sm:pt-32 pb-20">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
            <div className="lg:col-span-7 flex flex-col justify-center pointer-events-auto">
              <HeroSection />
            </div>

            <aside
              id="access"
              className="lg:col-span-5 w-full max-w-md mx-auto lg:ml-auto lg:mr-0 scroll-mt-32 pointer-events-auto"
            >
              <AccessPanel />
            </aside>
          </div>

          <div className="mt-24 sm:mt-32 pointer-events-auto">
            <FeatureHighlights />
          </div>

          <div className="mt-24 border-t border-border/40 pt-12 pointer-events-auto">
            <LandingFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

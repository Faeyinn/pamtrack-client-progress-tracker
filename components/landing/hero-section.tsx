import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollToAccessLink } from "@/components/landing/scroll-to-access-link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const supportPhone =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || "62895600077007";
  const waHref = `https://wa.me/${supportPhone}`;

  return (
    <div className="flex flex-col gap-8 pt-10 sm:pt-0 relative">
      <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[0.9] sm:leading-[0.85]">
          Pantau Progress.
          <br />
          <span className="text-muted-foreground/80">Project Kamu.</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          Pembaruan real-time untuk transformasi digital Kamu. Tanpa gangguan,
          fokus pada status.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <Button
          asChild
          size="lg"
          className="h-14 rounded-full px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all sm:hidden"
        >
          <ScrollToAccessLink>
            Akses Progress <ArrowRight className="ml-2 h-4 w-4" />
          </ScrollToAccessLink>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-14 rounded-full border-border bg-background/50 backdrop-blur-sm hover:bg-muted px-8 hidden sm:inline-flex text-base transition-colors"
        >
          <a href={waHref} target="_blank" rel="noreferrer">
            Hubungi Support
          </a>
        </Button>
      </div>

      {/* Abstract Visual - Cleaner & Modern */}
      <div className="hidden lg:flex absolute -top-10 -right-20 h-[120%] w-1/2 z-[-1] opacity-60 pointer-events-none select-none">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full animate-in fade-in duration-1000"
        >
          <path
            fill="currentColor"
            className="text-accent/20"
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,72.1,35.2C62,47.5,53.1,58.5,42.2,66.4C31.3,74.3,18.4,79.1,4.5,71.3C-9.4,63.5,-24.3,43.2,-38.5,28.8C-52.7,14.4,-66.2,5.9,-70.6,-5.5C-75,-16.9,-70.3,-31.2,-60.7,-42.6C-51.1,-54,-36.6,-62.5,-22,-66.1C-7.4,-69.7,7.3,-68.4,22.3,-66.5Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </div>
  );
}

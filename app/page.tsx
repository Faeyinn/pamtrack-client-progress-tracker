import { PageBackground } from "@/components/shared/page-background";
import { AccessPanel } from "@/components/landing/access-panel";
import { FeatureHighlights } from "@/components/landing/feature-highlights";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { ScrollToAccessLink } from "@/components/landing/scroll-to-access-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const workflowSteps = [
  {
    title: "Masuk tanpa friction",
    description:
      "Klien cukup buka magic link dari WhatsApp atau masukkan token proyek jika perlu akses manual.",
    icon: ShieldCheck,
  },
  {
    title: "Pantau status aktual",
    description:
      "Setiap perubahan fase, progress, dan catatan pengerjaan langsung muncul dalam satu timeline yang bersih.",
    icon: Sparkles,
  },
  {
    title: "Review lebih cepat",
    description:
      "Diskusi, revisi, dan file artefak terdokumentasi dalam satu tempat agar keputusan tidak tercecer.",
    icon: CheckCircle2,
  },
];

const faqs = [
  {
    question: "Kalau saya tidak punya token, apakah tetap bisa masuk?",
    answer:
      "Bisa. Opsi utama tetap lewat magic link yang dikirim ke WhatsApp. Token manual hanya sebagai alternatif.",
  },
  {
    question: "Apa yang bisa saya lihat di halaman tracking?",
    answer:
      "Anda bisa melihat fase proyek, update terbaru, artefak file, serta riwayat diskusi atau revisi yang relevan.",
  },
  {
    question: "Jika link hilang, apa yang harus dilakukan?",
    answer:
      "Gunakan fitur kirim ulang magic link dari panel akses agar masuk kembali tanpa perlu menunggu balasan manual.",
  },
];

export default function LandingPage() {
  return (
    <div className="premium-bg selection:bg-foreground selection:text-background">
      <PageBackground />

      <LandingHeader />

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-28 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-34 xl:gap-16 xl:pt-36">
          <div className="space-y-6">
            <HeroSection>
              <div className="rounded-[2rem] border border-border/60 bg-card/82 p-4 shadow-sm backdrop-blur-xl sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                      Dirancang untuk komunikasi yang jelas
                    </p>
                    <h2 className="text-balance font-[family:var(--font-display)] text-[1.9rem] leading-none tracking-tight text-foreground sm:text-4xl lg:text-[2.8rem]">
                      Landing page yang fokus pada kejelasan, bukan distraksi.
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    <div
                      className="flex items-start gap-4 rounded-[1.5rem] border border-border/60 bg-background/72 px-4 py-4"
                      data-aos="fade-up"
                      data-aos-delay="420"
                    >
                      <div className="min-w-20 text-2xl font-semibold tracking-tight text-foreground">
                        24/7
                      </div>
                      <div>
                        <p className="text-sm font-medium tracking-tight text-foreground">
                          Akses status proyek kapan saja
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-start gap-4 rounded-[1.5rem] border border-border/60 bg-background/72 px-4 py-4"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <div className="min-w-20 text-2xl font-semibold tracking-tight text-foreground">
                        1 hub
                      </div>
                      <div>
                        <p className="text-sm font-medium tracking-tight text-foreground">
                          Timeline, revisi, dan artefak dalam satu tempat
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-start gap-4 rounded-[1.5rem] border border-border/60 bg-background/72 px-4 py-4"
                      data-aos="fade-up"
                      data-aos-delay="580"
                    >
                      <div className="min-w-20 text-2xl font-semibold tracking-tight text-foreground">
                        0 spam
                      </div>
                      <div>
                        <p className="text-sm font-medium tracking-tight text-foreground">
                          Hanya informasi penting yang relevan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </HeroSection>
          </div>

          <aside
            id="access"
            className="relative scroll-mt-24 lg:sticky lg:top-24 lg:h-fit xl:top-28"
          >
            <div className="pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,oklch(0.82_0.06_155_/_0.22),transparent_65%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,oklch(0.82_0.06_155_/_0.18),transparent_65%)]" />
            <AccessPanel />
          </aside>
        </section>

        <section
          id="workflow"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8"
        >
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
            <div className="max-w-2xl space-y-4" data-aos="fade-up">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Workflow
              </p>
              <h2 className="text-balance font-[family:var(--font-display)] text-[2.15rem] leading-none tracking-tight sm:text-5xl">
                Experience yang lebih rapi untuk klien dan tim internal.
              </h2>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Struktur halaman disederhanakan agar informasi utama langsung
                terbaca, sementara aksi masuk tetap menjadi prioritas utama.
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-full px-0 text-sm text-foreground/80 hover:bg-transparent hover:text-foreground lg:inline-flex"
            >
              <ScrollToAccessLink>
                Buka akses proyek <ArrowUpRight className="size-4" />
              </ScrollToAccessLink>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workflowSteps.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="rounded-[1.75rem] border border-border/60 bg-card/72 p-6 shadow-sm backdrop-blur-xl"
                data-aos="fade-up"
                data-aos-delay={String(80 * (index + 1))}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div
          className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"
          data-aos="fade-up"
        >
          <FeatureHighlights />
        </div>

        <section
          id="faq"
          className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
        >
          <div className="grid gap-8 rounded-[2rem] border border-border/60 bg-card/72 p-5 shadow-sm backdrop-blur-xl sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4" data-aos="fade-up">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                FAQ Singkat
              </p>
              <h2 className="text-balance font-[family:var(--font-display)] text-[2.15rem] leading-none tracking-tight sm:text-5xl">
                Jawaban cepat sebelum Anda masuk ke halaman proyek.
              </h2>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Informasi ini diletakkan dekat alur masuk supaya pengguna tidak
                perlu menebak langkah berikutnya.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="120">
              <Accordion
                type="single"
                collapsible
                className="rounded-[1.5rem] border border-border/60 bg-background/75 px-5"
              >
                {faqs.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`}>
                    <AccordionTrigger className="py-5 text-base font-semibold tracking-tight hover:no-underline sm:text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl border-t border-border/50 px-4 pb-24 pt-8 sm:px-6 sm:pb-10 lg:px-8">
          <LandingFooter />
        </div>
      </main>
    </div>
  );
}

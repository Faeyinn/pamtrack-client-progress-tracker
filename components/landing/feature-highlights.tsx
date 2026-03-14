import { GalleryVerticalEnd, History, Lock } from "lucide-react";

const features = [
  {
    title: "Timeline yang langsung terbaca",
    description:
      "Setiap fase pengerjaan tampil dalam urutan yang mudah dipahami tanpa visual yang berlebihan.",
    icon: GalleryVerticalEnd,
    accent: "from-accent/16 to-transparent",
  },
  {
    title: "Akses privat dan tetap praktis",
    description:
      "Magic link dan token manual menjaga akses tetap aman, tanpa menambah friction untuk klien.",
    icon: Lock,
    accent: "from-primary/10 to-transparent",
  },
  {
    title: "Riwayat kerja tersimpan rapi",
    description:
      "File, catatan revisi, dan diskusi tetap terdokumentasi sehingga konteks proyek tidak hilang.",
    icon: History,
    accent: "from-[oklch(0.85_0.1_85_/_0.18)] to-transparent",
  },
];

export function FeatureHighlights() {
  return (
    <section className="rounded-[2rem] border border-border/60 bg-card/72 p-5 shadow-sm backdrop-blur-xl sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="space-y-4" data-aos="fade-up">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Highlight
          </p>
          <h2 className="text-balance font-[family:var(--font-display)] text-[2.15rem] leading-none tracking-tight sm:text-5xl">
            Modern, clean, dan tetap terasa serius untuk konteks profesional.
          </h2>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Redesign difokuskan pada hierarchy yang lebih kuat, permukaan yang
            lebih bersih, dan informasi yang lebih cepat dipindai.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {features.map(({ title, description, icon: Icon, accent }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-background/72 p-5 transition-colors duration-300 hover:border-border"
              data-aos="fade-up"
              data-aos-delay={
                title === "Timeline yang langsung terbaca"
                  ? "80"
                  : title === "Akses privat dan tetap praktis"
                    ? "160"
                    : "240"
              }
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-80`}
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

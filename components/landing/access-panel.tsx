"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenInputForm } from "@/components/landing/token-input-form";
import { RecoveryLinkDialog } from "@/components/landing/recovery-link-dialog";
import {
  ChevronDown,
  ChevronRight,
  KeyRound,
  RotateCw,
  Smartphone,
} from "lucide-react";

export function AccessPanel() {
  const [showToken, setShowToken] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const supportPhone =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || "62895600077007";
  const waHref = `https://wa.me/${supportPhone}`;

  useEffect(() => {
    const triggerHighlight = () => {
      setIsHighlighted(true);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
    };

    window.addEventListener("landing:highlight-access", triggerHighlight);

    return () => {
      window.removeEventListener("landing:highlight-access", triggerHighlight);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      data-aos="fade-left"
      data-aos-delay="120"
      animate={
        shouldReduceMotion
          ? {
              scale: 1,
              boxShadow: "0 20px 40px -24px rgb(0 0 0 / 0.12)",
            }
          : isHighlighted
            ? {
                scale: [1, 1.012, 1.016, 1.008, 1],
                boxShadow: [
                  "0 20px 40px -24px rgb(0 0 0 / 0.12)",
                  "0 0 0 1px oklch(0.82 0.06 155 / 0.36), 0 0 24px oklch(0.82 0.06 155 / 0.2), 0 0 56px oklch(0.82 0.06 155 / 0.14)",
                  "0 0 0 2px oklch(0.82 0.06 155 / 0.62), 0 0 42px oklch(0.82 0.06 155 / 0.34), 0 0 96px oklch(0.82 0.06 155 / 0.22)",
                  "0 0 0 1px oklch(0.82 0.06 155 / 0.3), 0 0 20px oklch(0.82 0.06 155 / 0.16), 0 0 48px oklch(0.82 0.06 155 / 0.12)",
                  "0 20px 40px -24px rgb(0 0 0 / 0.12)",
                ],
              }
            : {
                scale: 1,
                boxShadow: "0 20px 40px -24px rgb(0 0 0 / 0.12)",
              }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 2,
              times: [0, 0.18, 0.45, 0.75, 1],
              ease: [0.22, 1, 0.36, 1],
            }
      }
      className="rounded-[2rem] will-change-transform"
    >
      <Card className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/88 shadow-xl shadow-black/5 backdrop-blur-2xl">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset"
          animate={{
            boxShadow: shouldReduceMotion
              ? "inset 0 0 0 1px oklch(0.82 0.06 155 / 0.25)"
              : isHighlighted
                ? [
                    "inset 0 0 0 1px oklch(0.82 0.06 155 / 0.25)",
                    "inset 0 0 0 1px oklch(0.82 0.06 155 / 0.42)",
                    "inset 0 0 0 1px oklch(0.82 0.06 155 / 0.72)",
                    "inset 0 0 0 1px oklch(0.82 0.06 155 / 0.38)",
                    "inset 0 0 0 1px oklch(0.82 0.06 155 / 0.25)",
                  ]
                : "inset 0 0 0 1px oklch(0.82 0.06 155 / 0.25)",
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 2,
                  times: [0, 0.2, 0.48, 0.78, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/35 via-foreground/45 to-[oklch(0.85_0.1_85_/_0.45)]" />
        <div className="absolute inset-x-6 top-6 h-24 rounded-full bg-accent/14 blur-3xl" />
        <div className="absolute -right-10 top-10 h-28 w-28 rounded-full bg-[oklch(0.85_0.1_85_/_0.12)] blur-3xl" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-[2.4rem] bg-[radial-gradient(circle_at_top_left,oklch(0.82_0.06_155_/_0.5),transparent_34%),radial-gradient(circle_at_top_right,oklch(0.82_0.06_155_/_0.35),transparent_28%),radial-gradient(circle_at_bottom_left,oklch(0.82_0.06_155_/_0.28),transparent_30%),radial-gradient(circle_at_bottom_right,oklch(0.82_0.06_155_/_0.42),transparent_32%)]"
          animate={{
            opacity: shouldReduceMotion
              ? 0
              : isHighlighted
                ? [0, 0.4, 0.9, 0.35, 0]
                : 0,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 2,
                  times: [0, 0.18, 0.42, 0.76, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-6 -left-4 w-10 rounded-full bg-[oklch(0.82_0.06_155_/_0.85)] blur-2xl"
          animate={{
            opacity: shouldReduceMotion
              ? 0
              : isHighlighted
                ? [0, 0.25, 0.9, 0.3, 0]
                : 0,
            x: shouldReduceMotion ? -8 : isHighlighted ? [-8, -2, 0, -2, -6] : -8,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 2,
                  times: [0, 0.16, 0.42, 0.76, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-6 -right-4 w-10 rounded-full bg-[oklch(0.82_0.06_155_/_0.85)] blur-2xl"
          animate={{
            opacity: shouldReduceMotion
              ? 0
              : isHighlighted
                ? [0, 0.25, 0.9, 0.3, 0]
                : 0,
            x: shouldReduceMotion ? 8 : isHighlighted ? [8, 2, 0, 2, 6] : 8,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 2,
                  times: [0, 0.16, 0.42, 0.76, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />

        <CardHeader className="relative px-5 pb-4 pt-6 sm:px-7 sm:pt-7 lg:px-8 lg:pt-8">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-foreground">
            <KeyRound className="size-3.5" />
            Akses Utama Klien
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.75rem]">
            Akses Proyek
          </CardTitle>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Buka halaman tracking klien dengan cara tercepat, lalu gunakan token
            manual hanya saat dibutuhkan.
          </p>
        </CardHeader>

        <CardContent className="relative space-y-5 px-5 pb-5 sm:space-y-6 sm:px-7 sm:pb-7 lg:px-8 lg:pb-8">
          <div
            className="rounded-[1.4rem] border border-accent/20 bg-accent/8 p-4"
            data-aos="fade-up"
            data-aos-delay="180"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/85">
              Cara paling mudah
            </p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-foreground/85">
              <li>1. Buka link akses dari WhatsApp jika sudah menerima magic link.</li>
              <li>2. Gunakan token manual hanya jika Anda tidak membuka dari link.</li>
              <li>3. Pakai recovery link jika pesan sebelumnya sudah hilang.</li>
            </ol>
          </div>

          <div
            className="rounded-[1.6rem] border border-accent/25 bg-background/78 p-3 shadow-md shadow-accent/10"
            data-aos="zoom-in"
            data-aos-delay="240"
          >
            <Button
              asChild
              className="group/btn h-auto w-full justify-between rounded-[1.25rem] bg-primary px-4 py-4 text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/92"
            >
              <a href={waHref} target="_blank" rel="noreferrer">
                <span className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/14 text-primary-foreground transition-transform group-hover/btn:scale-105">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="block text-base font-semibold leading-tight">
                      Buka via WhatsApp
                    </span>
                    <span className="block text-xs font-normal text-primary-foreground/75 sm:text-[13px]">
                      Jalur tercepat untuk melihat progres proyek
                    </span>
                  </div>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-hover/btn:translate-x-1" />
              </a>
            </Button>

            <RecoveryLinkDialog
              triggerLabel={
                <span className="flex items-center gap-2">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Kirim Ulang Magic Link</span>
                </span>
              }
              triggerVariant="ghost"
              triggerClassName="mt-2 h-10 w-full justify-start px-3 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
            />
          </div>

          <div
            className="rounded-[1.6rem] border border-dashed border-border/70 bg-background/55 p-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowToken(!showToken)}
              className="group/toggle h-auto w-full justify-between px-1 py-1 text-left text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground sm:text-xs"
              aria-expanded={showToken}
            >
              <span className="flex items-center gap-2">
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    showToken ? "rotate-180" : ""
                  }`}
                />
                <span>
                  {showToken ? "Sembunyikan Token" : "Gunakan Token Manual"}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] opacity-70 transition-opacity group-hover/toggle:opacity-100">
                {showToken ? "ESC" : "OPSIONAL"}
              </span>
            </Button>

            {showToken && (
              <div className="animate-in fade-in slide-in-from-top-2 pt-4 duration-300 ease-out">
                <TokenInputForm />
              </div>
            )}
          </div>

          <p
            className="text-xs leading-5 text-muted-foreground"
            data-aos="fade-up"
            data-aos-delay="360"
          >
            Akses klien tetap privat. Jika link hilang, gunakan recovery tanpa
            perlu meminta update ulang ke tim setiap saat.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

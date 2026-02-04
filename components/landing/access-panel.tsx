"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenInputForm } from "@/components/landing/token-input-form";
import { RecoveryLinkDialog } from "@/components/landing/recovery-link-dialog";
import { ChevronRight, Smartphone, RotateCw, ChevronDown } from "lucide-react";

export function AccessPanel() {
  const [showToken, setShowToken] = useState(false);
  const supportPhone =
    process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || "62895600077007";

  const waHref = useMemo(() => {
    return `https://wa.me/${supportPhone}`;
  }, [supportPhone]);

  return (
    <Card className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl shadow-neutral-200/50 dark:shadow-none rounded-2xl overflow-hidden relative transition-all hover:shadow-neutral-300/50 hover:border-border/80 group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-foreground/10 to-foreground/30" />

      <CardHeader className="pb-4 pt-8 px-8">
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
          Akses Proyek
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Masuk untuk melihat progress terbaru Kamu.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 px-8 pb-8">
        <div className="space-y-4">
          <Button
            asChild
            variant="outline"
            className="w-full h-16 justify-between px-4 border-border/60 bg-card/50 rounded-xl hover:bg-muted hover:shadow-md hover:border-accent/30 active:scale-[0.98] group/btn transition-all duration-200"
          >
            <a href={waHref} target="_blank" rel="noreferrer">
              <span className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center group-hover/btn:scale-110 transition-transform text-accent">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="block font-semibold text-base text-foreground leading-tight">
                    Buka via WhatsApp
                  </span>
                  <span className="block text-xs text-muted-foreground font-normal">
                    Chat otomatis & cepat
                  </span>
                </div>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground/70 group-hover/btn:translate-x-1 group-hover/btn:text-foreground transition-all" />
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
            triggerClassName="w-full h-10 text-sm text-muted-foreground hover:text-foreground justify-start px-2 hover:bg-transparent"
          />
        </div>

        <div className="pt-6 border-t-2 border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowToken(!showToken)}
            className="w-full justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider h-auto py-2 px-1 hover:bg-transparent group/toggle"
          >
            <span className="flex items-center gap-2">
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showToken ? "rotate-180" : ""
                }`}
              />
              <span>
                {showToken ? "Sembunyikan Token" : "Gunakan Token Manual"}
              </span>
            </span>
            <span className="bg-muted px-2 py-0.5 rounded text-[10px] opacity-70 group-hover/toggle:opacity-100 transition-opacity">
              {showToken ? "ESC" : "OPSIONAL"}
            </span>
          </Button>

          {showToken && (
            <div className="pt-4 animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
              <TokenInputForm />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle } from "lucide-react";

export function ContactFooter() {
  const SUPPORT_PHONE = "62895600077007"; // Example support number (Admin)

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/5">
            <Phone className="w-5 h-5 text-foreground/60" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Contact
            </p>
            <h3 className="text-2xl font-[family:var(--font-display)] tracking-tight text-foreground">
              Kontak & Dukungan
            </h3>
          </div>
        </div>

        <Card className="overflow-hidden bg-foreground text-background rounded-[2rem] shadow-2xl shadow-foreground/20 relative group border-none">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:bg-white/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -ml-16 -mb-16 pointer-events-none" />
          
          <div className="absolute top-8 right-8 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
            <MessageCircle className="w-40 h-40" />
          </div>

          <CardContent className="pt-12 pb-12 px-8 flex flex-col items-center justify-center text-center space-y-8 relative z-10">
            <div className="space-y-3">
              <h3 className="text-3xl md:text-4xl font-[family:var(--font-display)] tracking-tight leading-none">
                Konsultasi Langsung
              </h3>
              <p className="text-sm font-medium text-background/60 max-w-xs mx-auto leading-relaxed">
                Tim support kami siap membantu kendala teknis atau pertanyaan mengenai milestone proyek Anda.
              </p>
            </div>

            <Button
              className="w-full sm:w-auto h-16 px-10 bg-background text-foreground hover:bg-background/90 font-semibold text-sm uppercase tracking-[0.24em] rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
              onClick={() =>
                window.open(`https://wa.me/${SUPPORT_PHONE}`, "_blank")
              }
            >
              <Phone className="mr-3 h-4 w-4" />
              Hubungi WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center pb-8 pt-12 border-t border-border/40">
        <div className="inline-flex items-center gap-2 mb-3">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
            PAM Techno
          </p>
        </div>
        <p className="text-xs font-medium text-muted-foreground/50 uppercase tracking-widest">
          Professional Web Development & IT Solutions © 2026
        </p>
      </div>
    </div>
  );
}

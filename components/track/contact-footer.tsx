import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

export function ContactFooter() {
  const SUPPORT_PHONE = "62895600077007"; // Example support number (Admin)

  return (
    <>
      <Card className="border border-border shadow-lg bg-foreground text-background overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Phone className="w-32 h-32" />
        </div>
        <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight">
            Butuh Bantuan Lebih Lanjut?
          </h3>
          <p className="text-background/70 max-w-md">
            Tim support kami siap membantu Anda jika ada kendala atau pertanyaan
            mengenai progress proyek ini.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 font-bold rounded-full px-8 shadow-xl hover:scale-105 transition-transform"
            onClick={() =>
              window.open(`https://wa.me/${SUPPORT_PHONE}`, "_blank")
            }
          >
            <Phone className="mr-2 h-4 w-4" />
            Hubungi Support WhatsApp
          </Button>
        </CardContent>
      </Card>

      <div className="text-center mt-12 pb-8 text-xs text-muted-foreground border-t border-border/40 pt-8">
        <p className="font-medium">© 2026 PAM Techno</p>
        <p className="mt-1">Professional Web Development & IT Solutions</p>
      </div>
    </>
  );
}

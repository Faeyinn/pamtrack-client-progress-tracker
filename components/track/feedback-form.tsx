"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedbackFormProps {
  token: string;
}

export function FeedbackForm({ token }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    if (feedback.length > 500) {
      toast.error("Feedback maksimal 500 karakter");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(`/api/track/${token}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedback }),
      });

      if (response.ok) {
        toast.success(
          "Feedback Anda berhasil dikirim! Kami akan segera menghubungi Anda.",
        );
        setFeedback("");
      } else {
        toast.error("Gagal mengirim feedback. Silakan coba lagi.");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/5">
          <MessageSquare className="w-5 h-5 text-foreground/60" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xl font-black tracking-tighter uppercase text-foreground">
            Bantuan & Feedback
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Sampaikan masukan Anda di sini
          </p>
        </div>
      </div>

      <Card className="overflow-hidden bg-background/40 backdrop-blur-xl border-border/40 rounded-[2rem] shadow-2xl shadow-foreground/5 relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none transition-all duration-700 group-hover:bg-primary/10" />

        <CardHeader className="pb-4 relative z-10 px-6 pt-8">
          <CardTitle className="text-lg font-black uppercase tracking-tighter text-foreground">
            Ada pertanyaan atau masukan?<span className="text-primary">.</span>
          </CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">
            Kirimkan pertanyaan, masukan, atau permintaan khusus Anda langsung
            ke tim pengembang kami.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Ketik pesan Anda di sini..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="resize-none text-xs font-bold leading-relaxed bg-muted/20 border-border/40 rounded-2xl focus:ring-2 focus:ring-foreground/5 transition-all"
                disabled={isSending}
                maxLength={500}
              />
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                  Batas Karakter: 500
                </span>
                <span
                  className={cn(
                    "text-[9px] font-black uppercase tracking-widest transition-colors",
                    feedback.length > 450
                      ? "text-primary/100"
                      : "text-muted-foreground/40",
                  )}
                >
                  {feedback.length}/500
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-foreground/20 hover:scale-[1.02] active:scale-95 transition-all"
              disabled={isSending || !feedback.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-3 h-4 w-4" />
                  Kirim Pesan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

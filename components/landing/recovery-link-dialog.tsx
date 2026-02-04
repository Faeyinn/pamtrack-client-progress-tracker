"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2, Phone } from "lucide-react";

function normalizePhoneTo62(phone: string) {
  let normalized = phone.replace(/\D/g, "");
  if (normalized.startsWith("0")) normalized = "62" + normalized.substring(1);
  if (normalized && !normalized.startsWith("62"))
    normalized = "62" + normalized;
  return normalized;
}

export function RecoveryLinkDialog(props: {
  triggerLabel?: React.ReactNode;
  triggerVariant?: "default" | "secondary" | "outline" | "ghost";
  triggerClassName?: string;
}) {
  const triggerLabel = props.triggerLabel ?? "Kirim ulang tautan";
  const triggerVariant = props.triggerVariant ?? "default";

  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedPhonePreview = useMemo(
    () => normalizePhoneTo62(phoneNumber),
    [phoneNumber],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSending(true);

    const phone = normalizePhoneTo62(phoneNumber);

    try {
      const response = await fetch("/api/track/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data: unknown = await response.json().catch(() => ({}));
      const dataObject =
        typeof data === "object" && data !== null
          ? (data as Record<string, unknown>)
          : null;

      const ok =
        response.ok &&
        (dataObject && typeof dataObject.success === "boolean"
          ? dataObject.success
          : true);

      const message =
        dataObject && typeof dataObject.message === "string"
          ? dataObject.message
          : undefined;

      if (ok) {
        setSuccess(true);
        setPhoneNumber("");
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      } else {
        setError(message || "Nomor tidak terdaftar dalam sistem kami.");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={props.triggerClassName}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Kirim ulang tautan akses
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Masukkan nomor WhatsApp Kamu yang terdaftar. Kami akan kirimkan
            magic link terbaru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {success && (
            <Alert className="border-border/70 bg-muted/30 text-foreground">
              <CheckCircle className="h-4 w-4 text-foreground" />
              <AlertDescription>
                Tautan sudah dikirim. Silakan cek WhatsApp Kamu.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="border-border/70 bg-muted/30 text-foreground"
            >
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Nomor WhatsApp
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="0812..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-9 border-border/70 focus-visible:ring-ring/30"
                required
                disabled={isSending || success}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Akan diformat menjadi{" "}
              <span className="font-medium">
                {normalizedPhonePreview || "62..."}
              </span>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSending || success}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : success ? (
              "Terkirim"
            ) : (
              "Kirim tautan"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

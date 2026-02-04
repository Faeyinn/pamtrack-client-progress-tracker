"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, CheckCircle, Loader2, HelpCircle } from "lucide-react";

export function TokenRecoverySection() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    setRecoverySuccess(false);
    setIsSendingRecovery(true);

    // Normalize phone number
    let normalizedPhone = phoneNumber.replace(/\D/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "62" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("62")) {
      normalizedPhone = "62" + normalizedPhone;
    }

    try {
      const response = await fetch("/api/track/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const data: unknown = await response.json().catch(() => ({}));
      const dataObject =
        typeof data === "object" && data !== null
          ? (data as Record<string, unknown>)
          : null;

      const success = dataObject && typeof dataObject.success === "boolean"
        ? dataObject.success
        : true;

      const message =
        dataObject && typeof dataObject.message === "string"
          ? dataObject.message
          : undefined;

      if (response.ok && success) {
        setRecoverySuccess(true);
        setPhoneNumber("");
        setTimeout(() => {
          setShowRecoveryDialog(false);
          setRecoverySuccess(false);
        }, 3000);
      } else {
        setRecoveryError(message || "Nomor tidak terdaftar dalam sistem kami.");
      }
    } catch {
      setRecoveryError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSendingRecovery(false);
    }
  };

  return (
    <Card className="border-border/40 shadow-sm bg-card/50">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm sm:text-base">
                Lupa Token atau Link Hilang?
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Kami akan mengirim ulang link ke WhatsApp Anda
              </p>
            </div>
          </div>
          <Dialog
            open={showRecoveryDialog}
            onOpenChange={setShowRecoveryDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="whitespace-nowrap border-input text-foreground hover:bg-secondary hover:text-foreground w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 mr-2" />
                Kirim Ulang Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Recovery Token
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Masukkan nomor WhatsApp yang terdaftar untuk menerima link
                  tracking proyek Anda
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                {recoverySuccess && (
                  <Alert className="border-border/70 bg-muted/30 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4 text-foreground" />
                    <AlertDescription className="text-foreground">
                      Link telah dikirim ke WhatsApp Anda. Silakan cek HP.
                    </AlertDescription>
                  </Alert>
                )}

                {recoveryError && (
                  <Alert
                    variant="destructive"
                    className="animate-in fade-in slide-in-from-top-2"
                  >
                    <AlertDescription>{recoveryError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-foreground"
                  >
                    Nomor WhatsApp
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08123456789 atau 628123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 border-input focus-visible:ring-primary"
                      required
                      disabled={isSendingRecovery || recoverySuccess}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Nomor akan otomatis diformat ke 62xxx
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full shadow-none transition-all duration-200"
                  disabled={isSendingRecovery || recoverySuccess}
                >
                  {isSendingRecovery ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : recoverySuccess ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Terkirim!
                    </>
                  ) : (
                    "Kirim Link"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

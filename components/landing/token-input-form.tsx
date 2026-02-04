"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Loader2, ArrowRight } from "lucide-react";

export function TokenInputForm() {
  const router = useRouter();

  // Tracking State
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError("");
    setIsValidating(true);

    try {
      const response = await fetch("/api/track/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        router.push(`/track/${token}`);
      } else {
        setTokenError(
          "Token tidak ditemukan. Periksa kembali atau gunakan fitur recovery.",
        );
      }
    } catch {
      setTokenError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <form onSubmit={handleTokenSubmit} className="space-y-4">
      {tokenError && (
        <Alert
          variant="destructive"
          className="animate-in fade-in slide-in-from-top-2 border-border/70 bg-muted/30 text-foreground"
        >
          <AlertDescription className="font-medium">
            {tokenError}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="token" className="text-sm font-medium text-foreground">
          Token Proyek
        </Label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <Input
            id="token"
            type="text"
            placeholder="Contoh: trx-8823-pam"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="pl-10 h-12 text-base bg-background/50 border-border/70 focus:border-foreground/40 focus-visible:ring-ring/30 transition-all rounded-xl"
            required
            disabled={isValidating}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Opsional. Gunakan jika Kamu hanya punya token.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-sm font-medium transition-all rounded-xl"
        disabled={isValidating || !token}
      >
        {isValidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memeriksa...
          </>
        ) : (
          <>
            Buka Progress <ArrowRight className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}

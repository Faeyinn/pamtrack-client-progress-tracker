"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-20 w-20 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 shadow-2xl shadow-destructive/20 animate-bounce">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-black tracking-tight text-foreground mb-3 font-[family:var(--font-display)]">
        WADUH, ADA MASALAH<span className="text-destructive">.</span>
      </h1>

      <p className="text-muted-foreground max-w-md mb-10 font-medium">
        Terjadi kesalahan saat memuat dashboard. Hal ini mungkin karena masalah
        koneksi atau sesi Anda telah berakhir.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          className="h-12 px-8 rounded-xl font-bold tracking-wider bg-foreground text-background hover:scale-105 transition-all"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          COBA LAGI
        </Button>

        <Button
          variant="outline"
          asChild
          className="h-12 px-8 rounded-xl font-bold tracking-wider border-border hover:bg-muted transition-all"
        >
          <Link href="/admin/login">
            <Home className="w-4 h-4 mr-2" />
            LOGIN KEMBALI
          </Link>
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <pre className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border text-left text-xs overflow-auto max-w-2xl w-full font-mono text-destructive">
          {error.message}
          {error.stack}
        </pre>
      )}
    </div>
  );
}

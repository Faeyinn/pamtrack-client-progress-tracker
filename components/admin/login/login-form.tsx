"use client";

import * as React from "react";
import { useLogin } from "@/components/admin/login/hooks/use-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Eye, EyeOff, Loader2, User, Lock } from "lucide-react";

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  } = useLogin();

  return (
    <div className="space-y-10">
      <div className="space-y-4 text-center lg:text-left">
        <h2 className="text-balance font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight leading-tight sm:text-4xl">
          Selamat Datang Kembali
        </h2>
        <p className="text-muted-foreground font-medium">
          Masukkan kredensial Kamu untuk mengakses dashboard admin.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-2 border-border/70 bg-muted/30 text-foreground text-sm font-medium py-2.5 rounded-xl"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-foreground ml-1">
            Username
          </Label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-foreground transition-colors">
              <User className="w-5 h-5" />
            </div>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-11 h-12 bg-background border-border/70 focus:border-foreground/40 focus-visible:ring-ring/30 transition-colors rounded-2xl"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="next"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
          </div>

          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-foreground transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-12 h-12 bg-background border-border/70 focus:border-foreground/40 focus-visible:ring-ring/30 transition-colors rounded-2xl"
              autoComplete="current-password"
              enterKeyHint="go"
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={() => setIsPasswordVisible((value) => !value)}
              aria-label={
                isPasswordVisible
                  ? "Sembunyikan password"
                  : "Tampilkan password"
              }
              aria-pressed={isPasswordVisible}
              className="touch-target absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-sm font-bold uppercase tracking-[0.15em] shadow-md hover:shadow-lg transition-all rounded-2xl mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Tunggu Yaa…
            </>
          ) : (
            <>
              Masuk Sekarang <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

"use client";

import * as React from "react";
import { useLogin } from "@/components/admin/login/hooks/use-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

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
        <h2 className="text-3xl font-black tracking-tighter uppercase leading-tight">
          Selamat Datang Kembali
        </h2>
        <p className="text-muted-foreground font-medium">
          Masukkan kredensial Kamu untuk mengakses dashboard admin.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-2 border-destructive/50 bg-destructive/10 text-destructive text-sm font-medium py-2"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 bg-background"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="next"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-background pr-12"
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
              className="touch-target absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
          className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Tunggu Yaa...
            </>
          ) : (
            <>
              Masuk <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

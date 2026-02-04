export function LandingFooter() {
  return (
    <div className="text-center space-y-8 pt-12 pb-8">
      <div className="flex justify-center gap-6 text-sm font-medium text-foreground/80">
        <a href="#" className="hover:text-foreground">
          Layanan
        </a>
        <a href="#" className="hover:text-foreground">
          Tentang Kami
        </a>
        <a href="#" className="hover:text-foreground">
          Kontak
        </a>
      </div>

      <div className="h-px w-24 bg-border mx-auto" />

      <div className="text-xs text-muted-foreground/60 flex items-center justify-center gap-4">
        <span>© 2026 PAM Techno</span>
        <span>•</span>
        <a href="#" className="hover:text-primary transition-colors">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="#" className="hover:text-primary transition-colors">
          Terms
        </a>
      </div>
    </div>
  );
}

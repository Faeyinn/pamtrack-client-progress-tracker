import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderKanban } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
}

export function PageHeader({ title, subtitle, backHref }: PageHeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <Link href={backHref}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-md">
              <FolderKanban className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

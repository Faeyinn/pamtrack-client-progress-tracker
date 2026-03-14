"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Boxes = dynamic(() => import("@/components/anim/background-boxes").then(mod => mod.Boxes), {
  ssr: false,
});

interface PageBackgroundProps {
  showBoxes?: boolean;
  variant?: "full" | "simple";
  className?: string;
}

export function PageBackground({ 
  showBoxes = true, 
  variant = "full",
  className 
}: PageBackgroundProps) {
  return (
    <div className={cn("premium-bg-decoration", className)}>
      <div className="premium-bg-overlay" />
      
      {variant === "full" && (
        <>
          <div className="absolute inset-0 bg-grid-lines opacity-50 dark:opacity-30" />
          {showBoxes && (
            <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_78%)]">
              <Boxes />
            </div>
          )}
        </>
      )}
      
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent" />
    </div>
  );
}

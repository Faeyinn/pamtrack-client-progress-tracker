"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteorStyles, setMeteorStyles] = React.useState<
    Array<React.CSSProperties>
  >([]);

  React.useEffect(() => {
    const meteorCount = number || 20;
    const styles = new Array(meteorCount).fill(true).map((_, idx) => {
      // Calculate position to evenly distribute meteors across container width
      const position = idx * (800 / meteorCount) - 400; // Spread across 800px range, centered
      return {
        top: "-40px",
        left: position + "px",
        animationDelay: Math.random() * 5 + "s",
        animationDuration: Math.floor(Math.random() * (10 - 5) + 5) + "s",
      };
    });
    setMeteorStyles(styles);
  }, [number]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteorStyles.map((style, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            // Emerald meteors with gold accent trail
            "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-primary-foreground/80 shadow-[0_0_0_1px_oklch(0.65_0.19_160_/_0.4)]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-primary-foreground/60 before:via-accent/30 before:to-transparent before:content-['']",
            className,
          )}
          style={style}
        ></span>
      ))}
    </motion.div>
  );
};

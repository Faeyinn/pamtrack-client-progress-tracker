"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

interface CursorCardsContainerProps {
  children: React.ReactNode;
  className?: string;
  proximityRange?: number;
}

interface CursorCardProps {
  children?: React.ReactNode;
  className?: string;
  illuminationRadius?: number;
  illuminationColor?: string;
  illuminationOpacity?: number;
  primaryHue?: string;
  secondaryHue?: string;
  borderColor?: string;
  surfaceClassName?: string;
}

interface InternalCursorCardProps
  extends CursorCardProps, React.HTMLAttributes<HTMLDivElement> {
  globalMouseX?: MotionValue<number>;
  globalMouseY?: MotionValue<number>;
}

function useMousePosition() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handlePointerMovement = (event: PointerEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    // Only add listener if device supports hover (not touch-only)
    if (window.matchMedia("(hover: hover)").matches) {
      document.addEventListener("pointermove", handlePointerMovement);
    }

    return () =>
      document.removeEventListener("pointermove", handlePointerMovement);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
}

function useCardActivation(
  elementRef: React.RefObject<HTMLDivElement | null>,
  globalMouseX: MotionValue<number>,
  globalMouseY: MotionValue<number>,
  illuminationRadius: number,
) {
  const localMouseX = useMotionValue(-illuminationRadius);
  const localMouseY = useMotionValue(-illuminationRadius);
  const [isCardActive, setIsCardActive] = useState(false);

  useEffect(() => {
    const updateActivation = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const extendedProximity = 100;

      const gX = globalMouseX.get();
      const gY = globalMouseY.get();

      const isNearCard =
        gX >= rect.left - extendedProximity &&
        gX <= rect.right + extendedProximity &&
        gY >= rect.top - extendedProximity &&
        gY <= rect.bottom + extendedProximity;

      if (isNearCard !== isCardActive) {
        setIsCardActive(isNearCard);
      }

      if (isNearCard) {
        localMouseX.set(gX - rect.left);
        localMouseY.set(gY - rect.top);
      } else {
        localMouseX.set(-illuminationRadius);
        localMouseY.set(-illuminationRadius);
      }
    };

    // Subscribing to changes
    const unsubscribeX = globalMouseX.on("change", updateActivation);
    const unsubscribeY = globalMouseY.on("change", updateActivation);

    // Initial check
    updateActivation();

    // DEBUG: Log to see if activation is working
    // console.log("useCardActivation setup", { isWithinRange, active: isCardActive });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [
    globalMouseX,
    globalMouseY,
    illuminationRadius,
    localMouseX,
    localMouseY,
    isCardActive,
  ]);

  return { localMouseX, localMouseY, isCardActive };
}

export function CursorCardsContainer({
  children,
  className,
}: CursorCardsContainerProps) {
  const { mouseX, mouseY } = useMousePosition();

  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === CursorCard) {
      return React.cloneElement(
        child as React.ReactElement<InternalCursorCardProps>,
        {
          globalMouseX: mouseX,
          globalMouseY: mouseY,
        },
      );
    }
    return child;
  });

  return <div className={cn("relative", className)}>{enhancedChildren}</div>;
}

export function CursorCard({
  children,
  className,
  illuminationRadius = 200,
  illuminationColor = "oklch(0.82 0.06 155 / 0.18)", // Baby Green glow
  illuminationOpacity = 0.85,
  primaryHue = "oklch(0.78 0.05 158)", // Pale Sage
  secondaryHue = "oklch(0.82 0.06 155)", // Baby Green
  borderColor = "oklch(0.94 0.01 155)", // Barely visible border
  globalMouseX, // Now MotionValue
  globalMouseY, // Now MotionValue
  surfaceClassName,
  ...props
}: InternalCursorCardProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  // Fallback motion values if not provided (though they should be via Container)
  const defaultMouseX = useMotionValue(0);
  const defaultMouseY = useMotionValue(0);

  const mX = globalMouseX || defaultMouseX;
  const mY = globalMouseY || defaultMouseY;

  const { localMouseX, localMouseY, isCardActive } = useCardActivation(
    elementRef,
    mX,
    mY,
    illuminationRadius,
  );

  const gradientBackground = useMotionTemplate`
    radial-gradient(${illuminationRadius}px circle at ${localMouseX}px ${localMouseY}px,
    ${primaryHue}, 
    ${secondaryHue},
    ${borderColor} 100%
    )
  `;

  const illuminationBackground = useMotionTemplate`
    radial-gradient(${illuminationRadius}px circle at ${localMouseX}px ${localMouseY}px, 
    ${illuminationColor}, transparent 100%)
  `;

  return (
    <div
      ref={elementRef}
      className={cn("group relative rounded-[inherit]", className)}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: gradientBackground }}
      />
      <div
        className={cn(
          "absolute inset-px rounded-[inherit] bg-white dark:bg-black",
          surfaceClassName,
        )}
      />
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300",
          isCardActive && "opacity-100",
        )}
        style={{
          background: illuminationBackground,
          opacity: isCardActive ? illuminationOpacity : 0,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type ScrollLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  className?: string;
};

export function ScrollToAccessLink({ children, className, onClick, ...rest }: ScrollLinkProps) {
  return (
    <a
      href="#access"
      className={className}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();

        const target = document.getElementById("access");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        window.dispatchEvent(new Event("landing:highlight-access"));

        const nextUrl =
          window.location.pathname + window.location.search + "#access";
        window.history.replaceState(null, "", nextUrl);
      }}
    >
      {children}
    </a>
  );
}

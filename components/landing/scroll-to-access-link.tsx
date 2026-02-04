"use client";

import type { ReactNode } from "react";

export function ScrollToAccessLink(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#access"
      className={props.className}
      onClick={(e) => {
        e.preventDefault();

        const target = document.getElementById("access");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        const nextUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", nextUrl);
      }}
    >
      {props.children}
    </a>
  );
}

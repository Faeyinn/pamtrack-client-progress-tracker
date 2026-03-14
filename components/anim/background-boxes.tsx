import { cn } from "@/lib/utils";

const COLORS = [
  "oklch(0.82 0.06 155 / 0.22)",
  "oklch(0.85 0.1 85 / 0.18)",
  "oklch(0.75 0.08 200 / 0.18)",
  "oklch(0.78 0.05 158 / 0.2)",
];

const ROWS = Array.from({ length: 34 });
const COLS = Array.from({ length: 18 });

export function Boxes({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        transform:
          "translate(-38%,-56%) skewX(-46deg) skewY(14deg) scale(0.9) translateZ(0)",
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4 opacity-70",
        className,
      )}
      {...rest}
    >
      {ROWS.map((_, i) => (
        <div
          key={`row` + i}
          className="relative h-12 w-24 border-l border-foreground/10"
        >
          {COLS.map((_, j) => (
            <div
              key={`col` + j}
              className="relative h-12 w-24 border-t border-r border-foreground/10 transition-colors duration-500 hover:bg-accent/10"
              style={{
                backgroundColor:
                  (i + j) % 11 === 0 ? COLORS[(i + j) % COLORS.length] : "",
              }}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-foreground/10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

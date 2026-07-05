import Link from "next/link";
import { px, uiString } from "@/lib/portfolio-config";

export default function NotFound() {
  return (
    <main
      style={{ maxWidth: px(1400) }}
      className="relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16"
    >
      <div className="mx-auto w-full max-w-2xl" style={{ backgroundColor: "hsl(var(--background))" }}>
        <div className="flex flex-col gap-y-3">
          <p className="font-mono text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            404
          </p>
          <h1 className="text-2xl font-bold">{uiString("notFoundTitle")}</h1>
          <p className="font-mono text-sm text-pretty" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
            {uiString("notFoundDescription")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-x-1.5 font-mono text-sm hover:underline"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={px(14)}
              height={px(14)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {uiString("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
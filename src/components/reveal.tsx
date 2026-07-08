"use client";

import { useEffect, useRef, useState } from "react";

// Fades an element in (with a slight upward slide) the first time it enters
// the viewport. Content already visible on load reveals immediately;
// content further down the page waits until the user scrolls to it.
// Transitions only opacity/transform (not "all") so it never slows down
// unrelated changes like a light/dark theme switch. Disable via the
// `enabled` prop (wired to `meta.animations` in portfolio.config.json).
// `atPageEnd` disables the -40px bottom inset — elements at the very bottom
// of the page (e.g. the credits line) can never scroll 40px past the viewport
// edge, so with the inset they would stay invisible forever on short screens.
export function Reveal({ children, className, atPageEnd, enabled = true }: { children: React.ReactNode; className?: string; atPageEnd?: boolean; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      // If animations get turned off mid-session (live preview), make sure
      // nothing stays stuck hidden.
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: atPageEnd ? "0px" : "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [atPageEnd, enabled]);

  if (!enabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 print:!opacity-100 print:!translate-y-0 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

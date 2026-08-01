"use client";

import { useRef } from "react";
import { signals } from "@/lib/signals";
import { useRaf } from "@/lib/useRaf";

const NAV = ["Overview", "Universe", "Heroes", "Trailers", "Tickets"];

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function SiteHeader() {
  const ref = useRef<HTMLElement>(null);

  useRaf(() => {
    const el = ref.current;
    if (!el) return;
    const h = signals.header * (1 - smoothstep(0.02, 0.14, signals.reel));
    el.style.opacity = h.toFixed(3);
    el.style.transform = `translateY(${(1 - h) * -20}px)`;
    el.style.pointerEvents = h > 0.6 ? "auto" : "none";
    el.style.visibility = h < 0.01 ? "hidden" : "visible";
  });

  return (
    <header ref={ref} className="site-header" style={{ opacity: 0, visibility: "hidden" }}>
      <div className="site-header-brand">
        <span className="site-header-mark" aria-hidden />
        <span className="site-header-brandText">
          MARVEL<b>STUDIOS</b>
        </span>
      </div>
      <nav className="site-header-nav">
        {NAV.map((n) => (
          <a key={n} href="#" className="site-header-navLink" onClick={(e) => e.preventDefault()}>
            {n}
          </a>
        ))}
      </nav>
      <button className="site-header-cta" type="button">
        Get Tickets
      </button>
    </header>
  );
}

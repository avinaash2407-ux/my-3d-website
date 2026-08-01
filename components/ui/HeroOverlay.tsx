"use client";

import { useRef } from "react";
import { signals } from "@/lib/signals";
import { VIDEO } from "@/lib/constants";
import { useRaf } from "@/lib/useRaf";

export default function HeroOverlay() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useRaf(() => {
    const el = wrapRef.current;
    if (!el) return;
    const h = signals.heroOp;
    el.style.opacity = h.toFixed(3);
    el.style.visibility = h < 0.01 ? "hidden" : "visible";
    if (barRef.current) {
      const p = Math.min(1, Math.max(0, signals.heroT / VIDEO.heroDur));
      barRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
    }
  });

  return (
    <div ref={wrapRef} className="hero-ui" style={{ opacity: 0 }} aria-hidden>
      <div className="hero-ui-text">
        <span className="hero-ui-kicker">Phase 01 · Marvel Studios</span>
      </div>
      <div className="hero-ui-scrub">
        <span className="hero-ui-scrubLabel">Scroll to play the trailer</span>
        <span className="hero-ui-scrubTrack">
          <span ref={barRef} className="hero-ui-scrubFill" />
        </span>
      </div>
    </div>
  );
}

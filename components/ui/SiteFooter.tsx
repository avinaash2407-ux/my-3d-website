"use client";

import { useRef } from "react";
import { signals } from "@/lib/signals";
import { useRaf } from "@/lib/useRaf";

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const NAV = ["Overview", "Characters", "Story", "Timeline"];
const SOCIAL = ["Instagram", "X", "YouTube"];

export default function SiteFooter() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLElement>(null);

  useRaf(() => {
    const foot = signals.footer;
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (foot <= 0.0006) {
      if (wrap.style.visibility !== "hidden") wrap.style.visibility = "hidden";
      return;
    }
    wrap.style.visibility = "visible";
    if (footRef.current) {
      footRef.current.style.transform = `translateY(${((1 - foot) * 100).toFixed(2)}%)`;
      footRef.current.style.opacity = smoothstep(0, 0.25, foot).toFixed(3);
    }
  });

  const noop = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="footer-wrap" ref={wrapRef} style={{ visibility: "hidden" }}>
      <footer className="site-footer" ref={footRef} style={{ opacity: 0 }}>
        <span className="footer-glow" />
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-mark">
              Doomsday<span>.</span>
            </span>
            <span className="footer-tag">A scroll-driven cinematic concept experience.</span>
          </div>

          <nav>
            <div className="footer-colHead">Explore</div>
            <div className="footer-links">
              {NAV.map((l) => (
                <a key={l} href="#" onClick={noop}>
                  {l}
                </a>
              ))}
            </div>
          </nav>

          <div>
            <div className="footer-colHead">Follow</div>
            <div className="footer-social">
              {SOCIAL.map((l) => (
                <a key={l} href="#" onClick={noop}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-rule" />
        <div className="footer-base">
          <span>© 2026 · Placeholder — fan concept, not affiliated with Marvel.</span>
          <span>Built as a cinematic web experience.</span>
        </div>
      </footer>
    </div>
  );
}

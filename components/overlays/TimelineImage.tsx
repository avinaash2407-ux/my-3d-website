"use client";

import { useRef } from "react";
import { signals } from "@/lib/signals";
import { ASSETS } from "@/lib/constants";
import { useRaf } from "@/lib/useRaf";
import "./timeline.css";

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const IMG_ASPECT = 3354 / 700;

export default function TimelineImage() {
  const layerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useRaf(() => {
    const m = signals.mcu;
    const layer = layerRef.current;
    if (!layer) return;

    if (m <= 0.0008 || m >= 0.9996) {
      if (layer.style.visibility !== "hidden") layer.style.visibility = "hidden";
      return;
    }
    layer.style.visibility = "visible";
    layer.style.opacity = (smoothstep(0, 0.05, m) * (1 - smoothstep(0.94, 1.0, m))).toFixed(3);

    const pan = panRef.current;
    if (pan) {
      const imgH = imgRef.current?.offsetHeight || window.innerWidth * IMG_ASPECT;
      const dist = Math.max(0, imgH - window.innerHeight);
      pan.style.transform = `translate3d(0, ${(-m * dist).toFixed(1)}px, 0)`;
    }
  });

  return (
    <div className="mcu-layer" ref={layerRef} style={{ opacity: 0, visibility: "hidden" }} aria-hidden>
      <div className="timeline-pan" ref={panRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="timeline-img" ref={imgRef} src={ASSETS.timelineImg} alt="" draggable={false} />
      </div>
      <span className="timeline-fade" />
      <span className="timeline-scrim" />
      <span className="timeline-glow" />

      <div className="timeline-content">
        <span className="timeline-kicker">The Infinity Saga &amp; Beyond</span>
        <h2 className="timeline-title">
          <span className="timeline-titleLine">The Road</span>
          <span className="timeline-titleLine">to Doomsday</span>
        </h2>
        <span className="timeline-rule" />
        <p className="timeline-desc">
          Every hero, every world, every sacrifice — eighteen years of saga have been building to this.
        </p>
      </div>
    </div>
  );
}

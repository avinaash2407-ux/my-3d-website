"use client";

import { useEffect, useRef } from "react";
import { signals } from "@/lib/signals";
import { useRaf } from "@/lib/useRaf";
import "./reel.css";

interface Scene {
  n: string;
  slug: string;
  timecode: string;
  accent: string;
}

const SCENES: Scene[] = [
  { n: "01", slug: "doom", timecode: "00:01:12:04", accent: "#00ff9c" },
  { n: "02", slug: "blackpanther", timecode: "00:04:38:21", accent: "#38ffb2" },
  { n: "03", slug: "cyclops", timecode: "00:07:55:09", accent: "#00d884" },
  { n: "04", slug: "mystique", timecode: "00:11:20:16", accent: "#9dffd6" },
];

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function HorizontalReel() {
  const layerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (!v) return;
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
    });
  }, []);

  useRaf(() => {
    const reel = signals.reel;
    const layer = layerRef.current;
    if (!layer) return;

    if (reel <= 0.0008 || reel >= 0.9992) {
      if (layer.style.visibility !== "hidden") layer.style.visibility = "hidden";
      for (const v of videoRefs.current) if (v && !v.paused) v.pause();
      return;
    }
    layer.style.visibility = "visible";

    const intro = smoothstep(0, 0.08, reel);
    const outro = smoothstep(0.9, 1.0, reel);
    layer.style.opacity = (intro * (1 - outro)).toFixed(3);

    const stage = stageRef.current;
    if (stage) {
      const sc = (0.92 + 0.08 * intro) * (1 - 0.05 * outro);
      stage.style.transform = `scale(${sc.toFixed(4)})`;
    }

    const track = trackRef.current;
    if (!track) return;
    const vw = window.innerWidth;
    const maxShift = Math.max(0, track.scrollWidth - vw);
    const travel = clamp01((reel - 0.08) / (0.9 - 0.08));
    const x = -travel * maxShift;
    track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${travel.toFixed(4)})`;
    }

    const cx = vw / 2;
    for (let i = 0; i < SCENES.length; i++) {
      const v = videoRefs.current[i];
      if (v && v.paused) v.play().catch(() => {});

      const f = frameRefs.current[i];
      if (!f) continue;
      const rect = f.getBoundingClientRect();
      const fc = rect.left + rect.width / 2;
      const off = fc - cx;
      const close = 1 - clamp01(Math.abs(off) / (vw * 0.62));
      const scl = 0.82 + close * 0.2;
      const rot = clamp01((off / vw + 1) / 2) * 2 - 1;
      f.style.transform = `perspective(1600px) rotateY(${(-rot * 7).toFixed(2)}deg) scale(${scl.toFixed(3)})`;
      f.style.opacity = (0.34 + close * 0.66).toFixed(3);
      f.style.zIndex = String(100 + Math.round(close * 100));
      const inner = innerRefs.current[i];
      if (inner) inner.style.transform = `translate3d(${(-off * 0.04).toFixed(1)}px, 0, 0)`;
    }
  });

  return (
    <div className="reel-layer" ref={layerRef} style={{ opacity: 0, visibility: "hidden" }} aria-hidden>
      <div className="reel-stage" ref={stageRef}>
        <div className="reel-track" ref={trackRef}>
          {SCENES.map((s, i) => (
            <div
              key={s.n}
              className="reel-frame"
              ref={(el) => { frameRefs.current[i] = el; }}
              style={{ "--accent": s.accent } as React.CSSProperties}
            >
              <div className="reel-inner" ref={(el) => { innerRefs.current[i] = el; }}>
                <div className="reel-screen">
                  <video
                    ref={(el) => {
                      if (el) {
                        el.muted = true;
                        el.playsInline = true;
                      }
                      videoRefs.current[i] = el;
                    }}
                    className="reel-video"
                    src={`/videos/char-${s.slug}.mp4`}
                    poster={`/videos/char-${s.slug}-poster.jpg`}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                  />
                  <span className="reel-scrim" />
                  <span className="reel-bracket reel-tl" />
                  <span className="reel-bracket reel-tr" />
                  <span className="reel-bracket reel-bl" />
                  <span className="reel-bracket reel-br" />
                  <div className="reel-status">
                    <span className="reel-dot" />
                    <span>Scene {s.n}</span>
                  </div>
                  <div className="reel-timecode">{s.timecode}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reel-label">
        <div className="reel-labelKicker">Section 04</div>
        <div className="reel-labelTitle">The Cinematic Timeline</div>
      </div>
      <div className="reel-progress">
        <span className="reel-progressFill" ref={progressRef} />
      </div>
    </div>
  );
}

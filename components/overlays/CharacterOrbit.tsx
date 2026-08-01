"use client";

import { useEffect, useRef } from "react";
import { signals } from "@/lib/signals";
import { useRaf } from "@/lib/useRaf";
import "./orbit.css";

interface Character {
  slug: string;
  name: string;
  desc: string;
}

const CHARACTERS: Character[] = [
  {
    slug: "doom",
    name: "Doctor Doom",
    desc: "The iron-willed sovereign of Latveria — master of science and sorcery, bending every reality to his design.",
  },
  {
    slug: "blackpanther",
    name: "Black Panther",
    desc: "Wakanda's fearless protector, striking with the speed, precision, and fury of the panther goddess.",
  },
  {
    slug: "cyclops",
    name: "Cyclops",
    desc: "Field leader of the X-Men, unleashing devastating optic force with unshakable discipline and resolve.",
  },
  {
    slug: "mystique",
    name: "Mystique",
    desc: "The shape-shifting infiltrator who can wear any face — trusted by none, lethal in every form she takes.",
  },
  {
    slug: "gambit",
    name: "Gambit",
    desc: "The Ragin' Cajun — charging every card with explosive kinetic energy and every fight with reckless charm.",
  },
  {
    slug: "namor",
    name: "Namor",
    desc: "The winged sovereign of Talokan — as ancient as the deep and as merciless as the tide he commands.",
  },
];

const TAU = Math.PI * 2;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function CharacterOrbit() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const frameSkip = useRef(0);

  useEffect(() => {
    videoRefs.current.forEach(v => {
      if (!v) return;
      v.muted = true;
      const p = v.play();
      if (p) p.then(() => { v.pause(); v.currentTime = 0; }).catch(() => {});
    });
  }, []);

  useRaf(() => {
    frameSkip.current = (frameSkip.current + 1) % 2;
    if (frameSkip.current !== 0) return;
    const s = signals.showcase;
    const t = signals.time;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const Rx = vw * 0.3;
    const Ry = vh * 0.15;
    const base = s * TAU * 0.85 + t * 0.045;
    const N = CHARACTERS.length;

    for (let i = 0; i < N; i++) {
      const card = cardRefs.current[i];
      if (!card) continue;

      const enterAt = 0.05 + i * 0.055;
      const enter = smoothstep(enterAt, enterAt + 0.16, s);
      if (enter <= 0.001) {
        if (card.style.opacity !== "0") {
          card.style.opacity = "0";
          card.style.pointerEvents = "none";
        }
        continue;
      }
      const theta = base + i * (TAU / N);
      const d = Math.cos(theta);
      const depth01 = (d + 1) / 2;
      const x = Math.sin(theta) * Rx;
      const y = d * Ry;
      const scale = lerp(0.6, 1.06, depth01) * lerp(0.5, 1, enter);
      const rotY = -Math.sin(theta) * 12;
      const enterX = (1 - enter) * (vw * 0.55);

      card.style.transform =
        `translate(-50%, -50%) perspective(1100px) translate3d(${(x + enterX).toFixed(1)}px, ${y.toFixed(1)}px, 0)` +
        ` rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.opacity = (lerp(0.32, 1, depth01) * enter).toFixed(3);
      card.style.zIndex = d > 0 ? "4" : "2";
      card.style.setProperty("--glow", smoothstep(0.55, 1, depth01).toFixed(3));
    }
  });

  return (
    <div className="orbit-layer" aria-hidden>
      {CHARACTERS.map((c, i) => (
        <div
          key={c.slug}
          className={`orbit-card`}
          ref={(el) => { cardRefs.current[i] = el; }}
          style={{ opacity: 0 }}
          onMouseEnter={() => {
            const v = videoRefs.current[i];
            if (v) { v.currentTime = 0; v.play().catch(() => {}); }
          }}
          onMouseLeave={() => {
            const v = videoRefs.current[i];
            if (v) v.pause();
          }}
          onTouchStart={() => {
            const v = videoRefs.current[i];
            if (v) { v.currentTime = 0; v.play().catch(() => {}); }
          }}
          onTouchEnd={() => {
            const v = videoRefs.current[i];
            if (v) v.pause();
          }}
        >
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
              if (el) el.onended = () => { el.currentTime = 0; };
            }}
            className="orbit-video"
            src={`/videos/char-${c.slug}.mp4`}
            poster={`/videos/char-${c.slug}-poster.jpg`}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
          />
          <div className="orbit-grad" />
          <div className="orbit-frame" />
          <div className="orbit-tick">
            <span className="orbit-dot" />
            {`0${i + 1} · Doomsday`}
          </div>
          <div className="orbit-info">
            <div className="orbit-name">{c.name}</div>
            <div className="orbit-desc">{c.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

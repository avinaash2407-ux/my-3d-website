"use client";

import { ASSETS } from "./constants";

export const VIDEO_META = {
  marvel: { src: ASSETS.marvelVideo, poster: ASSETS.marvelPoster, aspect: 1180 / 490 },
  hero: { src: ASSETS.heroVideo, poster: ASSETS.heroPoster, aspect: 1770 / 742 },
  finale: { src: ASSETS.finaleVideo, poster: ASSETS.finalePoster, aspect: 1180 / 486 },
} as const;

type Which = "marvel" | "hero" | "finale";
const els: Record<Which, HTMLVideoElement | null> = { marvel: null, hero: null, finale: null };
export function setVideoEl(which: Which, el: HTMLVideoElement | null) {
  els[which] = el;
}
export function getVideoEl(which: Which) {
  return els[which];
}

export function primeElement(el: HTMLVideoElement | null) {
  if (!el) return;
  try {
    el.muted = true;
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.then(() => el.pause()).catch(() => {});
    } else {
      el.pause();
    }
  } catch {
    /* noop */
  }
}

export function scrubEl(el: HTMLVideoElement | null, t: number) {
  if (!el || el.readyState < 1) return;
  const dur = el.duration || 1;
  const clamped = Math.max(0, Math.min(dur - 0.03, t));
  if (Math.abs(el.currentTime - clamped) > 0.008) {
    el.currentTime = clamped;
  }
}

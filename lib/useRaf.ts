"use client";

import { useEffect, useRef } from "react";

type Cb = (t: number) => void;
const callbacks = new Set<Cb>();
let raf = 0;
let running = false;

function tick(t: number) {
  callbacks.forEach((cb) => cb(t));
  raf = requestAnimationFrame(tick);
}
function ensure() {
  if (!running && callbacks.size) {
    running = true;
    raf = requestAnimationFrame(tick);
  }
}

export function useRaf(cb: Cb) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    const fn: Cb = (t) => ref.current(t);
    callbacks.add(fn);
    ensure();
    return () => {
      callbacks.delete(fn);
      if (callbacks.size === 0) {
        cancelAnimationFrame(raf);
        running = false;
      }
    };
  }, []);
}

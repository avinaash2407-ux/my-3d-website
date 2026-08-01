"use client";

import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/constants";
import { setVideoEl } from "@/lib/videos";

export default function VideoLayer() {
  const marvelRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLVideoElement>(null);
  const finaleRef = useRef<HTMLVideoElement>(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("scroll-locked");
    const m = marvelRef.current;
    const h = heroRef.current;
    const f = finaleRef.current;
    if (m) m.muted = true;
    if (h) h.muted = true;
    if (f) f.muted = true;
    setVideoEl("marvel", m);
    setVideoEl("hero", h);
    setVideoEl("finale", f);

    if (m) {
      m.play().catch(() => {});
      const onEnd = () => {
        setIntroDone(true);
        document.documentElement.classList.remove("scroll-locked");
      };
      m.addEventListener("ended", onEnd, { once: true });
      return () => {
        m.removeEventListener("ended", onEnd);
        document.documentElement.classList.remove("scroll-locked");
        setVideoEl("marvel", null);
        setVideoEl("hero", null);
        setVideoEl("finale", null);
      };
    }

    return () => {
      document.documentElement.classList.remove("scroll-locked");
      setVideoEl("marvel", null);
      setVideoEl("hero", null);
      setVideoEl("finale", null);
    };
  }, []);

  return (
    <div className="video-layer" aria-hidden>
      <video
        ref={marvelRef}
        className="cover-video"
        src={ASSETS.marvelVideo}
        poster={ASSETS.marvelPoster}
        preload="auto"
        muted
        playsInline
        style={{ opacity: introDone ? 0 : 1, transition: "opacity 0.5s" }}
      />
      <video
        ref={heroRef}
        className="cover-video"
        src={ASSETS.heroVideo}
        poster={ASSETS.heroPoster}
        preload="auto"
        muted
        playsInline
        style={{ opacity: 0 }}
      />
      <video
        ref={finaleRef}
        className="cover-video"
        src={ASSETS.finaleVideo}
        poster={ASSETS.finalePoster}
        preload="auto"
        muted
        playsInline
        style={{ opacity: 0 }}
      />
    </div>
  );
}

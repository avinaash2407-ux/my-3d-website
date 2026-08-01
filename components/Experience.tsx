"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/useLenis";
import { useExperience } from "@/lib/store";
import { signals } from "@/lib/signals";
import { getVideoEl, scrubEl } from "@/lib/videos";
import { VIDEO, SCROLL, TIMELINE_UNITS } from "@/lib/constants";

import CinematicCanvas from "@/components/webgl/CinematicCanvas";
import VideoLayer from "@/components/overlays/VideoLayer";
import CharacterOrbit from "@/components/overlays/CharacterOrbit";
import StoryStack from "@/components/overlays/StoryStack";
import HorizontalReel from "@/components/overlays/HorizontalReel";
import TimelineImage from "@/components/overlays/TimelineImage";
import TitleReveal from "@/components/overlays/TitleReveal";
import FlashOverlay from "@/components/overlays/FlashOverlay";
import CinematicText from "@/components/overlays/CinematicText";
import ScrollCue from "@/components/ui/ScrollCue";
import SiteHeader from "@/components/ui/SiteHeader";
import HeroOverlay from "@/components/ui/HeroOverlay";
import SiteFooter from "@/components/ui/SiteFooter";

const T = {
  introEnd: 1.4,
  portalStart: 2.0,
  heroEnter: 2.8,
  textStart: 3.3,
  textEnd: 5.9,
  videoStart: 5.9,
  videoEnd: 9.3,
  showcaseStart: 9.9,
  showcaseEnd: 14.6,
  storyStart: 14.9,
  storyEnd: 21.5,
  reelStart: 22.6,
  reelEnd: 29.4,
  finaleStart: 29.0,
  finaleFadeEnd: 29.8,
  finaleScrubStart: 29.8,
  finaleScrubEnd: 36.5,
  mcuStart: 36.8,
  mcuEnd: 42.4,
  titleStart: 42.1,
  titleFadeEnd: 43.0,
  footerStart: 45.7,
  total: TIMELINE_UNITS,
};

export default function Experience() {
  const [mounted, setMounted] = useState(false);
  useLenis();
  const trackRef = useRef<HTMLDivElement>(null);
  const builtRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      signals.mtx = (e.clientX / window.innerWidth) * 2 - 1;
      signals.mty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let started = false;
    const onGesture = () => {
      if (started) return;
      started = true;
      useExperience.getState().start();
    };
    const evs = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;
    evs.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));

    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (rm?.matches) useExperience.getState().setReduceMotion(true);

    return () => {
      window.removeEventListener("pointermove", onMove);
      evs.forEach((e) => window.removeEventListener(e, onGesture));
    };
  }, []);

  useEffect(() => {
    if (!mounted || builtRef.current || !trackRef.current) return;
    builtRef.current = true;
    useExperience.getState().setPhase("intro");

    const heroThreshold = T.heroEnter / T.total;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          signals.scroll = self.progress;
          const marvel = getVideoEl("marvel");
          const hero = getVideoEl("hero");
          const finale = getVideoEl("finale");
          if (marvel) {
            marvel.style.opacity = signals.marvelOp.toFixed(3);
          }
          if (hero) {
            hero.style.opacity = signals.heroOp.toFixed(3);
            if (signals.heroOp > 0.002) {
              const speed = Math.abs(self.getVelocity());
              if (speed > 30) {
                if (hero.paused) hero.play().catch(() => {});
              } else {
                if (!hero.paused) hero.pause();
              }
            }
          }
          if (finale) {
            finale.style.opacity = signals.finale.toFixed(3);
            finale.style.visibility = signals.finale > 0.002 ? "visible" : "hidden";
            if (signals.finale > 0.002) scrubEl(finale, signals.finaleT);
          }
          const next = self.progress >= heroThreshold ? "hero" : "intro";
          if (useExperience.getState().phase !== next) useExperience.getState().setPhase(next);
        },
      },
    });

    tl.to(signals, { energy: 1, duration: T.introEnd }, 0);
    tl.set(signals, { marvelOp: 1 }, 0);

    tl.to(signals, { energy: 0.6, duration: 0.5 }, T.introEnd);
    tl.to(signals, { portal: 1, duration: 1.0, ease: "power1.in" }, T.portalStart);
    tl.to(signals, { dolly: 1, duration: 1.1 }, T.portalStart);
    tl.to(signals, { marvelOp: 0, duration: 0.35 }, T.heroEnter - 0.15);
    tl.to(signals, { header: 1, duration: 0.7 }, T.heroEnter + 0.05);
    tl.to(signals, { portal: 0, duration: 0.9, ease: "power1.out" }, T.heroEnter + 0.2);
    tl.to(signals, { dolly: 0, duration: 1.0 }, T.heroEnter + 0.2);

    tl.to(signals, { energy: 0.12, duration: 0.8 }, T.heroEnter + 0.3);

    tl.to(signals, { heroOp: 1, duration: 0.3, ease: "power2.out" }, T.videoStart);
    tl.to(signals, { energy: 0.15, duration: 0.6 }, T.videoStart);
    tl.to(signals, { energy: 0.13, duration: 0.8 }, T.videoEnd);

    tl.to(signals, { heroOp: 0, duration: 1.0, ease: "power2.in" }, T.showcaseStart);
    tl.to(signals, { showcase: 1, duration: T.showcaseEnd - T.showcaseStart, ease: "none" }, T.showcaseStart);
    tl.to(signals, { energy: 0.22, duration: 1.2, ease: "power1.out" }, T.showcaseStart);

    tl.to(signals, { showcase: 0, duration: 0.9, ease: "power2.inOut" }, T.storyStart);
    tl.to(signals, { story: 1, duration: T.storyEnd - T.storyStart, ease: "none" }, T.storyStart);
    tl.to(signals, { energy: 0.18, duration: 1.0, ease: "power1.inOut" }, T.storyStart);

    tl.to(signals, { reel: 1, duration: T.reelEnd - T.reelStart, ease: "none" }, T.reelStart);
    tl.to(signals, { energy: 0.19, duration: 1.4, ease: "power1.out" }, T.reelStart);

    tl.to(signals, { finale: 1, duration: T.finaleFadeEnd - T.finaleStart, ease: "power2.out" }, T.finaleStart);
    tl.to(signals, { energy: 0.15, duration: 1.6, ease: "power1.inOut" }, T.finaleStart);
    tl.to(signals, { finaleT: VIDEO.finaleDur, duration: T.finaleScrubEnd - T.finaleScrubStart, ease: "none" }, T.finaleScrubStart);
    tl.to(signals, { finale: 0, duration: 0.9, ease: "power2.inOut" }, T.mcuStart - 0.2);

    tl.to(signals, { mcu: 1, duration: T.mcuEnd - T.mcuStart, ease: "none" }, T.mcuStart);
    tl.to(signals, { energy: 0.13, duration: 1.4, ease: "power1.inOut" }, T.mcuStart);

    tl.to(signals, { title: 1, duration: T.titleFadeEnd - T.titleStart, ease: "power2.out" }, T.titleStart);
    tl.to(signals, { energy: 0.17, duration: 1.2, ease: "power1.inOut" }, T.titleStart);

    tl.to(signals, { footer: 1, duration: T.total - T.footerStart, ease: "power2.out" }, T.footerStart);

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__doom = { signals, tl, store: useExperience };
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      builtRef.current = false;
    };
  }, [mounted]);

  const marvelVh = SCROLL.introAtmos + SCROLL.marvelScrub + SCROLL.transition;
  const heroVh = SCROLL.heroText + SCROLL.heroScrub + SCROLL.heroOutro;
  const showcaseVh = SCROLL.showcaseRise + SCROLL.showcaseOrbit + SCROLL.showcaseOut;
  const storyVh = SCROLL.storyStack;
  const reelVh = SCROLL.reelStrip;
  const finaleVh = SCROLL.finaleScrub;
  const mcuVh = SCROLL.mcuPan;
  const titleVh = SCROLL.titleHold;
  const footerVh = SCROLL.footerReveal;

  return (
    <>
      <div className="stage">
        <VideoLayer />
        <StoryStack />
        <HorizontalReel />
        <TimelineImage />
        <TitleReveal />
        <CharacterOrbit />
        {mounted && <CinematicCanvas />}
        <FlashOverlay />
        <CinematicText />
      </div>

      <SiteHeader />
      <HeroOverlay />
      <SiteFooter />
      <ScrollCue />

      <div className="scroll-track" ref={trackRef} aria-hidden>
        <section style={{ height: `${marvelVh}vh` }} aria-label="Marvel Intro" />
        <section style={{ height: `${heroVh}vh` }} aria-label="Hero" />
        <section style={{ height: `${showcaseVh}vh` }} aria-label="Characters" />
        <section style={{ height: `${storyVh}vh` }} aria-label="Story" />
        <section style={{ height: `${reelVh}vh` }} aria-label="Timeline" />
        <section style={{ height: `${finaleVh}vh` }} aria-label="Finale" />
        <section style={{ height: `${mcuVh}vh` }} aria-label="Saga" />
        <section style={{ height: `${titleVh}vh` }} aria-label="Title" />
        <section style={{ height: `${footerVh}vh` }} aria-label="Footer" />
      </div>
    </>
  );
}

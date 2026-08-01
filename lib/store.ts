"use client";

import { create } from "zustand";
import type { Phase } from "./constants";

interface ExperienceState {
  phase: Phase;
  ready: boolean;
  started: boolean;
  reduceMotion: boolean;

  setPhase: (p: Phase) => void;
  setReady: (v: boolean) => void;
  start: () => void;
  setReduceMotion: (v: boolean) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  phase: "loading",
  ready: false,
  started: false,
  reduceMotion: false,

  setPhase: (phase) => set({ phase }),
  setReady: (ready) => set({ ready }),
  start: () => set({ started: true }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
}));

export const experience = useExperience;

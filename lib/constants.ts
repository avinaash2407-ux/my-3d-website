export const COLORS = {
  black: "#000000",
  graphite: "#07090b",
  ink: "#04140f",
  green: "#00ff9c",
  greenDeep: "#00b473",
  greenDark: "#083b2a",
  emerald: "#12855b",
  mint: "#9dffd6",
  core: "#e6fff4",
  white: "#eafff6",
  silver: "#aebbb5",
} as const;

export const HEX = {
  green: 0x00ff9c,
  greenDeep: 0x00b473,
  greenDark: 0x083b2a,
  emerald: 0x12855b,
  mint: 0x9dffd6,
  core: 0xe6fff4,
} as const;

export const ASSETS = {
  marvelVideo: "/videos/marvel-intro-seq.mp4",
  marvelPoster: "/videos/marvel-intro-poster.jpg",
  heroVideo: "/videos/hero-seq-v2.mp4",
  heroPoster: "/videos/hero-poster-v2.jpg",
  finaleVideo: "/videos/finale-seq.mp4",
  finalePoster: "/videos/finale-poster.jpg",
  timelineImg: "/story/timeline.jpg",
  titleVideo: "/videos/title-reveal.mp4",
  titlePoster: "/videos/title-reveal-poster.jpg",
} as const;

export const VIDEO = {
  marvelDur: 37,
  heroDur: 10.67,
  finaleDur: 23.9,
} as const;

export const SCROLL = {
  introAtmos: 140,
  marvelScrub: 100,
  transition: 140,
  heroText: 260,
  heroScrub: 400,
  heroOutro: 80,
  showcaseRise: 160,
  showcaseOrbit: 360,
  showcaseOut: 70,
  storyStack: 660,
  reelStrip: 680,
  finaleScrub: 760,
  mcuPan: 560,
  titleHold: 300,
  footerReveal: 150,
} as const;

export const SCROLL_VH_TOTAL = Object.values(SCROLL).reduce((a, b) => a + b, 0);
export const TIMELINE_UNITS = SCROLL_VH_TOTAL / 100;

export type Phase = "loading" | "intro" | "hero";

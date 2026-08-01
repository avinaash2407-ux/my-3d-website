export interface Signals {
  time: number;
  mx: number;
  my: number;
  mtx: number;
  mty: number;
  mwx: number;
  mwy: number;
  shake: number;
  flash: number;
  energy: number;
  portal: number;
  dolly: number;
  reveal: number;
  bgBlur: number;
  collapse: number;
  scroll: number;
  shatter: number;
  marvelT: number;
  heroT: number;
  marvelOp: number;
  heroOp: number;
  header: number;
  showcase: number;
  story: number;
  reel: number;
  finale: number;
  finaleT: number;
  mcu: number;
  title: number;
  footer: number;
  strikeSeq: number;
  lastStrike: number;
}

export const signals: Signals = {
  time: 0,
  mx: 0,
  my: 0,
  mtx: 0,
  mty: 0,
  mwx: 0,
  mwy: 0,
  shake: 0,
  flash: 0,
  energy: 0,
  portal: 0,
  dolly: 0,
  reveal: 0,
  bgBlur: 0,
  collapse: 0,
  scroll: 0,
  shatter: 0,
  marvelT: 0,
  heroT: 0,
  marvelOp: 0,
  heroOp: 0,
  header: 0,
  showcase: 0,
  story: 0,
  reel: 0,
  finale: 0,
  finaleT: 0,
  mcu: 0,
  title: 0,
  footer: 0,
  strikeSeq: 0,
  lastStrike: -999,
};

export type StrikeDetail = {
  x: number;
  y: number;
  power: number;
  mega?: boolean;
};

export const bus =
  typeof EventTarget !== "undefined" ? new EventTarget() : null;

export function emitStrike(detail: StrikeDetail) {
  signals.strikeSeq += 1;
  signals.lastStrike = signals.time;
  signals.shake = Math.min(1.4, signals.shake + detail.power * (detail.mega ? 1.4 : 0.7));
  signals.flash = Math.min(0.95, signals.flash + detail.power * (detail.mega ? 0.9 : 0.32));
  bus?.dispatchEvent(new CustomEvent<StrikeDetail>("strike", { detail }));
}

export function onStrike(fn: (d: StrikeDetail) => void) {
  if (!bus) return () => {};
  const handler = (e: Event) => fn((e as CustomEvent<StrikeDetail>).detail);
  bus.addEventListener("strike", handler);
  return () => bus.removeEventListener("strike", handler);
}

export function emitCue(name: string, detail?: unknown) {
  bus?.dispatchEvent(new CustomEvent(name, { detail }));
}
export function onCue(name: string, fn: (detail: unknown) => void) {
  if (!bus) return () => {};
  const handler = (e: Event) => fn((e as CustomEvent).detail);
  bus.addEventListener(name, handler);
  return () => bus.removeEventListener(name, handler);
}

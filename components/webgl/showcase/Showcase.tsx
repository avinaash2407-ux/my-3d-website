"use client";

import DoomModel from "./DoomModel";

export default function Showcase() {
  return (
    <>
      <ambientLight color="#12271d" intensity={1.6} />
      <directionalLight color="#d6ecff" intensity={2.6} position={[3.5, 5, 4]} />
      <pointLight color="#00ff9c" intensity={55} distance={26} decay={2} position={[-4.2, 3, -3.2]} />
      <pointLight color="#39ffb4" intensity={22} distance={20} decay={2} position={[4, 1.2, 3]} />
      <pointLight color="#00b473" intensity={10} distance={10} decay={2} position={[0, -1.6, 1.5]} />
      <DoomModel />
    </>
  );
}

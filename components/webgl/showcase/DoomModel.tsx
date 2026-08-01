"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { signals } from "@/lib/signals";

export default function DoomModel() {
  const capeRef = useRef<THREE.Mesh>(null);
  const capeBase = useRef<Float32Array | null>(null);
  const eyesRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const emblemRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const baseRef = useRef<THREE.Mesh | null>(null);

  const group = useMemo(() => {
    const g = new THREE.Group();

    const metal = new THREE.MeshStandardMaterial({
      color: 0x1d2723,
      metalness: 0.62,
      roughness: 0.44,
    });
    const darkMetal = new THREE.MeshStandardMaterial({
      color: 0x0f1613,
      metalness: 0.5,
      roughness: 0.6,
    });
    const cloth = new THREE.MeshStandardMaterial({
      color: 0x0c1512,
      metalness: 0.15,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    const greenEmis = new THREE.MeshStandardMaterial({
      color: 0x06251a,
      emissive: new THREE.Color(0x00ff9c),
      emissiveIntensity: 2.2,
      metalness: 0.3,
      roughness: 0.5,
    });
    eyesRef.current = greenEmis;

    const profile: THREE.Vector2[] = [
      [0.0, 0.0],
      [0.96, 0.03],
      [0.9, 0.35],
      [0.74, 1.0],
      [0.6, 1.55],
      [0.54, 1.95],
      [0.44, 2.28],
      [0.26, 2.55],
      [0.18, 2.64],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const robe = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), metal);
    robe.castShadow = true;
    g.add(robe);

    const inner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.85, 2.2, 24, 1, true),
      darkMetal,
    );
    inner.position.y = 1.1;
    g.add(inner);

    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.34, 0.85, 24, 1, true, Math.PI * 0.95, Math.PI * 1.1),
      darkMetal,
    );
    collar.position.set(0, 2.72, -0.08);
    collar.rotation.x = -0.18;
    g.add(collar);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, 28, 28), metal);
    head.scale.set(0.92, 1.05, 0.92);
    head.position.set(0, 2.78, 0);
    g.add(head);

    const faceplate = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.42, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x2a352f, metalness: 0.68, roughness: 0.35 }),
    );
    faceplate.position.set(0, 2.78, 0.22);
    g.add(faceplate);

    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.02), greenEmis);
      eye.position.set(sx * 0.08, 2.83, 0.29);
      g.add(eye);
    }

    for (const sx of [-1, 1]) {
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), metal);
      pauldron.scale.set(1.15, 0.7, 1.05);
      pauldron.position.set(sx * 0.56, 2.18, 0.02);
      g.add(pauldron);
      const trim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.028, 8, 24), greenEmis.clone());
      trim.scale.set(1.15, 1.05, 0.7);
      trim.rotation.x = Math.PI / 2;
      trim.position.set(sx * 0.56, 2.14, 0.02);
      g.add(trim);
    }

    const emblemMat = greenEmis.clone();
    emblemRef.current = emblemMat;
    const emblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), emblemMat);
    emblem.position.set(0, 1.9, 0.5);
    emblem.scale.set(0.8, 1.3, 0.5);
    g.add(emblem);

    const capeGeo = new THREE.PlaneGeometry(1.5, 2.5, 14, 20);
    const pos = capeGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const ny = (y + 1.25) / 2.5;
      pos.setZ(i, -0.35 - (1 - ny) * 0.55 - x * x * 0.25);
      pos.setX(i, x * (1 + (1 - ny) * 0.35));
    }
    capeGeo.computeVertexNormals();
    capeBase.current = (pos.array as Float32Array).slice();
    const cape = new THREE.Mesh(capeGeo, cloth);
    cape.position.set(0, 1.55, -0.2);
    capeRef.current = cape;
    g.add(cape);

    const baseMat = new THREE.MeshBasicMaterial({
      color: 0x00ff9c,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const base = new THREE.Mesh(new THREE.CircleGeometry(1.15, 48), baseMat);
    base.rotation.x = -Math.PI / 2;
    base.position.y = 0.02;
    baseRef.current = base;
    g.add(base);

    g.visible = false;
    return g;
  }, []);

  useEffect(() => {
    const g = group;
    return () => {
      g.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
    };
  }, [group]);

  useFrame((_, dt) => {
    const s = signals.showcase;
    group.visible = s > 0.001;
    if (!group.visible) return;
    const t = signals.time;

    const rise = THREE.MathUtils.smoothstep(s, 0, 0.24);
    const targetY = THREE.MathUtils.lerp(-6.2, -1.42, rise);
    group.position.y += (targetY - group.position.y) * Math.min(1, dt * 6);
    const sc = 0.85 + rise * 0.15;
    group.scale.setScalar(sc);

    const breathe = 1 + Math.sin(t * 1.1) * 0.012;
    group.scale.y = sc * breathe;
    const lookX = signals.mx * 0.28;
    const scrollTurn = s * 0.8;
    group.rotation.y += (lookX + scrollTurn + Math.sin(t * 0.25) * 0.08 - group.rotation.y) * Math.min(1, dt * 2.5);
    group.rotation.x = -signals.my * 0.06 + Math.sin(t * 0.4) * 0.015;

    const pulse = 1.8 + Math.sin(t * 2.2) * 0.7;
    if (eyesRef.current) eyesRef.current.emissiveIntensity = pulse + 0.6;
    if (emblemRef.current) emblemRef.current.emissiveIntensity = pulse;
    if (baseRef.current) {
      const bm = baseRef.current.material as THREE.MeshBasicMaterial;
      bm.opacity = 0.35 + Math.sin(t * 1.6) * 0.12 + rise * 0.15;
      baseRef.current.scale.setScalar(1 + Math.sin(t * 0.9) * 0.04);
    }

    const cape = capeRef.current;
    const base = capeBase.current;
    if (cape && base) {
      const p = cape.geometry.attributes.position as THREE.BufferAttribute;
      const arr = p.array as Float32Array;
      for (let i = 0; i < p.count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const bz = base[i * 3 + 2];
        const ny = (by + 1.25) / 2.5;
        const wave = Math.sin(t * 1.6 + by * 2.2 + bx * 1.5) * (1 - ny) * 0.14;
        arr[i * 3] = bx + wave * 0.3;
        arr[i * 3 + 2] = bz + wave;
      }
      p.needsUpdate = true;
    }
  });

  return <primitive object={group} />;
}

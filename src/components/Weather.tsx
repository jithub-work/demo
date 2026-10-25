"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DROP_COUNT = 4000;
const AREA = 80;
const TOP = 40;
const FALL_SPEED = 35;

function Rain() {
  const ref = useRef<THREE.LineSegments>(null);

  const { geometry, offsets } = useMemo(() => {
    const positions = new Float32Array(DROP_COUNT * 6);
    const offsets = new Float32Array(DROP_COUNT * 3);
    for (let i = 0; i < DROP_COUNT; i++) {
      const x = (Math.random() - 0.5) * AREA;
      const y = Math.random() * TOP;
      const z = (Math.random() - 0.5) * AREA;
      offsets.set([x, y, z], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry, offsets };
  }, []);

  useFrame((_, delta) => {
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < DROP_COUNT; i++) {
      let y = offsets[i * 3 + 1] - FALL_SPEED * dt;
      if (y < 0) y += TOP;
      offsets[i * 3 + 1] = y;
      const x = offsets[i * 3];
      const z = offsets[i * 3 + 2];
      pos.setXYZ(i * 2, x, y, z);
      pos.setXYZ(i * 2 + 1, x, y + 0.7, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <lineSegments ref={ref} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial color="#b8d4ff" transparent opacity={0.55} />
    </lineSegments>
  );
}

function playThunder() {
  try {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const length = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.5);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    const gain = ctx.createGain();
    gain.gain.value = 1.5;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.onended = () => ctx.close();
    source.start();
  } catch {
    // Audio may be blocked until the user interacts with the page.
  }
}

function Lightning() {
  const light = useRef<THREE.PointLight>(null);
  const flash = useRef({ next: 3, start: -1 });

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const f = flash.current;
    if (!light.current) return;

    if (f.start < 0 && t >= f.next) {
      f.start = t;
      light.current.position.set((Math.random() - 0.5) * 60, 30, (Math.random() - 0.5) * 60 - 10);
      // Thunder arrives a moment after the flash.
      setTimeout(playThunder, 400 + Math.random() * 1200);
    }

    if (f.start >= 0) {
      const e = t - f.start;
      // Double-strike flicker, then fade out.
      const pulse = e < 0.1 ? 1 : e < 0.18 ? 0.2 : e < 0.3 ? 0.9 : 0;
      light.current.intensity = pulse * 4000;
      if (e > 0.3) {
        light.current.intensity = 0;
        f.start = -1;
        f.next = t + 4 + Math.random() * 8;
      }
    }
  });

  return <pointLight ref={light} color="#dfe8ff" intensity={0} distance={0} decay={2} />;
}

export default function Weather() {
  return (
    <>
      <Rain />
      <Lightning />
    </>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const WHEEL_RADIUS = 0.32;

export default function Car() {
  const car = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const elapsed = useRef(0);
  const jump = useRef({ height: 0, velocity: 0 });
  const { path, length, position, tangent } = useMemo(() => {
    const route = new THREE.CurvePath<THREE.Vector3>();
    route.add(new THREE.LineCurve3(new THREE.Vector3(-10, 0.08, 10.5), new THREE.Vector3(1.8, 0.08, 10.5)));
    route.add(new THREE.CubicBezierCurve3(
      new THREE.Vector3(1.8, 0.08, 10.5),
      new THREE.Vector3(4.8, 0.08, 10.5),
      new THREE.Vector3(4.8, 0.08, 8.5),
      new THREE.Vector3(4.8, 0.08, 6.5),
    ));
    route.add(new THREE.LineCurve3(new THREE.Vector3(4.8, 0.08, 6.5), new THREE.Vector3(4.8, 0.08, 1.5)));
    return { path: route, length: route.getLength(), position: new THREE.Vector3(), tangent: new THREE.Vector3() };
  }, []);

  useFrame((_, delta) => {
    if (!car.current) return;
    elapsed.current += delta;
    const progress = THREE.MathUtils.clamp((elapsed.current - 1) / 10, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    path.getPointAt(eased, position);
    path.getTangentAt(eased, tangent);
    car.current.position.copy(position);
    const jumpState = jump.current;
    jumpState.velocity -= delta * 9.8;
    jumpState.height = Math.max(0, jumpState.height + jumpState.velocity * delta);
    if (jumpState.height === 0) jumpState.velocity = 0;
    car.current.position.y += jumpState.height;
    car.current.rotation.y = Math.atan2(tangent.x, tangent.z);
    wheels.current.forEach((wheel) => { wheel.rotation.x = eased * length / WHEEL_RADIUS; });
  });

  return (
    <group
      ref={car}
      position={[-10, 0.08, 10.5]}
      rotation={[0, Math.PI / 2, 0]}
      onClick={(event) => {
        event.stopPropagation();
        if (jump.current.height === 0) jump.current.velocity = 5.5;
      }}
    >
      <RoundedBox args={[1.65, 0.58, 3.6]} radius={0.16} position={[0, 0.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1769c2" metalness={0.45} roughness={0.28} />
      </RoundedBox>
      <RoundedBox args={[1.36, 0.69, 1.85]} radius={0.16} position={[0, 1.22, -0.15]} castShadow>
        <meshStandardMaterial color="#233d50" metalness={0.4} roughness={0.18} />
      </RoundedBox>
      <RoundedBox args={[1.39, 0.12, 1.68]} radius={0.05} position={[0, 1.58, -0.15]} castShadow>
        <meshStandardMaterial color="#1769c2" metalness={0.45} roughness={0.28} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.694, 1.25, -0.15]} castShadow>
            <boxGeometry args={[0.035, 0.6, 0.075]} />
            <meshStandardMaterial color="#1769c2" />
          </mesh>
          <RoundedBox args={[0.22, 0.15, 0.32]} radius={0.05} position={[side * 0.81, 1.1, 0.6]} castShadow>
            <meshStandardMaterial color="#1769c2" />
          </RoundedBox>
          <mesh position={[side * 0.52, 0.76, 1.79]}>
            <boxGeometry args={[0.42, 0.19, 0.045]} />
            <meshStandardMaterial color="#fff4cc" emissive="#fff0ac" emissiveIntensity={0.7} />
          </mesh>
          <mesh position={[side * 0.56, 0.76, -1.79]}>
            <boxGeometry args={[0.3, 0.17, 0.045]} />
            <meshStandardMaterial color="#8e151c" emissive="#e32b25" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.48, 1.8]}>
        <boxGeometry args={[1.26, 0.12, 0.06]} />
        <meshStandardMaterial color="#222831" />
      </mesh>
      {[-0.86, 0.86].flatMap((x, side) => [-1.12, 1.12].map((z, axle) => (
        <group key={`${x}-${z}`} position={[x, WHEEL_RADIUS, z]}>
          <group ref={(node) => { if (node) wheels.current[side * 2 + axle] = node; }}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.23, 24]} />
              <meshStandardMaterial color="#202329" roughness={0.9} />
            </mesh>
            <mesh position={[Math.sign(x) * 0.125, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, 0.025, 16]} />
              <meshStandardMaterial color="#b7c1cb" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[Math.sign(x) * 0.145, 0, 0]}>
              <boxGeometry args={[0.025, 0.31, 0.055]} />
              <meshStandardMaterial color="#495361" metalness={0.6} />
            </mesh>
          </group>
        </group>
      )))}
    </group>
  );
}

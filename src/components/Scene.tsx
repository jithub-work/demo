"use client";

import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const skyVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition).y;
    gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
  }
`;

function Sky() {
  return (
    <mesh>
      <sphereGeometry args={[500, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        uniforms={{
          topColor: { value: new THREE.Color("#1e5fbf") },
          bottomColor: { value: new THREE.Color("#cfe6ff") },
        }}
      />
    </mesh>
  );
}

function Floor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#8a8d91" />
      </mesh>
      <Grid
        infiniteGrid
        cellSize={1}
        cellThickness={0.6}
        cellColor="#6b6e72"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#4a4d51"
        fadeDistance={80}
        fadeStrength={1.5}
      />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [8, 6, 10], fov: 50 }}>
      <Sky />
      <fog attach="fog" args={["#cfe6ff", 40, 120]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />
      <Floor />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />
    </Canvas>
  );
}

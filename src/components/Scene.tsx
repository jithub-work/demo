"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Car from "./Car";
import Driveway from "./Driveway";
import Tree from "./Tree";
import Weather from "./Weather";

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
          topColor: { value: new THREE.Color("#2b3140") },
          bottomColor: { value: new THREE.Color("#5a6270") },
        }}
      />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#d4c43a" roughness={1} />
    </mesh>
  );
}

const HOUSE_WIDTH = 6;
const HOUSE_DEPTH = 5;
const STORY_HEIGHT = 3;
const STORIES = 2;
const WALL_HEIGHT = STORY_HEIGHT * STORIES;
const ROOF_HEIGHT = 2;
const OVERHANG = 0.4;

function HouseWindow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 1.1, 0.12]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.9, 0.9, 0.08]} />
        <meshStandardMaterial color="#9fd3f0" roughness={0.1} metalness={0.3} />
      </mesh>
    </group>
  );
}

function HouseRoof() {
  // Triangular prism along Z: gable ends face front and back.
  const shape = new THREE.Shape();
  const halfW = HOUSE_WIDTH / 2 + OVERHANG;
  shape.moveTo(-halfW, 0);
  shape.lineTo(halfW, 0);
  shape.lineTo(0, ROOF_HEIGHT);
  shape.closePath();

  return (
    <mesh position={[0, WALL_HEIGHT, -(HOUSE_DEPTH + OVERHANG * 2) / 2]} castShadow>
      <extrudeGeometry
        args={[shape, { depth: HOUSE_DEPTH + OVERHANG * 2, bevelEnabled: false }]}
      />
      <meshStandardMaterial color="#8b2e2e" />
    </mesh>
  );
}

function House() {
  const frontZ = HOUSE_DEPTH / 2 + 0.03;
  return (
    <group>
      {/* Walls */}
      <mesh position={[0, WALL_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[HOUSE_WIDTH, WALL_HEIGHT, HOUSE_DEPTH]} />
        <meshStandardMaterial color="#e8d9b5" />
      </mesh>

      <HouseRoof />

      {/* Door */}
      <mesh position={[0, 1.05, frontZ]} castShadow>
        <boxGeometry args={[1.1, 2.1, 0.1]} />
        <meshStandardMaterial color="#5b3a1e" />
      </mesh>
      <mesh position={[0.4, 1.05, HOUSE_DEPTH / 2 + 0.1]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Windows */}
      {Array.from({ length: STORIES }, (_, i) => {
        const y = 1.7 + i * STORY_HEIGHT;
        return (
          <group key={i}>
            <HouseWindow position={[-1.9, y, frontZ]} />
            <HouseWindow position={[1.9, y, frontZ]} />
            <group rotation={[0, Math.PI / 2, 0]}>
              <HouseWindow position={[0, y, HOUSE_WIDTH / 2 + 0.03]} />
            </group>
            <group rotation={[0, -Math.PI / 2, 0]}>
              <HouseWindow position={[0, y, HOUSE_WIDTH / 2 + 0.03]} />
            </group>
          </group>
        );
      })}

      {/* Upper-story window above the door */}
      <HouseWindow position={[0, 1.7 + STORY_HEIGHT, frontZ]} />

      {/* Trim band between stories */}
      <mesh position={[0, STORY_HEIGHT, 0]} castShadow>
        <boxGeometry args={[HOUSE_WIDTH + 0.12, 0.15, HOUSE_DEPTH + 0.12]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Chimney */}
      <mesh position={[1.8, WALL_HEIGHT + 1.6, -1]} castShadow>
        <boxGeometry args={[0.7, 1.6, 0.7]} />
        <meshStandardMaterial color="#7a4a3a" />
      </mesh>

      {/* Doorstep */}
      <mesh position={[0, 0.06, HOUSE_DEPTH / 2 + 0.4]} receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.8]} />
        <meshStandardMaterial color="#9a9a9a" />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [14, 11, 20], fov: 50 }}>
      <Sky />
      <fog attach="fog" args={["#5a6270", 25, 90]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 5]} intensity={0.5} castShadow />
      <Weather />
      <Floor />
      <House />
      <Tree position={[-7, 0, 3]} />
      <group position={[-12, 0, -8]} scale={0.78}>
        <House />
      </group>
      <group position={[12, 0, -7]} scale={0.9} rotation={[0, -0.35, 0]}>
        <House />
      </group>
      <group position={[-12, 0, 2]} scale={0.68} rotation={[0, 0.45, 0]}>
        <House />
      </group>
      <group position={[13, 0, 2]} scale={0.82} rotation={[0, -0.5, 0]}>
        <House />
      </group>
      <Driveway />
      <Car />
      <OrbitControls makeDefault target={[0, 0, 3]} maxPolarAngle={Math.PI / 2 - 0.05} />
    </Canvas>
  );
}

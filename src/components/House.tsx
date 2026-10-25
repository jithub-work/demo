import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

const WIDTH = 6;
const DEPTH = 5;
const WALL_HEIGHT = 3;
const ROOF_HEIGHT = 2;
const OVERHANG = 0.4;

function Window({ position }: { position: [number, number, number] }) {
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

function Roof() {
  // Triangular prism along the Z axis: gable ends face front and back.
  const shape = new THREE.Shape();
  const halfW = WIDTH / 2 + OVERHANG;
  shape.moveTo(-halfW, 0);
  shape.lineTo(halfW, 0);
  shape.lineTo(0, ROOF_HEIGHT);
  shape.closePath();

  return (
    <mesh
      position={[0, WALL_HEIGHT, -(DEPTH + OVERHANG * 2) / 2]}
      castShadow
    >
      <extrudeGeometry args={[shape, { depth: DEPTH + OVERHANG * 2, bevelEnabled: false }]} />
      <meshStandardMaterial color="#8b2e2e" />
    </mesh>
  );
}

export default function House(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      {/* Walls */}
      <mesh position={[0, WALL_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, WALL_HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#e8d9b5" />
      </mesh>

      <Roof />

      {/* Door */}
      <mesh position={[0, 1.05, DEPTH / 2 + 0.03]} castShadow>
        <boxGeometry args={[1.1, 2.1, 0.1]} />
        <meshStandardMaterial color="#5b3a1e" />
      </mesh>
      <mesh position={[0.4, 1.05, DEPTH / 2 + 0.1]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Front windows */}
      <Window position={[-1.9, 1.7, DEPTH / 2 + 0.03]} />
      <Window position={[1.9, 1.7, DEPTH / 2 + 0.03]} />

      {/* Side windows */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Window position={[0, 1.7, WIDTH / 2 + 0.03]} />
      </group>
      <group rotation={[0, -Math.PI / 2, 0]}>
        <Window position={[0, 1.7, WIDTH / 2 + 0.03]} />
      </group>

      {/* Chimney */}
      <mesh position={[1.8, WALL_HEIGHT + 1.6, -1]} castShadow>
        <boxGeometry args={[0.7, 1.6, 0.7]} />
        <meshStandardMaterial color="#7a4a3a" />
      </mesh>

      {/* Doorstep */}
      <mesh position={[0, 0.06, DEPTH / 2 + 0.4]} receiveShadow>
        <boxGeometry args={[1.8, 0.12, 0.8]} />
        <meshStandardMaterial color="#9a9a9a" />
      </mesh>
    </group>
  );
}

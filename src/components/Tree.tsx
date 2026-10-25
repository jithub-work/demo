"use client";

type TreeProps = {
  position?: [number, number, number];
  scale?: number;
};

export default function Tree({ position = [0, 0, 0], scale = 1 }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 2, 10]} />
        <meshStandardMaterial color="#5b3a1e" roughness={1} />
      </mesh>

      {/* Foliage */}
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[1.6, 2.6, 12]} />
        <meshStandardMaterial color="#1f6b2e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.4, 0]} castShadow>
        <coneGeometry args={[1.2, 2.2, 12]} />
        <meshStandardMaterial color="#257a35" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5.6, 0]} castShadow>
        <coneGeometry args={[0.8, 1.8, 12]} />
        <meshStandardMaterial color="#2c8a3d" roughness={0.9} />
      </mesh>
    </group>
  );
}

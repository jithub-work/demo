export default function Driveway() {
  return (
    <group>
      <mesh position={[0, 0.025, 10.5]} receiveShadow>
        <boxGeometry args={[32, 0.05, 4]} />
        <meshStandardMaterial color="#343c46" roughness={0.95} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-14 + i * 3, 0.055, 10.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.09]} />
          <meshStandardMaterial color="#eee6c8" />
        </mesh>
      ))}
      <mesh position={[4.8, 0.035, 3.9]} receiveShadow>
        <boxGeometry args={[3.4, 0.07, 9.2]} />
        <meshStandardMaterial color="#b1b4b7" roughness={0.9} />
      </mesh>
      {[3.04, 6.56].map((x) => (
        <mesh key={x} position={[x, 0.11, 3.9]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.22, 9.2]} />
          <meshStandardMaterial color="#ddd6c9" />
        </mesh>
      ))}
      {[1, 3.5, 6].map((z) => (
        <mesh key={z} position={[4.8, 0.073, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.4, 0.025]} />
          <meshStandardMaterial color="#92979c" />
        </mesh>
      ))}
    </group>
  );
}

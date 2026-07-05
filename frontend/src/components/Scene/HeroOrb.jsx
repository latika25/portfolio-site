import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function HeroOrb() {
  const coreRef = useRef();
  const wireRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wireRef.current) wireRef.current.rotation.y = t * 0.15;
    if (wireRef.current) wireRef.current.rotation.x = t * 0.08;
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.06;
      coreRef.current.scale.setScalar(pulse);
    }
    if (ring1.current) ring1.current.rotation.z = t * 0.2;
    if (ring2.current) ring2.current.rotation.z = -t * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#5eead4"
            emissive="#5eead4"
            emissiveIntensity={1.1}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        <mesh ref={wireRef}>
          <icosahedronGeometry args={[2.1, 1]} />
          <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.35} />
        </mesh>

        <mesh ref={ring1} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.9, 0.012, 8, 96]} />
          <meshBasicMaterial color="#f0b429" transparent opacity={0.5} />
        </mesh>
        <mesh ref={ring2} rotation={[Math.PI / 3.2, Math.PI / 5, 0]}>
          <torusGeometry args={[3.4, 0.01, 8, 96]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

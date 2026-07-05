import { Canvas } from '@react-three/fiber';
import HeroOrb from './HeroOrb';

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#8b5cf6" />
      <HeroOrb />
    </Canvas>
  );
}

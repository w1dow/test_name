import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingPetals() {
  const petalsRef = useRef<THREE.Points>(null);
  const count = 200;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 20 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = -Math.random() * 0.02 - 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame(({ clock }) => {
    if (!petalsRef.current) return;
    const posArr = petalsRef.current.geometry.attributes.position
      .array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      posArr[i * 3] +=
        velocities[i * 3] + Math.sin(t * 0.5 + i) * 0.002;
      posArr[i * 3 + 1] += velocities[i * 3 + 1];
      posArr[i * 3 + 2] +=
        velocities[i * 3 + 2] + Math.cos(t * 0.3 + i) * 0.001;

      if (posArr[i * 3 + 1] < -8) {
        posArr[i * 3] = (Math.random() - 0.5) * 40;
        posArr[i * 3 + 1] = 15;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
      }
    }

    petalsRef.current.geometry.attributes.position.needsUpdate = true;
    petalsRef.current.rotation.y = Math.sin(t * 0.05) * 0.1;
  });

  return (
    <points ref={petalsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFB7C5"
        size={0.15}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function WarmLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[5, 8, 5]}
      intensity={1}
      color="#FFE8D6"
      distance={30}
    />
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FFF5EE" />
      <WarmLight />
      <directionalLight
        position={[-5, 10, 5]}
        intensity={0.5}
        color="#FFE4C4"
      />
      <FloatingPetals />
      <fog attach="fog" args={["#FDFBF7", 15, 40]} />
    </>
  );
}

export default function FloralScene() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/warm_scenery.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.85,
        }}
      />
      {/* Overlay for warmth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, rgba(253,251,247,0.3) 0%, rgba(255,232,214,0.2) 100%)",
        }}
      />
      {/* 3D Canvas for floating petals */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

function CatModel() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const catState = useAppStore((s) => s.catState);
  const theme = useAppStore((s) => s.theme);

  // Cat colors based on theme
  const colors = useMemo(() => {
    if (theme === "sci-fi") {
      return {
        body: "#8B7355",
        belly: "#C4A882",
        ear: "#7A6548",
        nose: "#FFB6C1",
        eye: "#00F0FF",
        collar: "#00F0FF",
        tag: "#FFD700",
      };
    }
    return {
      body: "#9B8365",
      belly: "#D4B892",
      ear: "#8A7558",
      nose: "#FFB6C1",
      eye: "#6B8E23",
      collar: "#FFB7C5",
      tag: "#FFD700",
    };
  }, [theme]);

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current || !headRef.current || !tailRef.current || !bodyRef.current) return;

    const t = clock.getElapsedTime();

    // Breathing animation (always)
    const breathScale = 1 + Math.sin(t * 2) * 0.005;
    bodyRef.current.scale.set(1, breathScale, 1);

    if (catState === "sleep") {
      // Sleep: gentle slow breathing, head down
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        0.3,
        0.05
      );
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        0,
        0.05
      );
      tailRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
      groupRef.current.position.y = Math.sin(t * 1) * 0.005;
    } else if (catState === "play") {
      // Play: energetic head movement, wagging tail
      const targetHeadY = THREE.MathUtils.lerp(
        -0.4,
        0.4,
        (Math.sin(t * 3) + 1) / 2
      );
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetHeadY,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -0.1,
        0.1
      );
      tailRef.current.rotation.z = Math.sin(t * 6) * 0.4;
      groupRef.current.position.y = Math.sin(t * 4) * 0.02;
    } else if (catState === "alert") {
      // Alert: focused, still
      const targetHeadY = THREE.MathUtils.lerp(0.3, -0.3, (mouse.x + 1) / 2);
      const targetHeadX = THREE.MathUtils.lerp(0.2, -0.1, (mouse.y + 1) / 2);
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetHeadY,
        0.08
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetHeadX,
        0.08
      );
      tailRef.current.rotation.z = Math.sin(t * 1.5) * 0.08;
      groupRef.current.position.y = 0;
    } else {
      // Idle: head tracks mouse gently, occasional ear twitch
      const targetHeadY = THREE.MathUtils.lerp(0.4, -0.4, (mouse.x + 1) / 2);
      const targetHeadX = THREE.MathUtils.lerp(0.2, -0.15, (mouse.y + 1) / 2);
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetHeadY,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetHeadX,
        0.1
      );
      // Occasional tail flick
      if (Math.random() > 0.98) {
        tailRef.current.rotation.z = Math.sin(t * 10) * 0.2;
      } else {
        tailRef.current.rotation.z = THREE.MathUtils.lerp(
          tailRef.current.rotation.z,
          Math.sin(t * 1.5) * 0.1,
          0.05
        );
      }
      groupRef.current.position.y = 0;
    }
  });

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]} position={[0, -0.5, 0]}>
      {/* Body - rounded sitting shape */}
      <mesh ref={bodyRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhongMaterial color={colors.body} shininess={30} />
      </mesh>

      {/* Belly */}
      <mesh position={[0, 0.15, 0.35]} scale={[0.65, 0.5, 0.45]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial color={colors.belly} shininess={20} />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 1.0, 0.2]}>
        {/* Main head */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshPhongMaterial color={colors.body} shininess={30} />
        </mesh>

        {/* Left ear */}
        <mesh position={[-0.3, 0.4, -0.1]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.2, 0.35, 4]} />
          <meshPhongMaterial color={colors.ear} shininess={20} />
        </mesh>

        {/* Right ear */}
        <mesh position={[0.3, 0.4, -0.1]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.2, 0.35, 4]} />
          <meshPhongMaterial color={colors.ear} shininess={20} />
        </mesh>

        {/* Inner left ear */}
        <mesh position={[-0.3, 0.35, 0.02]} rotation={[0, 0, -0.3]} scale={[0.6, 0.6, 0.6]}>
          <coneGeometry args={[0.2, 0.35, 4]} />
          <meshPhongMaterial color={colors.nose} shininess={10} />
        </mesh>

        {/* Inner right ear */}
        <mesh position={[0.3, 0.35, 0.02]} rotation={[0, 0, 0.3]} scale={[0.6, 0.6, 0.6]}>
          <coneGeometry args={[0.2, 0.35, 4]} />
          <meshPhongMaterial color={colors.nose} shininess={10} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.18, 0.05, 0.38]} scale={[0.12, 0.15, 0.08]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhongMaterial color={colors.eye} emissive={colors.eye} emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.18, 0.05, 0.38]} scale={[0.12, 0.15, 0.08]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhongMaterial color={colors.eye} emissive={colors.eye} emissiveIntensity={0.3} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.08, 0.45]} scale={[0.08, 0.06, 0.06]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhongMaterial color={colors.nose} />
        </mesh>

        {/* Whiskers - left */}
        {[-0.05, 0, 0.05].map((yOff, i) => (
          <mesh key={`wl${i}`} position={[-0.35, yOff - 0.05, 0.35]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.3, 0.005, 0.005]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
        ))}

        {/* Whiskers - right */}
        {[-0.05, 0, 0.05].map((yOff, i) => (
          <mesh key={`wr${i}`} position={[0.35, yOff - 0.05, 0.35]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.3, 0.005, 0.005]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
        ))}
      </group>

      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0.2, -0.6]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.04, 0.8, 16]} />
        <meshPhongMaterial color={colors.body} shininess={20} />
      </mesh>

      {/* Front paws */}
      <mesh position={[-0.25, -0.1, 0.35]} scale={[0.15, 0.2, 0.15]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhongMaterial color={colors.belly} />
      </mesh>
      <mesh position={[0.25, -0.1, 0.35]} scale={[0.15, 0.2, 0.15]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhongMaterial color={colors.belly} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.65, 0.15]} rotation={[0.2, 0, 0]} scale={[0.52, 0.08, 0.52]}>
        <torusGeometry args={[1, 0.15, 8, 32]} />
        <meshPhongMaterial color={colors.collar} emissive={colors.collar} emissiveIntensity={0.2} />
      </mesh>

      {/* Bell */}
      <mesh position={[0, 0.52, 0.55]} scale={[0.08, 0.08, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhongMaterial color={colors.tag} emissive={colors.tag} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function CatScene() {
  const theme = useAppStore((s) => s.theme);

  const lightColor = theme === "sci-fi" ? "#00F0FF" : "#FFE8D6";
  const lightIntensity = theme === "sci-fi" ? 0.4 : 0.6;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} />
      <pointLight
        position={[0, 2, 2]}
        intensity={lightIntensity}
        color={lightColor}
        distance={10}
      />
      <CatModel />
    </>
  );
}

interface InteractiveCatProps {
  className?: string;
}

export default function InteractiveCat({ className }: InteractiveCatProps) {
  return (
    <div className={className} style={{ width: 200, height: 200 }}>
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CatScene />
      </Canvas>
    </div>
  );
}

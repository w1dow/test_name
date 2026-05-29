import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const earthTexture = useTexture("/earth_texture.jpg");

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.0005;
    }
  });

  const glowShader = useMemo(
    () => ({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor, intensity * 0.6);
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color("#4B9CD3") },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    }),
    []
  );

  return (
    <group position={[0, -650, -1500]}>
      <mesh ref={earthRef} scale={[500, 500, 500]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          shininess={10}
          specular={new THREE.Color("#111111")}
        />
      </mesh>
      <mesh ref={glowRef} scale={[520, 520, 520]}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial {...glowShader} />
      </mesh>
    </group>
  );
}

function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  const moonTexture = useTexture("/moon_texture.png");

  useFrame(({ clock }) => {
    if (moonRef.current) {
      const t = clock.getElapsedTime() * 0.05;
      moonRef.current.position.x = Math.cos(t) * 800;
      moonRef.current.position.z = Math.sin(t) * 800 - 1200;
      moonRef.current.position.y = -300 + Math.sin(t * 2) * 50;
      moonRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={moonRef} scale={[60, 60, 60]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial map={moonTexture} shininess={5} />
    </mesh>
  );
}

function Jupiter() {
  const jupiterRef = useRef<THREE.Mesh>(null);
  const jupiterTexture = useTexture("/planet_jupiter.png");

  useFrame(({ clock }) => {
    if (jupiterRef.current) {
      const t = clock.getElapsedTime() * 0.02 + Math.PI;
      jupiterRef.current.position.x = Math.cos(t) * 1200;
      jupiterRef.current.position.z = Math.sin(t) * 1200 - 1500;
      jupiterRef.current.position.y = 200 + Math.sin(t * 1.5) * 80;
      jupiterRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <mesh ref={jupiterRef} scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial map={jupiterTexture} shininess={15} />
    </mesh>
  );
}

function SaturnRings() {
  const ringsRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      const t = clock.getElapsedTime() * 0.03 + Math.PI * 0.5;
      ringsRef.current.position.x = Math.cos(t) * 1500;
      ringsRef.current.position.z = Math.sin(t) * 1500 - 1800;
      ringsRef.current.position.y = 400;
      ringsRef.current.rotation.x = Math.PI * 0.4;
      ringsRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <mesh ref={ringsRef} scale={[200, 200, 20]}>
      <ringGeometry args={[0.7, 1, 64]} />
      <meshBasicMaterial
        color="#C8D8E8"
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ShootingStars() {
  const starsRef = useRef<THREE.Points>(null);
  const starData = useMemo(() => {
    const data: Array<{
      x: number;
      y: number;
      z: number;
      speed: number;
      active: boolean;
      delay: number;
    }> = [];
    for (let i = 0; i < 15; i++) {
      data.push({
        x: (Math.random() - 0.5) * 2000,
        y: Math.random() * 800 + 200,
        z: -Math.random() * 1000 - 500,
        speed: Math.random() * 8 + 5,
        active: false,
        delay: Math.random() * 10,
      });
    }
    return data;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(15 * 3);
    for (let i = 0; i < 15; i++) {
      arr[i * 3] = starData[i].x;
      arr[i * 3 + 1] = starData[i].y;
      arr[i * 3 + 2] = starData[i].z;
    }
    return arr;
  }, [starData]);

  useFrame(({ clock }) => {
    if (!starsRef.current) return;
    const t = clock.getElapsedTime();
    const posArr = starsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < 15; i++) {
      const data = starData[i];
      if (t > data.delay && !data.active) {
        data.active = true;
      }
      if (data.active) {
        posArr[i * 3] -= data.speed;
        posArr[i * 3 + 1] -= data.speed * 0.3;
        if (posArr[i * 3] < -1000 || posArr[i * 3 + 1] < -400) {
          posArr[i * 3] = (Math.random() - 0.5) * 2000;
          posArr[i * 3 + 1] = Math.random() * 800 + 200;
          posArr[i * 3 + 2] = -Math.random() * 1000 - 500;
          data.speed = Math.random() * 8 + 5;
          data.delay = t + Math.random() * 5;
          data.active = false;
        }
      }
    }
    starsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={3} transparent opacity={0.9} />
    </points>
  );
}

function AsteroidBelt() {
  const beltRef = useRef<THREE.Group>(null);

  const asteroidData = useMemo(() => {
    const data: Array<{
      angle: number;
      radius: number;
      speed: number;
      yOffset: number;
      size: number;
      rotSpeed: number;
    }> = [];
    for (let i = 0; i < 200; i++) {
      data.push({
        angle: (i / 200) * Math.PI * 2 + Math.random() * 0.5,
        radius: 600 + Math.random() * 200,
        speed: 0.0003 + Math.random() * 0.0005,
        yOffset: (Math.random() - 0.5) * 30,
        size: 1 + Math.random() * 3,
        rotSpeed: 0.001 + Math.random() * 0.005,
      });
    }
    return data;
  }, []);

  const meshes = useMemo(() => {
    return asteroidData.map((data, i) => (
      <mesh
        key={i}
        position={[
          Math.cos(data.angle) * data.radius,
          Math.sin(data.angle * 2) * data.yOffset,
          Math.sin(data.angle) * data.radius - 800,
        ]}
        scale={[data.size, data.size, data.size]}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshPhongMaterial color="#6B6B6B" shininess={3} />
      </mesh>
    ));
  }, [asteroidData]);

  useFrame(() => {
    if (!beltRef.current) return;
    beltRef.current.children.forEach((mesh, i) => {
      const data = asteroidData[i];
      if (!data) return;
      mesh.position.x = Math.cos(data.angle) * data.radius;
      mesh.position.z = Math.sin(data.angle) * data.radius - 800;
      mesh.position.y = Math.sin(data.angle * 2) * data.yOffset;
      mesh.rotation.x += data.rotSpeed;
      mesh.rotation.y += data.rotSpeed;
      data.angle += data.speed;
    });
  });

  return <group ref={beltRef}>{meshes}</group>;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[500, 100, -1000]} intensity={1.2} />
      <pointLight position={[-200, 200, -500]} intensity={0.5} color="#4466AA" />
      
      <Stars
        radius={5000}
        depth={3000}
        count={8000}
        factor={4}
        saturation={0.2}
        fade
        speed={0.5}
      />
      
      <Earth />
      <Moon />
      <Jupiter />
      <SaturnRings />
      <ShootingStars />
      <AsteroidBelt />
      
      <fog attach="fog" args={["#050508", 2000, 5000]} />
    </>
  );
}

export default function SpaceScene() {
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
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 10000 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#050508" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

// src/components/Portfolio3D.jsx
import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/* ---------- small 3D pieces ---------- */
function WireTorusKnot() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.22;
    ref.current.rotation.y += delta * 0.15;
  });
  return (
    <mesh ref={ref} position={[0, 0.2, 0]} scale={0.5}>
      {/* smaller radius + thinner tube */}
      <torusKnotGeometry args={[0.6, 0.1, 150, 16]} />
      <meshBasicMaterial wireframe color="#64ffda" />
    </mesh>
  );
}

function RisingCodeRain({ count = 300 }) {
  const meshRef = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 10; // tighter X spread
      arr[i * 3 + 1] = Math.random() * 8 - 6;     // Y start
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8; // tighter Z spread
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      let y = positions[i * 3 + 1] + delta * 1.2;
      if (y > 5) y = -7 - Math.random() * 2;
      positions[i * 3 + 1] = y;
    }
    meshRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#64ffda" transparent opacity={0.4} />
    </lineSegments>
  );
}

/* ---------- The main scene ---------- */
function Scene() {
  return (
    <>
      {/* Adjusted camera further back to reduce blurriness */}
      <PerspectiveCamera makeDefault position={[0, 1.1, 6]} fov={50} />
      <ambientLight intensity={0.3} />
      <pointLight
        position={[6, 6, 6]}
        color={new THREE.Color("#00ffd1")}
        intensity={0.8}
      />
      <Stars radius={60} depth={25} count={700} factor={3} fade />

      <RisingCodeRain />
      <WireTorusKnot />

      {/* Subtle background dome */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial side={THREE.BackSide} color="#001219" />
      </mesh>

      <Float speed={1} rotationIntensity={0.25} floatIntensity={0.5}>
        <mesh position={[0, 1.4, 0]}>
          {/* Replace with drei/Text for crisp text instead of textGeometry */}
          <textGeometry
            args={["YOUR NAME", { size: 0.28, height: 0.02 }]}
          />
          <meshBasicMaterial color="#64ffda" />
        </mesh>
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

/* ---------- SSR-safe wrapper ---------- */
export default function Portfolio3D({ disableOnMobile = true }) {
  const [isClient, setIsClient] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (disableOnMobile && window.innerWidth < 800) setShowCanvas(false);
    else setShowCanvas(true);

    const onResize = () => {
      if (disableOnMobile && window.innerWidth < 800) setShowCanvas(false);
      else setShowCanvas(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [disableOnMobile]);

  if (!isClient || !showCanvas) return null;

  return (
    <div
      className="portfolio-3d-canvas"
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas dpr={[1, 2]} style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

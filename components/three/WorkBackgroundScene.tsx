"use client";

import { useRef } from "react";
import type { Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Sphere } from "@react-three/drei";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { brandColors } from "@/lib/brand";

const CONCRETE_MATERIAL_PROPS = {
  color: brandColors.silver,
  roughness: 0.95,
  metalness: 0.05,
} as const;

const GLASS_MATERIAL_PROPS = {
  color: brandColors.sand,
  roughness: 0.25,
  transmission: 0.9,
  thickness: 1.2,
  ior: 1.4,
  metalness: 0,
} as const;

type LayerShape =
  | { kind: "concrete"; args: [number, number, number]; radius: number }
  | { kind: "glass"; args: [number, number, number] };

interface LayerConfig {
  position: [number, number, number];
  speed: number;
  rotationSpeed: number;
  shape: LayerShape;
}

// Scattered toward the frame's edges, at varying depth and scroll speed,
// so the layers read as loose depth rather than a centered showpiece.
const LAYERS: LayerConfig[] = [
  {
    position: [-5.6, 3.1, -2],
    speed: 0.045,
    rotationSpeed: 0.05,
    shape: { kind: "concrete", args: [1.6, 1.6, 1.6], radius: 0.16 },
  },
  {
    position: [5.9, -2.6, -3],
    speed: -0.07,
    rotationSpeed: 0.08,
    shape: { kind: "concrete", args: [1.1, 2.3, 1.1], radius: 0.12 },
  },
  {
    position: [4.7, 3.4, -1.6],
    speed: 0.1,
    rotationSpeed: 0.03,
    shape: { kind: "glass", args: [0.9, 32, 32] },
  },
  {
    position: [-6.1, -3.4, -2.4],
    speed: -0.06,
    rotationSpeed: 0.04,
    shape: { kind: "glass", args: [0.65, 32, 32] },
  },
];

interface FloatingLayerProps {
  config: LayerConfig;
  parallax: MotionValue<number>;
}

function FloatingLayer({ config, parallax }: FloatingLayerProps) {
  const groupRef = useRef<Group>(null);
  const baseY = config.position[1];

  useFrame((_, delta) => {
    const node = groupRef.current;
    if (!node) return;
    node.position.y = baseY + parallax.get();
    node.rotation.x += delta * config.rotationSpeed;
    node.rotation.y += delta * config.rotationSpeed * 0.6;
  });

  return (
    <group ref={groupRef} position={config.position}>
      {config.shape.kind === "concrete" ? (
        <RoundedBox args={config.shape.args} radius={config.shape.radius} smoothness={4}>
          <meshStandardMaterial {...CONCRETE_MATERIAL_PROPS} />
        </RoundedBox>
      ) : (
        <Sphere args={config.shape.args}>
          <meshPhysicalMaterial {...GLASS_MATERIAL_PROPS} />
        </Sphere>
      )}
    </group>
  );
}

/**
 * Decorative, non-interactive backdrop for the /work page: polished
 * concrete blocks and frosted glass spheres drifting near the frame's
 * edges, each layer parallaxing at its own speed as the page scrolls.
 * Deliberately subtle — it must never compete with the project cards.
 */
export default function WorkBackgroundScene() {
  const { scrollY } = useScroll();

  // One useTransform per LAYERS entry, unrolled so hook calls stay static
  // rather than looping over the array.
  const parallaxByLayer = [
    useTransform(scrollY, (value) => value * LAYERS[0].speed),
    useTransform(scrollY, (value) => value * LAYERS[1].speed),
    useTransform(scrollY, (value) => value * LAYERS[2].speed),
    useTransform(scrollY, (value) => value * LAYERS[3].speed),
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-50"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color={brandColors.sand} />
        <directionalLight position={[-5, -3, 2]} intensity={0.5} color={brandColors.rust} />

        {LAYERS.map((layer, index) => (
          <FloatingLayer
            key={index}
            config={layer}
            parallax={parallaxByLayer[index]}
          />
        ))}
      </Canvas>
    </div>
  );
}

"use client";

import { useRef } from "react";
import type { Group } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Sphere } from "@react-three/drei";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { brandColors } from "@/shared/lib/brand";

const CONCRETE_MATERIAL_PROPS = {
  color: brandColors.silver,
  roughness: 0.9,
  metalness: 0.1,
} as const;

// Frosted (not clear) glass: a transmissive material needs an environment
// map to read against a black backdrop, which this scene deliberately
// doesn't load. A translucent, semi-opaque standard material renders
// reliably as a pale frosted sphere without that dependency.
const GLASS_MATERIAL_PROPS = {
  color: brandColors.sand,
  roughness: 0.65,
  metalness: 0.05,
  transparent: true,
  opacity: 0.7,
} as const;

type LayerShape =
  | { kind: "concrete"; args: [number, number, number]; radius: number }
  | { kind: "glass"; args: [number, number, number] };

interface LayerConfig {
  position: [number, number, number];
  speed: number;
  rotationSpeed: number;
  shape: LayerShape;
  /** Fraction (0-1) of total page scroll at which this layer fades into
   * view and then stays visible. Omitted entirely for the original top
   * layers, which must always be visible, unchanged. */
  appearAt?: number;
}

// Scattered toward the frame's edges, at varying depth and scroll speed,
// so the layers read as loose depth rather than a centered showpiece. Kept
// inside +-4.9/+-2.9 so they stay in-frustum (and clearly visible) across
// common viewport aspect ratios, not just ultra-wide desktops.
//
// The first four are always visible (the "top" set, present from the very
// first frame). The rest fade in once the page has been scrolled to
// roughly their `appearAt` point, so the page reads as populated with 3D
// depth in the middle and near the end too, not just at the top.
const LAYERS: LayerConfig[] = [
  {
    position: [-4.6, 2.6, -1.4],
    speed: 0.045,
    rotationSpeed: 0.05,
    shape: { kind: "concrete", args: [1.9, 1.9, 1.9], radius: 0.18 },
  },
  {
    position: [4.7, -2.3, -1.8],
    speed: -0.07,
    rotationSpeed: 0.08,
    shape: { kind: "concrete", args: [1.3, 2.7, 1.3], radius: 0.14 },
  },
  {
    position: [3.9, 2.7, -1],
    speed: 0.1,
    rotationSpeed: 0.03,
    shape: { kind: "glass", args: [1.15, 32, 32] },
  },
  {
    position: [-4.8, -2.8, -1.2],
    speed: -0.06,
    rotationSpeed: 0.04,
    shape: { kind: "glass", args: [0.85, 32, 32] },
  },
  // Middle-of-page set. speed here is drift (world units) per unit of
  // scrollYProgress traveled since appearAt, not per pixel — see the
  // scrollYProgress-based useTransform below.
  {
    position: [-4.7, 0.3, -1.5],
    speed: 3.2,
    rotationSpeed: 0.05,
    shape: { kind: "concrete", args: [1.5, 1.5, 1.5], radius: 0.16 },
    appearAt: 0.35,
  },
  {
    position: [4.6, -0.4, -1.4],
    speed: -2.8,
    rotationSpeed: 0.04,
    shape: { kind: "glass", args: [1.0, 32, 32] },
    appearAt: 0.38,
  },
  // End-of-page set.
  {
    position: [-4.4, 1.3, -1.6],
    speed: 3.0,
    rotationSpeed: 0.05,
    shape: { kind: "glass", args: [0.95, 32, 32] },
    appearAt: 0.68,
  },
  {
    position: [4.5, -1.4, -1.3],
    speed: -3.4,
    rotationSpeed: 0.06,
    shape: { kind: "concrete", args: [1.4, 2.1, 1.4], radius: 0.15 },
    appearAt: 0.74,
  },
];

interface FloatingLayerProps {
  config: LayerConfig;
  parallax: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

function FloatingLayer({ config, parallax, scrollYProgress }: FloatingLayerProps) {
  const groupRef = useRef<Group>(null);
  const baseY = config.position[1];

  useFrame((_, delta) => {
    const node = groupRef.current;
    if (!node) return;
    node.position.y = baseY + parallax.get();
    node.rotation.x += delta * config.rotationSpeed;
    node.rotation.y += delta * config.rotationSpeed * 0.6;

    if (config.appearAt !== undefined) {
      const progress = scrollYProgress.get();
      node.visible = progress >= config.appearAt;
    }
  });

  return (
    <group ref={groupRef} position={config.position}>
      {config.shape.kind === "concrete" ? (
        <RoundedBox args={config.shape.args} radius={config.shape.radius} smoothness={4}>
          <meshStandardMaterial {...CONCRETE_MATERIAL_PROPS} />
        </RoundedBox>
      ) : (
        <Sphere args={config.shape.args}>
          <meshStandardMaterial {...GLASS_MATERIAL_PROPS} />
        </Sphere>
      )}
    </group>
  );
}

/**
 * Decorative, non-interactive backdrop for the /work page: polished
 * concrete blocks and frosted glass spheres drifting near the frame's
 * edges, each layer parallaxing at its own speed as the page scrolls.
 * Sits behind the cards (never overlapping their content column), but at
 * full opacity — it must read as clearly as the Hero's flow-line backdrop,
 * not fade into an unnoticeable haze. The first four shapes are always on;
 * a second and third set fade in once scrolled roughly to the middle and
 * the end of the (now much taller, three-section) page.
 */
export default function WorkBackgroundScene() {
  const { scrollY, scrollYProgress } = useScroll();

  // The original top-set layers (0-3) parallax off raw pixel scrollY,
  // untouched from before. The page is now much taller (three full project
  // grids), so the mid/end layers (4-7) parallax off scrollYProgress
  // (0-1) instead, scaled to a small fixed drift range — a pixel-based
  // speed tuned for a short page would fling them far outside the camera
  // frustum long before they're due to appear.
  const parallaxByLayer = [
    useTransform(scrollY, (value) => value * LAYERS[0].speed),
    useTransform(scrollY, (value) => value * LAYERS[1].speed),
    useTransform(scrollY, (value) => value * LAYERS[2].speed),
    useTransform(scrollY, (value) => value * LAYERS[3].speed),
    useTransform(scrollYProgress, (p) => Math.max(0, p - (LAYERS[4].appearAt ?? 0)) * LAYERS[4].speed),
    useTransform(scrollYProgress, (p) => Math.max(0, p - (LAYERS[5].appearAt ?? 0)) * LAYERS[5].speed),
    useTransform(scrollYProgress, (p) => Math.max(0, p - (LAYERS[6].appearAt ?? 0)) * LAYERS[6].speed),
    useTransform(scrollYProgress, (p) => Math.max(0, p - (LAYERS[7].appearAt ?? 0)) * LAYERS[7].speed),
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color={brandColors.sand} />
        <directionalLight position={[-5, -3, 2]} intensity={0.8} color={brandColors.rust} />

        {LAYERS.map((layer, index) => (
          <FloatingLayer
            key={index}
            config={layer}
            parallax={parallaxByLayer[index]}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </Canvas>
    </div>
  );
}

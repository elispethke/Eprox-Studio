"use client";

import { useEffect, useRef, type RefObject } from "react";
import { brandColors } from "@/lib/brand";

interface UseFlowLinesResult {
  /** Attach to a <canvas> filling a positioned ancestor (e.g. the Hero section). */
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const LINE_COUNT = 12;
const STEP_LENGTH = 9;
const MAX_STEPS = 220;
const TIME_SPEED = 0.00006;
const ORBIT_LINE_COUNT = 4;
const ORBIT_TIME_SPEED = 0.00004;

// Mirrors HeroGlowOrb's sphere geometry (width/height: clamp(200px, 28vw,
// 360px); top: clamp(-140px, -8vw, -80px); right: clamp(-180px, -10vw,
// -100px)) so the orbit lines below track the actual visible sphere.
const SPHERE_SIZE_MIN = 200;
const SPHERE_SIZE_VW_FRACTION = 0.28;
const SPHERE_SIZE_MAX = 360;
const SPHERE_TOP_MIN = -140;
const SPHERE_TOP_VW_FRACTION = -0.08;
const SPHERE_TOP_MAX = -80;
const SPHERE_RIGHT_MIN = -180;
const SPHERE_RIGHT_VW_FRACTION = -0.1;
const SPHERE_RIGHT_MAX = -100;

function clampPx(min: number, preferred: number, max: number): number {
  return Math.min(Math.max(preferred, min), max);
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

// Cheap hashed 2D value noise (smoothstep-interpolated) — enough to drive an
// organic, continuously-drifting flow field without pulling in a noise lib.
function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

interface FlowLine {
  startXFrac: number;
  startYFrac: number;
  freq: number;
  angleSpan: number;
  baseAngle: number;
  phase: number;
  reach: number;
  lineWidth: number;
  alpha: number;
  useDarkTone: boolean;
  /** Orbit lines arc around the Hero glow orb instead of following the noise field. */
  isOrbit?: boolean;
  orbitRadiusFrac?: number;
  orbitStartAngle?: number;
  orbitSweep?: number;
  orbitSpeedMul?: number;
}

// Lines seed near/left of the left edge and mostly point rightward, so the
// pattern reads as denser and brighter on the left, dissipating rightward —
// `reach` (how many of MAX_STEPS a line actually walks) varies per line so
// some stop early, thinning the pattern out toward the right edge.
function createLines(): FlowLine[] {
  return Array.from({ length: LINE_COUNT }, () => ({
    startXFrac: -0.15 + Math.random() * 0.2,
    startYFrac: Math.random(),
    freq: 0.0016 + Math.random() * 0.0016,
    angleSpan: 1.3 + Math.random() * 1.3,
    baseAngle: -0.25 + Math.random() * 0.5,
    phase: Math.random() * 1000,
    reach: 0.35 + Math.random() * 0.75,
    lineWidth: 0.6 + Math.random() * 1.1,
    alpha: 0.3 + Math.random() * 0.55,
    useDarkTone: Math.random() < 0.3,
  }));
}

// A handful of lines dedicated to arcing around the glow orb like orbital
// rings — same draw pipeline as the rest, just parametric-circle points
// instead of noise-field marching.
function createOrbitLines(): FlowLine[] {
  return Array.from({ length: ORBIT_LINE_COUNT }, (_, index) => ({
    startXFrac: 0,
    startYFrac: 0,
    freq: 0,
    angleSpan: 0,
    baseAngle: 0,
    phase: 0,
    reach: 1,
    lineWidth: 0.6 + Math.random() * 0.9,
    alpha: 0.4 + Math.random() * 0.4,
    useDarkTone: index % 2 === 0,
    isOrbit: true,
    orbitRadiusFrac: 1.08 + index * 0.16 + Math.random() * 0.06,
    orbitStartAngle: Math.random() * Math.PI * 2,
    orbitSweep: Math.PI * (1.5 + Math.random() * 0.5),
    orbitSpeedMul: 0.5 + Math.random() * 0.5,
  }));
}

/**
 * Drives a canvas 2D "light painting" background: thin rust-toned curves
 * that drift slowly across a container, denser and brighter on the left,
 * dissipating toward the right. Freezes to one static frame under
 * prefers-reduced-motion instead of animating.
 */
export function useFlowLines(): UseFlowLinesResult {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const [rustR, rustG, rustB] = hexToRgb(brandColors.rust);
    const [darkR, darkG, darkB] = hexToRgb(brandColors.rustDark);

    const lines = [...createLines(), ...createOrbitLines()];
    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    const draw = (time: number) => {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(
        width * 0.1,
        height * 0.5,
        0,
        width * 0.1,
        height * 0.5,
        width * 0.55,
      );
      glow.addColorStop(0, `rgba(${rustR}, ${rustG}, ${rustB}, 0.12)`);
      glow.addColorStop(1, `rgba(${rustR}, ${rustG}, ${rustB}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const rustGradient = ctx.createLinearGradient(0, 0, width, 0);
      rustGradient.addColorStop(0, `rgba(${rustR}, ${rustG}, ${rustB}, 0.9)`);
      rustGradient.addColorStop(0.45, `rgba(${rustR}, ${rustG}, ${rustB}, 0.28)`);
      rustGradient.addColorStop(0.85, `rgba(${rustR}, ${rustG}, ${rustB}, 0)`);

      const darkGradient = ctx.createLinearGradient(0, 0, width, 0);
      darkGradient.addColorStop(0, `rgba(${darkR}, ${darkG}, ${darkB}, 0.7)`);
      darkGradient.addColorStop(0.4, `rgba(${darkR}, ${darkG}, ${darkB}, 0.22)`);
      darkGradient.addColorStop(0.8, `rgba(${darkR}, ${darkG}, ${darkB}, 0)`);

      const t = prefersReducedMotion ? 0 : time * TIME_SPEED;
      const orbitT = prefersReducedMotion ? 0 : time * ORBIT_TIME_SPEED;

      const sphereSize = clampPx(SPHERE_SIZE_MIN, width * SPHERE_SIZE_VW_FRACTION, SPHERE_SIZE_MAX);
      const sphereRadius = sphereSize / 2;
      const sphereRight = clampPx(SPHERE_RIGHT_MIN, width * SPHERE_RIGHT_VW_FRACTION, SPHERE_RIGHT_MAX);
      const sphereTop = clampPx(SPHERE_TOP_MIN, width * SPHERE_TOP_VW_FRACTION, SPHERE_TOP_MAX);
      const sphereCenterX = width - sphereRight - sphereRadius;
      const sphereCenterY = sphereTop + sphereRadius;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const line of lines) {
        if (line.isOrbit) {
          const radius = sphereRadius * (line.orbitRadiusFrac ?? 1.1);
          const rotation = orbitT * (line.orbitSpeedMul ?? 1);
          const startAngle = (line.orbitStartAngle ?? 0) + rotation;
          const sweep = line.orbitSweep ?? Math.PI * 1.6;
          const segments = 96;

          ctx.beginPath();
          for (let i = 0; i <= segments; i += 1) {
            const angle = startAngle + (sweep * i) / segments;
            const px = sphereCenterX + Math.cos(angle) * radius;
            const py = sphereCenterY + Math.sin(angle) * radius * 0.94;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }

          // Orbit lines live near the sphere (often past the point where the
          // left-to-right fade gradients below have already faded to
          // transparent), so they use a flat color instead of that gradient.
          ctx.strokeStyle = line.useDarkTone
            ? `rgba(${darkR}, ${darkG}, ${darkB}, 1)`
            : `rgba(${rustR}, ${rustG}, ${rustB}, 1)`;
        } else {
          let x = width * line.startXFrac;
          let y = height * line.startYFrac;
          const steps = Math.min(Math.ceil(MAX_STEPS * line.reach), MAX_STEPS);

          ctx.beginPath();
          ctx.moveTo(x, y);

          for (let i = 0; i < steps; i += 1) {
            const angle =
              line.baseAngle +
              (valueNoise(x * line.freq, y * line.freq + line.phase + t) - 0.5) *
                line.angleSpan;
            x += Math.cos(angle) * STEP_LENGTH;
            y += Math.sin(angle) * STEP_LENGTH;
            ctx.lineTo(x, y);
            if (x > width * 1.05 || x < -60 || y < -60 || y > height + 60) break;
          }

          ctx.strokeStyle = line.useDarkTone ? darkGradient : rustGradient;
        }

        // Two passes (soft halo + crisp core) fake a light-painting glow
        // without the per-frame cost of ctx.shadowBlur.
        ctx.globalAlpha = line.alpha * 0.3;
        ctx.lineWidth = line.lineWidth + 2;
        ctx.stroke();

        ctx.globalAlpha = line.alpha;
        ctx.lineWidth = line.lineWidth;
        ctx.stroke();
      }
    };

    const loop = (time: number) => {
      draw(time);
      animationFrame = requestAnimationFrame(loop);
    };

    if (prefersReducedMotion) {
      draw(0);
    } else {
      animationFrame = requestAnimationFrame(loop);
    }

    return () => {
      resizeObserver.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return { canvasRef };
}

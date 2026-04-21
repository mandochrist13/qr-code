"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface InteractiveBackgroundProps {
  className?: string;
}

export function InteractiveBackground({ className }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, pressed: false, rippleTime: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;

    type Dot = {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      r: number;
      phase: number;
    };
    let dots: Dot[] = [];

    const initDots = () => {
      dots = [];
      const spacing = Math.max(18, Math.min(28, Math.floor(Math.sqrt((width * height) / 320))));
      for (let y = spacing / 2; y < height + spacing; y += spacing) {
        for (let x = spacing / 2; x < width + spacing; x += spacing) {
          dots.push({
            baseX: x,
            baseY: y,
            x,
            y,
            r: Math.random() * 0.9 + 0.5,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDots();
    };

    const getLocalPoint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = getLocalPoint(e.clientX, e.clientY);
      mouseRef.current.x = p.x;
      mouseRef.current.y = p.y;
      mouseRef.current.active = true;
    };
    const onPointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.pressed = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      const p = getLocalPoint(e.clientX, e.clientY);
      mouseRef.current.x = p.x;
      mouseRef.current.y = p.y;
      mouseRef.current.active = true;
      mouseRef.current.pressed = true;
      mouseRef.current.rippleTime = performance.now();
    };
    const onPointerUp = () => {
      mouseRef.current.pressed = false;
    };

    const draw = (now: number) => {
      const t = now * 0.001;

      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, "#06200f");
      baseGrad.addColorStop(0.55, "#123d28");
      baseGrad.addColorStop(1, "#040f08");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      const auroraX = width * (0.3 + 0.2 * Math.sin(t * 0.25));
      const auroraY = height * (0.3 + 0.2 * Math.cos(t * 0.2));
      const aurora = ctx.createRadialGradient(
        auroraX,
        auroraY,
        0,
        auroraX,
        auroraY,
        Math.max(width, height) * 0.7,
      );
      aurora.addColorStop(0, "rgba(201, 168, 101, 0.18)");
      aurora.addColorStop(0.5, "rgba(26, 82, 55, 0.12)");
      aurora.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, width, height);

      const m = mouseRef.current;

      if (m.active) {
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 220);
        glow.addColorStop(0, m.pressed ? "rgba(234, 208, 142, 0.45)" : "rgba(201, 168, 101, 0.28)");
        glow.addColorStop(0.5, "rgba(201, 168, 101, 0.08)");
        glow.addColorStop(1, "rgba(201, 168, 101, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      let ripple = 0;
      if (m.rippleTime > 0) {
        const age = (now - m.rippleTime) / 1000;
        if (age < 1.2) {
          ripple = age;
          const radius = age * 260;
          ctx.strokeStyle = `rgba(234, 208, 142, ${Math.max(0, 0.5 - age * 0.45)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(m.x, m.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          m.rippleTime = -1;
        }
      }

      for (const d of dots) {
        const sway =
          Math.sin(t * 0.9 + d.phase + d.baseX * 0.018 + d.baseY * 0.012) * 2.4;
        d.x = d.baseX + sway;
        d.y =
          d.baseY +
          Math.cos(t * 0.7 + d.phase + d.baseX * 0.011) * 1.8;

        if (m.active) {
          const dx = d.x - m.x;
          const dy = d.y - m.y;
          const distSq = dx * dx + dy * dy;
          const influence = m.pressed ? 160 * 160 : 120 * 120;
          if (distSq < influence && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const strength = (1 - dist / Math.sqrt(influence)) * (m.pressed ? 28 : 18);
            d.x += (dx / dist) * strength;
            d.y += (dy / dist) * strength;
          }
        }

        if (ripple > 0) {
          const dx = d.x - m.x;
          const dy = d.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ring = ripple * 260;
          const delta = Math.abs(dist - ring);
          if (delta < 30 && dist > 0.01) {
            const push = (1 - delta / 30) * 14;
            d.x += (dx / dist) * push;
            d.y += (dy / dist) * push;
          }
        }

        const twinkle = 0.35 + Math.sin(t * 1.6 + d.phase) * 0.2;
        ctx.fillStyle = `rgba(212, 181, 114, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full touch-none", className)}
      aria-hidden
    />
  );
}

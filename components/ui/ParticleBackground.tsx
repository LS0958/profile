"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = ["#00f5ff", "#bf00ff", "#ff0080", "#00ff88", "#ffffff"];

export function ParticleBackground({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // alpha:false tells the compositor this canvas is opaque — skips alpha
    // compositing pass, which is a significant GPU saving.
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let W = 0;
    let H = 0;

    // ── Static grid: rendered ONCE to an offscreen canvas, stamped each frame
    // using a single drawImage() call instead of ~80 stroke() calls per frame.
    const gridCanvas = document.createElement("canvas");
    const gCtx = gridCanvas.getContext("2d")!;

    const buildGrid = () => {
      gridCanvas.width = W;
      gridCanvas.height = H;
      gCtx.clearRect(0, 0, W, H);
      gCtx.strokeStyle = "rgba(0,245,255,0.04)";
      gCtx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += 60) {
        gCtx.beginPath();
        gCtx.moveTo(x, 0);
        gCtx.lineTo(x, H);
        gCtx.stroke();
      }
      for (let y = 0; y <= H; y += 60) {
        gCtx.beginPath();
        gCtx.moveTo(0, y);
        gCtx.lineTo(W, y);
        gCtx.stroke();
      }
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      buildGrid();
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    const particles: Particle[] = Array.from({ length: count }, spawn);
    let rafId: number;

    // ── Throttle to 30 fps ──────────────────────────────────────────────
    // This halves all canvas work (clear, grid stamp, particle draw) with
    // no perceptible quality loss since the particles drift slowly.
    let lastTime = 0;
    const INTERVAL = 1000 / 30;

    const draw = (now: number) => {
      rafId = requestAnimationFrame(draw);
      if (now - lastTime < INTERVAL) return;
      lastTime = now;

      // Black fill is cheaper than clearRect on an opaque canvas context.
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Stamp the pre-rendered grid — one GPU texture copy instead of 80 strokes.
      ctx.drawImage(gridCanvas, 0, 0);

      // ── Draw particles ──────────────────────────────────────────────
      // REMOVED ctx.shadowBlur: shadow blur forces the browser to allocate
      // a separate per-particle GPU buffer for a Gaussian kernel pass.
      // At 80 particles × 60fps that was ~4800 shadow operations/second —
      // the primary cause of "page unresponsive" on 3K screens.
      // Plain alpha-fade colored dots are visually equivalent and cost ~0.
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = p.opacity * (1 - p.life / p.maxLife);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill(); // ← single fill, no shadow, no second fill call

        if (p.life >= p.maxLife) {
          particles[i] = spawn();
        }
      });
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}


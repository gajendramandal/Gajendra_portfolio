'use client';

import { useEffect, useRef } from 'react';

/**
 * Minimalist circuit grid animation — subtle glowing dots on a grid
 * with occasional slow pulses traveling along the grid lines.
 * Kali-inspired color scheme (green tones) but calm and clean.
 */
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationId: number;
    let time = 0;

    const GRID_GAP = 60;
    let dots: { x: number; y: number; pulse: number; speed: number }[] = [];
    let pulses: { x: number; y: number; dx: number; dy: number; life: number; maxLife: number }[] = [];

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const cols = Math.floor(w / GRID_GAP) + 1;
      const rows = Math.floor(h / GRID_GAP) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: c * GRID_GAP,
            y: r * GRID_GAP,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.008 + Math.random() * 0.008,
          });
        }
      }
    };

    const spawnPulse = () => {
      if (dots.length === 0) return;
      const origin = dots[Math.floor(Math.random() * dots.length)];
      // pick a random direction: right or down
      const horizontal = Math.random() > 0.5;
      pulses.push({
        x: origin.x,
        y: origin.y,
        dx: horizontal ? 0.8 : 0,
        dy: horizontal ? 0 : 0.8,
        life: 0,
        maxLife: 120,
      });
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      time += 1;

      // spawn a new pulse occasionally
      if (time % 40 === 0) spawnPulse();

      // Draw faint grid lines
      const cols = Math.floor(w / GRID_GAP) + 1;
      const rows = Math.floor(h / GRID_GAP) + 1;
      ctx.strokeStyle = 'rgba(0, 200, 80, 0.04)';
      ctx.lineWidth = 0.5;
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * GRID_GAP, 0);
        ctx.lineTo(c * GRID_GAP, h);
        ctx.stroke();
      }
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * GRID_GAP);
        ctx.lineTo(w, r * GRID_GAP);
        ctx.stroke();
      }

      // Draw dots at intersections
      dots.forEach((d) => {
        d.pulse += d.speed;
        const alpha = 0.15 + Math.sin(d.pulse) * 0.1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 80, ${alpha})`;
        ctx.fill();
      });

      // Draw traveling pulses
      pulses = pulses.filter((p) => p.life < p.maxLife);
      pulses.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life += 1;
        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * 0.7;

        // glow dot
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
        grad.addColorStop(0, `rgba(0, 255, 100, ${alpha})`);
        grad.addColorStop(1, `rgba(0, 255, 100, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 100, ${alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

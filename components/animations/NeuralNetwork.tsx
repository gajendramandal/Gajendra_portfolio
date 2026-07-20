'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  hue: number;
}

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let animationId: number = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const LINK_DIST = 130;
    const MOUSE_DIST = 180;

    const particleCount = () => {
      const area = canvas.offsetWidth * canvas.offsetHeight;
      return Math.min(140, Math.max(50, Math.floor(area / 9000)));
    };

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const init = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = particleCount();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8,
        baseAlpha: Math.random() * 0.5 + 0.3,
        hue: 250 + Math.random() * 40, // purple-indigo range
      }));
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // ── Update + draw particles ──
      particles.forEach((p) => {
        // Mouse repulsion / attraction (subtle pull toward cursor)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DIST && dist > 0) {
            const force = (MOUSE_DIST - dist) / MOUSE_DIST;
            // gentle push away from cursor
            p.vx += (dx / dist) * force * 0.15;
            p.vy += (dy / dist) * force * 0.15;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // friction so it settles back to a calm drift
        p.vx *= 0.98;
        p.vy *= 0.98;

        // keep a minimum drift so it never freezes
        if (Math.hypot(p.vx, p.vy) < 0.15) {
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
        }

        // wrap around edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      });

      // ── Draw connections between nearby particles ──
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(255, 80%, 70%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // links to mouse (brighter)
        if (mouse.active) {
          const dx = a.x - mouse.x;
          const dy = a.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DIST) {
            const alpha = (1 - dist / MOUSE_DIST) * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `hsla(265, 90%, 75%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // ── Draw glowing particle dots on top ──
      particles.forEach((p) => {
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius + 4);
        glow.addColorStop(0, `hsla(${p.hue}, 90%, 75%, ${p.baseAlpha})`);
        glow.addColorStop(1, `hsla(${p.hue}, 90%, 75%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 85%, ${Math.min(1, p.baseAlpha + 0.3)})`;
        ctx.fill();
      });

      // mouse node
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 10);
        g.addColorStop(0, 'rgba(216, 180, 254, 0.9)');
        g.addColorStop(1, 'rgba(216, 180, 254, 0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    // ── Mouse / touch handlers ──
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };

    resize();

    if (prefersReduced) {
      draw(); // single static frame
    } else {
      draw();
    }

    window.addEventListener('resize', resize);
    // listen on window so it tracks the cursor across the whole hero
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}

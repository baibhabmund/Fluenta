"use client";

import { useEffect, useRef } from "react";

import { useTheme } from "@/components/theme-provider";

export function HomeAmbientBackground() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");
    if (!canvasContext) return;

    const ctx = canvasContext;
    const wrapper = container;
    wrapper.appendChild(canvas);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      shape: number;
    }> = [];

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let frameId = 0;
    let width = 0;
    let height = 0;

    function resetParticles() {
      particles.length = 0;
      const count = Math.min(120, Math.max(60, Math.floor((width * height) / 18)));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.1,
          vy: (Math.random() - 0.5) * 1.1,
          radius: Math.random() * 2.7 + 1,
          alpha: Math.random() * 0.7 + 0.3,
          shape: Math.floor(Math.random() * 3),
        });
      }
    }

    function resizeCanvas() {
      const rect = wrapper.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      mouse.x = width * 0.7;
      mouse.y = height * 0.4;
      mouse.targetX = mouse.x;
      mouse.targetY = mouse.y;
      resetParticles();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const base = isDark ? "#04090c" : "#f8fffd";
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      const glow1 = ctx.createRadialGradient(width * 0.28, height * 0.2, 20, width * 0.28, height * 0.2, width * 0.7);
      glow1.addColorStop(0, isDark ? "rgba(20,184,166,0.18)" : "rgba(13,148,136,0.12)");
      glow1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width * 0.75, height * 0.35, 20, width * 0.75, height * 0.35, width * 0.8);
      glow2.addColorStop(0, isDark ? "rgba(45,212,191,0.12)" : "rgba(13,148,136,0.10)");
      glow2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      const grid = isDark ? "rgba(20,184,166,0.11)" : "rgba(13,148,136,0.10)";
      ctx.fillStyle = grid;
      const gap = 22;
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          ctx.fillRect(x, y, 1.3, 1.3);
        }
      }

      const waveColor1 = isDark ? "rgba(20,184,166,0.22)" : "rgba(13,148,136,0.18)";
      const waveColor2 = isDark ? "rgba(240,253,250,0.12)" : "rgba(15,118,110,0.14)";

      ctx.beginPath();
      ctx.moveTo(0, 120);
      for (let x = 0; x <= width; x += 60) {
        const t = x * 0.008 + performance.now() * 0.0012;
        const y = 130 + Math.sin(t) * 34 + ((mouse.x - width / 2) / width) * 52;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = waveColor1;
      ctx.lineWidth = 1.7;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 220);
      for (let x = 0; x <= width; x += 60) {
        const t = x * 0.007 + performance.now() * 0.0016;
        const y = 220 + Math.cos(t) * 42 - ((mouse.x - width / 2) / width) * 36;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = waveColor2;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([7, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          p.x -= (dx / (dist || 1)) * force * 3.2;
          p.y -= (dy / (dist || 1)) * force * 3.2;
        }

        const fill = isDark ? (p.shape === 0 ? "rgba(240,253,250,0.55)" : "rgba(20,184,166,0.52)") : (p.shape === 0 ? "rgba(15,118,110,0.48)" : "rgba(13,148,136,0.48)");
        ctx.fillStyle = fill;
        ctx.beginPath();
        if (p.shape === 0) {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        } else if (p.shape === 1) {
          ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        } else {
          ctx.moveTo(p.x, p.y - p.radius * 1.5);
          ctx.lineTo(p.x + p.radius * 1.5, p.y);
          ctx.lineTo(p.x, p.y + p.radius * 1.5);
          ctx.lineTo(p.x - p.radius * 1.5, p.y);
          ctx.closePath();
        }
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? `rgba(20,184,166,${(1 - dist2 / 120) * 0.24})` : `rgba(13,148,136,${(1 - dist2 / 120) * 0.20})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      const radial = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 380);
      radial.addColorStop(0, isDark ? "rgba(20,184,166,0.26)" : "rgba(13,148,136,0.18)");
      radial.addColorStop(0.45, isDark ? "rgba(13,148,136,0.10)" : "rgba(45,212,191,0.08)");
      radial.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      frameId = requestAnimationFrame(render);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = wrapper.getBoundingClientRect();
      mouse.targetX = ((event.clientX - rect.left) / rect.width) * width;
      mouse.targetY = ((event.clientY - rect.top) / rect.height) * height;
    }

    mouse.x = width * 0.7;
    mouse.y = height * 0.4;
    mouse.targetX = mouse.x;
    mouse.targetY = mouse.y;

    resizeCanvas();
    render();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.remove();
    };
  }, [isDark]);

  return <div ref={ref} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" />;
}

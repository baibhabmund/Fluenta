"use client";

import { useEffect, useRef } from "react";

import { useTheme } from "@/components/theme-provider";
import { Container, LinkButton } from "@/components/ui";
import { brand } from "@/lib/brand";

export function FluentXBanner() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const shellStyle = isDark
    ? { background: "linear-gradient(135deg, #061018 0%, #0a1722 45%, #07151d 100%)" }
    : { background: "linear-gradient(135deg, #f0fdfa 0%, #ecfeff 35%, #f8fafc 100%)" };
  const baseBg = isDark ? "#070c17" : "#f0fdfa";
  const accent = isDark ? "#14b8a6" : "#0d9488";
  const accentSoft = isDark ? "#0f766e" : "#2dd4bf";
  const secondary = isDark ? "#f0fdfa" : "#0f766e";
  const rail = isDark ? "rgba(20, 184, 166, 0.18)" : "rgba(13, 148, 136, 0.18)";

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    const svg = container.querySelector("svg");
    const highlight = container.querySelector("#mouseHighlight");
    const pLayerBack = container.querySelector("#parallaxLayerBack");
    const pLayerFront = container.querySelector("#parallaxLayerFront");
    const particleGroup = container.querySelector("#interactiveParticles");
    const connections = container.querySelector("#connections");
    const path1 = container.querySelector("#dynamicPath1");
    const path2 = container.querySelector("#dynamicPath2");

    if (!svg || !highlight || !pLayerBack || !pLayerFront || !particleGroup || !connections || !path1 || !path2) {
      return;
    }

    const svgEl = svg as SVGSVGElement;
    const highlightEl = highlight as SVGCircleElement;
    const backLayer = pLayerBack as SVGGElement;
    const frontLayer = pLayerFront as SVGGElement;
    const connectionsEl = connections as SVGGElement;
    const path1El = path1 as SVGPathElement;
    const path2El = path2 as SVGPathElement;

    const width = 1200;
    const height = 600;
    let mouse = { x: width * 0.75, y: height / 2, targetX: width * 0.75, targetY: height / 2 };
    let time = 0;
    let frameId = 0;

    const particles: Array<{
      el: SVGCircleElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      speedFactor: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      const startX = 550 + Math.random() * 600;
      const startY = 80 + Math.random() * 450;
      const radius = Math.random() * 3 + 1.5;

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", String(radius));
      circle.setAttribute("fill", i % 3 === 0 ? "#f0fdfa" : "#14b8a6");
      circle.setAttribute("opacity", String(Math.random() * 0.6 + 0.3));
      particleGroup.appendChild(circle);

      particles.push({
        el: circle,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        speedFactor: Math.random() * 1.5 + 0.5,
      });
    }

    function onMouseMove(event: MouseEvent) {
      const rect = svgEl.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      mouse.targetX = (event.clientX - rect.left) * scaleX;
      mouse.targetY = (event.clientY - rect.top) * scaleY;
    }

    window.addEventListener("mousemove", onMouseMove);

    function animate() {
      time += 0.01;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      highlightEl.setAttribute("cx", String(mouse.x));
      highlightEl.setAttribute("cy", String(mouse.y));

      const dx = (mouse.x - width / 2) * 0.02;
      const dy = (mouse.y - height / 2) * 0.02;

      backLayer.setAttribute("transform", `translate(${-dx}, ${-dy})`);
      frontLayer.setAttribute("transform", `translate(${dx * 1.5}, ${dy * 1.5})`);

      let p1 = `M 400 ${300 + Math.sin(time) * 15}`;
      let p2 = `M 400 ${340 + Math.cos(time * 0.8) * 10}`;

      for (let x = 400; x <= 1200; x += 80) {
        const mDist = Math.max(0, (250 - Math.abs(x - mouse.x)) / 250);
        const yOffset = mDist * (mouse.y - 300) * 0.25;
        const y1 = 300 + Math.sin(time + x * 0.004) * 40 + yOffset;
        const y2 = 340 + Math.cos(time * 0.7 + x * 0.005) * 30 - yOffset;

        p1 += ` Q ${x + 40} ${y1}, ${x + 80} ${y1}`;
        p2 += ` Q ${x + 40} ${y2}, ${x + 80} ${y2}`;
      }

      path1El.setAttribute("d", p1);
      path2El.setAttribute("d", p2);

      let linkLines = "";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * p.speedFactor;
        p.y += p.vy * p.speedFactor;

        if (p.x < 500 || p.x > 1180) p.vx *= -1;
        if (p.y < 50 || p.y > 550) p.vy *= -1;

        const mDx = mouse.x - p.x;
        const mDy = mouse.y - p.y;
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

        if (mDist < 140) {
          const force = (140 - mDist) / 140;
          p.x -= (mDx / mDist) * force * 3;
          p.y -= (mDy / mDist) * force * 3;
        }

        p.el.setAttribute("cx", String(p.x));
        p.el.setAttribute("cy", String(p.y));

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.22;
            linkLines += `<line x1="${p.x}" y1="${p.y}" x2="${p2.x}" y2="${p2.y}" stroke-opacity="${opacity}" />`;
          }
        }
      }

      connectionsEl.innerHTML = linkLines;
      frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section className="fluentx-hero-shell relative isolate overflow-hidden" style={shellStyle}>
      <div ref={rootRef} className="fluentx-banner-bg" id="fluentxInteractive" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isDark ? "#14b8a6" : "#0d9488"} stopOpacity={isDark ? 0.25 : 0.18} />
              <stop offset="60%" stopColor={isDark ? "#0f766e" : "#2dd4bf"} stopOpacity={isDark ? 0.08 : 0.05} />
              <stop offset="100%" stopColor={isDark ? "#050b14" : "#f0fdfa"} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isDark ? "#f0fdfa" : "#0d9488"} stopOpacity={isDark ? 0.15 : 0.12} />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
            <pattern id="dotGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill={accent} opacity={isDark ? 0.18 : 0.15} />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill={baseBg} />
          <rect width="100%" height="100%" fill="url(#dotGrid)" opacity="0.7" />

          <g id="parallaxLayerBack" style={{ transformOrigin: "center", transition: "transform 0.2s ease-out" }}>
            <circle cx="950" cy="250" r="180" fill="url(#dotGlow)" />
            <circle cx="850" cy="400" r="120" fill={accent} opacity={isDark ? 0.08 : 0.1} filter="blur(40px)" />
            <g fill={accent} opacity={isDark ? 0.15 : 0.22}>
              <rect x="900" y="220" width="12" height="60" rx="6" />
              <rect x="925" y="180" width="12" height="100" rx="6" />
              <rect x="950" y="140" width="12" height="140" rx="6" />
              <rect x="740" y="380" width="10" height="40" rx="5" />
              <rect x="760" y="350" width="10" height="70" rx="5" />
              <rect x="780" y="320" width="10" height="100" rx="5" />
            </g>
          </g>

          <circle id="mouseHighlight" r="250" fill="url(#cursorGlow)" pointerEvents="none" />
          <path id="dynamicPath1" fill="none" stroke={accent} strokeOpacity={isDark ? 0.3 : 0.28} strokeWidth="2" />
          <path id="dynamicPath2" fill="none" stroke={secondary} strokeOpacity={isDark ? 0.15 : 0.25} strokeWidth="1.5" strokeDasharray="8 4" />
          <g id="connections" stroke={accent} strokeOpacity={isDark ? 0.2 : 0.18} strokeWidth="1"></g>
          <g id="interactiveParticles"></g>

          <g id="parallaxLayerFront" style={{ transformOrigin: "center", transition: "transform 0.1s ease-out" }}>
            <path d="M 1020,120 L 1035,140 L 1010,135 Z" fill={secondary} opacity={isDark ? 0.6 : 0.7} />
            <path d="M 880,480 L 895,505 L 870,495 Z" fill={accent} opacity={isDark ? 0.5 : 0.65} />
            <path d="M 680,240 L 692,250 L 675,255 Z" fill={accentSoft} opacity={isDark ? 0.4 : 0.5} />
            <circle cx="1060" cy="220" r="3" fill={secondary} opacity={isDark ? 0.8 : 0.75} />
            <circle cx="800" cy="180" r="4" fill={accent} opacity={isDark ? 0.5 : 0.5} />
          </g>
        </svg>
      </div>

      <Container className="relative z-10 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className={`mb-3 text-xs font-bold uppercase tracking-widest ${isDark ? "text-brand-200" : "text-brand-700"}`}>
            {brand.name}
          </p>
          <h1 className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${isDark ? "text-white" : "text-slate-900"}`}>
            Prepare for IELTS, PTE and more — with guidance built around you.
          </h1>
          <p className={`mt-5 max-w-2xl text-lg ${isDark ? "text-slate-200/90" : "text-slate-700"}`}>
            {brand.name} offers IELTS, PTE, Duolingo English Test, CELPIP and Spoken English preparation, plus French and USA/UK interview preparation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/services" className={isDark ? "!bg-brand-500 !text-white hover:!bg-brand-400" : "!bg-brand-600 !text-white hover:!bg-brand-700"}>
              Explore Services
            </LinkButton>
            <LinkButton
              href="/consultation"
              variant="outline"
              className={isDark ? "!border-white/30 !bg-white/5 !text-white hover:!bg-white/10" : "!border-brand-200 !bg-white !text-slate-900 hover:!border-brand-300 hover:!bg-brand-50"}
            >
              Schedule Free Consultation
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

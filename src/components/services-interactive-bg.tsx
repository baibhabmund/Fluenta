"use client";

import { useEffect, useRef } from "react";

import { useTheme } from "@/components/theme-provider";

export function ServicesInteractiveBackground() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const svg = container.querySelector("svg");
    const highlight = container.querySelector("#svcMouseHighlight");
    const pLayerBack = container.querySelector("#svcParallaxBack");
    const pLayerFront = container.querySelector("#svcParallaxFront");
    const particleGroup = container.querySelector("#svcParticles");
    const connections = container.querySelector("#svcConnections");
    const wave1 = container.querySelector("#svcWave1");
    const wave2 = container.querySelector("#svcWave2");

    if (!svg || !highlight || !pLayerBack || !pLayerFront || !particleGroup || !connections || !wave1 || !wave2) {
      return;
    }

    const svcStop0 = container.querySelector("#svcStop0");
    const svcStop1 = container.querySelector("#svcStop1");
    const svcStop2 = container.querySelector("#svcStop2");
    const auraStop0 = container.querySelector("#auraStop0");
    const svcGridDot = container.querySelector("#svcGridDot");

    if (!svcStop0 || !svcStop1 || !svcStop2 || !auraStop0 || !svcGridDot) {
      return;
    }

    const svcStop0El = svcStop0 as SVGStopElement;
    const svcStop1El = svcStop1 as SVGStopElement;
    const svcStop2El = svcStop2 as SVGStopElement;
    const auraStop0El = auraStop0 as SVGStopElement;
    const svcGridDotEl = svcGridDot as SVGCircleElement;

    const svgEl = svg as SVGSVGElement;
    const highlightEl = highlight as SVGCircleElement;
    const backLayer = pLayerBack as SVGGElement;
    const frontLayer = pLayerFront as SVGGElement;
    const connectionsEl = connections as SVGGElement;
    const wave1El = wave1 as SVGPathElement;
    const wave2El = wave2 as SVGPathElement;

    const width = 1400;
    const height = 700;
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let time = 0;
    let frameId = 0;

    const particles: Array<{
      el: SVGCircleElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      speedFactor: number;
    }> = [];

    function updateThemeGradients() {
      if (isDark) {
        svcStop0El.setAttribute("stop-color", "#14b8a6");
        svcStop0El.setAttribute("stop-opacity", "0.22");
        svcStop1El.setAttribute("stop-color", "#0d9488");
        svcStop1El.setAttribute("stop-opacity", "0.06");
        svcStop2El.setAttribute("stop-color", "#070c17");

        auraStop0El.setAttribute("stop-color", "#2dd4bf");
        auraStop0El.setAttribute("stop-opacity", "0.12");

        svcGridDotEl.setAttribute("fill", "#14b8a6");
        svcGridDotEl.setAttribute("opacity", "0.12");
      } else {
        svcStop0El.setAttribute("stop-color", "#0d9488");
        svcStop0El.setAttribute("stop-opacity", "0.15");
        svcStop1El.setAttribute("stop-color", "#2dd4bf");
        svcStop1El.setAttribute("stop-opacity", "0.04");
        svcStop2El.setAttribute("stop-color", "#f0fdfa");

        auraStop0El.setAttribute("stop-color", "#0d9488");
        auraStop0El.setAttribute("stop-opacity", "0.10");

        svcGridDotEl.setAttribute("fill", "#0d9488");
        svcGridDotEl.setAttribute("opacity", "0.12");
      }

      particles.forEach((p, index) => {
        p.el.setAttribute(
          "fill",
          isDark ? (index % 3 === 0 ? "#f0fdfa" : "#14b8a6") : (index % 3 === 0 ? "#0f766e" : "#0d9488")
        );
      });
    }

    for (let i = 0; i < 35; i++) {
      let startX = Math.random() < 0.5 ? Math.random() * 300 : 1100 + Math.random() * 300;
      if (Math.random() < 0.3) startX = Math.random() * width;

      const startY = Math.random() * height;
      const radius = Math.random() * 2.5 + 1.2;
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", String(radius));
      circle.setAttribute("opacity", String(Math.random() * 0.5 + 0.3));
      particleGroup.appendChild(circle);

      particles.push({
        el: circle,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius,
        speedFactor: Math.random() * 1.2 + 0.6,
      });
    }

    updateThemeGradients();

    function onMouseMove(event: MouseEvent) {
      const rect = svgEl.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      mouse.targetX = (event.clientX - rect.left) * scaleX;
      mouse.targetY = (event.clientY - rect.top) * scaleY;
    }

    window.addEventListener("mousemove", onMouseMove);

    function animate() {
      time += 0.008;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      highlightEl.setAttribute("cx", String(mouse.x));
      highlightEl.setAttribute("cy", String(mouse.y));

      const dx = (mouse.x - width / 2) * 0.015;
      const dy = (mouse.y - height / 2) * 0.015;
      backLayer.setAttribute("transform", `translate(${-dx}, ${-dy})`);
      frontLayer.setAttribute("transform", `translate(${dx * 1.4}, ${dy * 1.4})`);

      let w1 = `M 0 ${120 + Math.sin(time) * 12}`;
      let w2 = `M 0 ${150 + Math.cos(time * 0.8) * 10}`;

      for (let x = 0; x <= width; x += 100) {
        const mDist = Math.max(0, (300 - Math.abs(x - mouse.x)) / 300);
        const yOffset = mDist * (mouse.y - 150) * 0.2;

        const y1 = 120 + Math.sin(time + x * 0.003) * 25 + yOffset;
        const y2 = 150 + Math.cos(time * 0.7 + x * 0.004) * 20 - yOffset;
        w1 += ` Q ${x + 50} ${y1}, ${x + 100} ${y1}`;
        w2 += ` Q ${x + 50} ${y2}, ${x + 100} ${y2}`;
      }
      wave1El.setAttribute("d", w1);
      wave2El.setAttribute("d", w2);

      let linkLines = "";
      const baseOpacityMultiplier = isDark ? 0.2 : 0.14;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx * p.speedFactor;
        p.y += p.vy * p.speedFactor;

        if (p.x < 10 || p.x > width - 10) p.vx *= -1;
        if (p.y < 10 || p.y > height - 10) p.vy *= -1;

        const mDx = mouse.x - p.x;
        const mDy = mouse.y - p.y;
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

        if (mDist < 130) {
          const force = (130 - mDist) / 130;
          p.x -= (mDx / mDist) * force * 2.5;
          p.y -= (mDy / mDist) * force * 2.5;
        }

        p.el.setAttribute("cx", String(p.x));
        p.el.setAttribute("cy", String(p.y));

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < 110) {
            const opacity = (1 - dist / 110) * baseOpacityMultiplier;
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
  }, [isDark]);

  return (
    <div ref={ref} className="services-interactive-bg" id="servicesBgInteractive" aria-hidden="true">
      <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="serviceCursorGlow" cx="50%" cy="50%" r="50%">
            <stop id="svcStop0" offset="0%" stopColor={isDark ? "#14b8a6" : "#0d9488"} stopOpacity={isDark ? 0.22 : 0.15} />
            <stop id="svcStop1" offset="50%" stopColor={isDark ? "#0d9488" : "#2dd4bf"} stopOpacity={isDark ? 0.06 : 0.04} />
            <stop id="svcStop2" offset="100%" stopColor={isDark ? "#050b14" : "#f0fdfa"} stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cardAura" cx="50%" cy="50%" r="50%">
            <stop id="auraStop0" offset="0%" stopColor={isDark ? "#2dd4bf" : "#0d9488"} stopOpacity={isDark ? 0.12 : 0.1} />
            <stop id="auraStop1" offset="100%" stopColor={isDark ? "#14b8a6" : "#0d9488"} stopOpacity="0" />
          </radialGradient>

          <pattern id="servicesDotGrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle id="svcGridDot" cx="2" cy="2" r="1.2" fill={isDark ? "#14b8a6" : "#0d9488"} opacity={isDark ? 0.12 : 0.12} />
          </pattern>

          <filter id="auraBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill={isDark ? "#070c17" : "#f0fdfa"} className="svc-theme-bg" />
        <rect width="100%" height="100%" fill="url(#servicesDotGrid)" />

        <g filter="url(#auraBlur)">
          <circle cx="280" cy="380" r="180" fill="url(#cardAura)" />
          <circle cx="700" cy="380" r="220" fill="url(#cardAura)" />
          <circle cx="1120" cy="380" r="180" fill="url(#cardAura)" />
        </g>

        <g id="svcParallaxBack" style={{ transformOrigin: "center", transition: "transform 0.2s ease-out" }}>
          <g fill={isDark ? "#14b8a6" : "#0d9488"} opacity={isDark ? 0.18 : 0.22}>
            <rect x="40" y="280" width="8" height="40" rx="4" />
            <rect x="55" y="250" width="8" height="70" rx="4" />
            <rect x="70" y="220" width="8" height="100" rx="4" />
            <rect x="1320" y="320" width="8" height="50" rx="4" />
            <rect x="1335" y="290" width="8" height="80" rx="4" />
            <rect x="1350" y="260" width="8" height="110" rx="4" />
          </g>
        </g>

        <circle id="svcMouseHighlight" r="320" fill="url(#serviceCursorGlow)" pointerEvents="none" />
        <path id="svcWave1" fill="none" stroke={isDark ? "#14b8a6" : "#0d9488"} strokeOpacity={isDark ? 0.25 : 0.22} strokeWidth="2" />
        <path id="svcWave2" fill="none" stroke={isDark ? "#f0fdfa" : "#0f766e"} strokeOpacity={isDark ? 0.15 : 0.18} strokeWidth="1.5" strokeDasharray="6 6" />
        <g id="svcConnections" stroke={isDark ? "#14b8a6" : "#0f766e"} strokeWidth="1"></g>
        <g id="svcParticles"></g>

        <g id="svcParallaxFront" style={{ transformOrigin: "center", transition: "transform 0.1s ease-out" }}>
          <g fill={isDark ? "#2dd4bf" : "#0d9488"} opacity="0.7">
            <path d="M 120,140 L 122,145 L 127,147 L 122,149 L 120,154 L 118,149 L 113,147 L 118,145 Z" />
            <path d="M 1280,180 L 1282,185 L 1287,187 L 1282,189 L 1280,194 L 1278,189 L 1273,187 L 1278,185 Z" />
            <path d="M 1220,520 L 1221.5,524 L 1226,525.5 L 1221.5,527 L 1220,531 L 1218.5,527 L 1214,525.5 L 1218.5,524 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { useTheme } from "@/components/theme-provider";
import { Container, LinkButton } from "@/components/ui";
import { brand } from "@/lib/brand";

const SVG_NS = "http://www.w3.org/2000/svg";
const W = 1200;
const H = 600;

type LayerName = "far" | "mid" | "near";

type Spec = {
  text: string;
  x: number;
  y: number;
  size: number;
  layer: LayerName;
  weight: number;
  opacity: number;
  /** 0..1 – how strongly the item follows the cursor (parallax) */
  depth: number;
  drift: number;
  /** 0..1 – how strongly the item reacts to the cursor being close */
  react: number;
  spacing?: number;
  tilt?: number;
  outline?: boolean;
};

type Floater = Spec & {
  el: SVGTextElement;
  cx: number;
  cy: number;
  scale: number;
  lit: number;
  phase: number;
  phase2: number;
  rotBase: number;
  rotAmp: number;
  rotSpeed: number;
  delay: number;
};

type Mote = {
  el: SVGCircleElement;
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  twinkle: number;
  base: number;
  depth: number;
};

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

const LETTERS: ReadonlyArray<readonly [string, number, number, number]> = [
  // Top area
  ["A", 350, 75, 82],
  ["B", 455, 125, 34],
  ["C", 560, 65, 28],
  ["D", 670, 125, 44],
  ["E", 785, 75, 72],
  ["F", 900, 135, 34],
  ["G", 1010, 70, 58],
  ["H", 1125, 125, 38],

  // Upper-middle
  ["I", 390, 220, 30],
  ["J", 500, 185, 55],
  ["K", 620, 245, 28],
  ["L", 735, 195, 42],
  ["M", 850, 245, 32],
  ["N", 960, 190, 62],
  ["O", 1080, 245, 30],
  ["P", 1170, 190, 44],

  // Middle
  ["Q", 350, 330, 42],
  ["R", 455, 290, 30],
  ["S", 570, 350, 68],
  ["T", 690, 300, 34],
  ["U", 805, 355, 52],
  ["V", 920, 305, 30],
  ["W", 1030, 350, 58],
  ["X", 1145, 305, 34],

  // Lower-middle
  ["Y", 400, 435, 38],
  ["Z", 510, 395, 28],
  ["A", 625, 455, 54],
  ["B", 745, 410, 34],
  ["C", 860, 465, 70],
  ["D", 980, 415, 30],
  ["E", 1090, 465, 48],
  ["F", 1180, 415, 32],

  // Bottom area
  ["G", 350, 535, 46],
  ["H", 465, 500, 30],
  ["I", 580, 555, 38],
  ["J", 700, 515, 28],
  ["K", 815, 565, 58],
  ["L", 930, 520, 34],
  ["M", 1045, 570, 50],
  ["N", 1160, 525, 38],
];

const WORDS: ReadonlyArray<readonly [string, number, number, number]> = [
  ["IELTS", 920, 145, 26],
  ["SPEAK", 1060, 390, 20],
  ["LISTEN", 760, 535, 18],
  ["READ", 1140, 215, 18],
  ["WRITE", 690, 180, 16],
];

const GIANTS: ReadonlyArray<readonly [string, number, number, number]> = [
  ["F", 330, 150, 190],
  ["X", 1140, 150, 220],
  ["A", 355, 510, 170],
  ["E", 1160, 510, 190],
];

function buildSpecs(): Spec[] {
  const specs: Spec[] = [];

  LETTERS.forEach(([text, x, y, size], i) => {
    const strong = i % 5 === 0;
    specs.push({
      text,
      x,
      y,
      size,
      layer: size >= 55 ? "near" : size >= 34 ? "mid" : "far",
      weight: i % 4 === 0 ? 700 : 500,
      opacity: strong ? 0.30 : 0.18,
      depth: Math.min(1, 0.3 + (size / 82) * 0.7),
      drift: 6 + ((i * 5) % 8),
      react: 1,
      outline: true,
    });
  });

  WORDS.forEach(([text, x, y, size], i) => {
    specs.push({
      text,
      x,
      y,
      size,
      layer: "mid",
      weight: 600,
      opacity: 0.075,
      depth: 0.5,
      drift: 8,
      react: 0.5,
      spacing: 4,
      tilt: i % 2 === 0 ? -3 : 3,
    });
  });

  GIANTS.forEach(([text, x, y, size], i) => {
    specs.push({
      text,
      x,
      y,
      size,
      layer: "far",
      weight: 800,
      opacity: 0.03,
      depth: 0.18,
      drift: 14,
      react: 0.2,
      tilt: i % 2 === 0 ? -7 : 7,
    });
  });

  return specs;
}

const smooth = (v: number) => {
  const c = Math.max(0, Math.min(1, v));
  return c * c * (3 - 2 * c);
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function FluentXBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const farRef = useRef<SVGGElement | null>(null);
  const midRef = useRef<SVGGElement | null>(null);
  const nearRef = useRef<SVGGElement | null>(null);
  const motesRef = useRef<SVGGElement | null>(null);
  const ambientRef = useRef<SVGGElement | null>(null);
  const glowRef = useRef<SVGCircleElement | null>(null);
  const trailRef = useRef<SVGCircleElement | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const darkRef = useRef(isDark);
  const redrawRef = useRef<(() => void) | null>(null);

  const baseBg = isDark ? "#061018" : "#f0fdfa";
  const accent = isDark ? "#14b8a6" : "#0d9488";
  const accentLight = isDark ? "#2dd4bf" : "#14b8a6";

  const shellStyle = {
    background: isDark
      ? "linear-gradient(135deg, #061018 0%, #081923 48%, #06141d 100%)"
      : "linear-gradient(135deg, #f0fdfa 0%, #ecfeff 42%, #f8fafc 100%)",
    "--fx-accent": accent,
    "--fx-accent-light": accentLight,
  } as CSSProperties;

  /* Theme changes only update a ref – the animation keeps running and
     fades between the two looks instead of rebuilding everything. */
  useEffect(() => {
    darkRef.current = isDark;
    redrawRef.current?.();
  }, [isDark]);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    const far = farRef.current;
    const mid = midRef.current;
    const near = nearRef.current;
    const motesGroup = motesRef.current;
    const ambient = ambientRef.current;
    const glow = glowRef.current;
    const trail = trailRef.current;

    if (!section || !svg || !far || !mid || !near || !motesGroup || !ambient || !glow || !trail) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layers: Record<LayerName, SVGGElement> = { far, mid, near };

    /* ---------- build floating text ---------- */
    const floaters: Floater[] = buildSpecs().map((spec, i) => {
      const el = document.createElementNS(SVG_NS, "text");
      el.textContent = spec.text;
      el.setAttribute("font-size", String(spec.size));
      el.setAttribute("font-family", "Inter, Arial, sans-serif");
      el.setAttribute("font-weight", String(spec.weight));
      el.setAttribute("text-anchor", "middle");
      el.setAttribute("dominant-baseline", "middle");
      if (spec.spacing) el.setAttribute("letter-spacing", String(spec.spacing));
      el.style.fill = i % 5 === 0 || spec.spacing ? "var(--fx-accent-light)" : "var(--fx-accent)";
      if (spec.outline) {
        el.style.stroke = "var(--fx-accent-light)";
        el.setAttribute("stroke-width", "1.2");
        el.setAttribute("stroke-opacity", "0");
      }
      el.setAttribute("opacity", "0");
      layers[spec.layer].appendChild(el);

      return {
        ...spec,
        el,
        cx: spec.x,
        cy: spec.y + 18,
        scale: 1,
        lit: 0,
        phase: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        rotBase: spec.tilt ?? Math.random() * 12 - 6,
        rotAmp: spec.layer === "far" && spec.size > 100 ? 1.5 : 2.5 + Math.random() * 3,
        rotSpeed: 0.25 + Math.random() * 0.25,
        delay: i * 0.05,
      };
    });

    /* ---------- build floating motes (soft bokeh dust) ---------- */
    const motes: Mote[] = Array.from({ length: 18 }, () => {
      const el = document.createElementNS(SVG_NS, "circle");
      const r = 1.2 + Math.random() * 2.6;
      el.setAttribute("r", r.toFixed(2));
      el.style.fill = "var(--fx-accent-light)";
      el.setAttribute("opacity", "0");
      motesGroup.appendChild(el);
      return {
        el,
        x: Math.random() * W,
        y: Math.random() * H,
        r,
        speed: 5 + Math.random() * 9,
        sway: 6 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.6 + Math.random() * 1.2,
        base: 0.3 + Math.random() * 0.3,
        depth: 0.3 + Math.random() * 0.7,
      };
    });

    /* ---------- state ---------- */
    let t = 0;
    let opScale = darkRef.current ? 1 : 0.68;
    let strength = 0.55;

    const cursor = { x: W / 2, y: H / 2 };
    const trailPos = { x: W / 2, y: H / 2 };
    const pointer = { x: W / 2, y: H / 2, inside: false, t: -100 };

    /* ---------- one animation step ---------- */
    const step = (dt: number) => {
      t += dt;
      const k = (rate: number) => 1 - Math.exp(-rate * dt);

      // Theme fade (frame-rate independent)
      const targetScale = darkRef.current ? 1 : 0.68;
      opScale = reduced ? targetScale : opScale + (targetScale - opScale) * k(3);

      // Cursor target: real pointer, or a gentle autopilot when idle / on touch.
      const idle = !pointer.inside || t - pointer.t > 3;
      const tx = idle ? W / 2 + Math.sin(t * 0.23) * 380 + Math.sin(t * 0.09 + 1) * 120 : pointer.x;
      const ty = idle ? H / 2 + Math.cos(t * 0.19) * 190 : pointer.y;

      cursor.x += (tx - cursor.x) * k(idle ? 1.2 : 5);
      cursor.y += (ty - cursor.y) * k(idle ? 1.2 : 5);
      trailPos.x += (cursor.x - trailPos.x) * k(1.3);
      trailPos.y += (cursor.y - trailPos.y) * k(1.3);
      strength += ((idle ? 0.55 : 1) - strength) * k(2);

      const nx = (cursor.x - W / 2) / (W / 2);
      const ny = (cursor.y - H / 2) / (H / 2);

      // Light that follows the cursor (+ a slower trailing halo)
      glow.setAttribute("cx", cursor.x.toFixed(1));
      glow.setAttribute("cy", cursor.y.toFixed(1));
      glow.setAttribute("r", (230 + Math.sin(t * 0.9) * 10).toFixed(1));
      trail.setAttribute("cx", trailPos.x.toFixed(1));
      trail.setAttribute("cy", trailPos.y.toFixed(1));

      // Ambient glow drifts + breathes
      ambient.setAttribute(
        "transform",
        `translate(${(nx * 32 + Math.sin(t * 0.13) * 20).toFixed(1)} ${(ny * 22 + Math.cos(t * 0.11) * 14).toFixed(1)})`,
      );
      ambient.setAttribute("opacity", (0.85 + 0.15 * Math.sin(t * 0.5)).toFixed(3));

      // Letters & words
      const RADIUS = 240;
      for (const f of floaters) {
        const intro = smooth((t - f.delay) / 1.4);

        const fx = Math.sin(t * 0.5 + f.phase) * f.drift + Math.sin(t * 0.23 + f.phase2) * f.drift * 0.5;
        const fy = Math.cos(t * 0.42 + f.phase2) * f.drift * 0.6 + Math.sin(t * 0.19 + f.phase) * f.drift * 0.3;

        let targetX = f.x + nx * f.depth * 62 + fx;
        let targetY = f.y + ny * f.depth * 42 + fy + (1 - intro) * 18;

        // Proximity to the cursor: nudge away, scale up, light up
        const dx = f.cx - cursor.x;
        const dy = f.cy - cursor.y;
        const dist = Math.hypot(dx, dy) || 1;
        const infl = smooth(1 - dist / RADIUS) * f.react * strength;
        const ux = dx / dist;
        const uy = dy / dist;

        targetX += ux * infl * infl * 30;
        targetY += uy * infl * infl * 30;

        f.cx += (targetX - f.cx) * k(4.5);
        f.cy += (targetY - f.cy) * k(4.5);
        f.scale += (1 + 0.32 * infl - f.scale) * k(6);
        f.lit += (infl - f.lit) * k(5);

        const rot = f.rotBase + Math.sin(t * f.rotSpeed + f.phase) * f.rotAmp + ux * 8 * f.lit;

        f.el.setAttribute(
          "transform",
          `translate(${f.cx.toFixed(2)} ${f.cy.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${f.scale.toFixed(3)})`,
        );

        const breathing = Math.sin(t * 0.6 + f.phase) * 0.01;
        const opacity = (Math.max(0.02, f.opacity + breathing) + f.lit * 0.2) * opScale * intro;
        f.el.setAttribute("opacity", opacity.toFixed(3));

        if (f.outline) {
          f.el.setAttribute("stroke-opacity", (f.lit * 0.55 * opScale * intro).toFixed(3));
        }
      }

      // Motes
      const moteIntro = smooth(t / 2.5);
      for (const m of motes) {
        m.y -= m.speed * dt;
        if (m.y < -10) {
          m.y = H + 10;
          m.x = Math.random() * W;
        }
        const x = m.x + Math.sin(t * 0.4 + m.phase) * m.sway + nx * m.depth * 30;
        const y = m.y + ny * m.depth * 20;
        const tw = 0.55 + 0.45 * Math.sin(t * m.twinkle + m.phase);
        m.el.setAttribute("cx", x.toFixed(1));
        m.el.setAttribute("cy", y.toFixed(1));
        m.el.setAttribute("opacity", (m.base * tw * opScale * moteIntro).toFixed(3));
      }
    };

    /* ---------- loop control (pauses off-screen / hidden tab) ---------- */
    let raf = 0;
    let last = 0;
    let visible = true;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
    };
    const start = () => {
      if (raf || reduced || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    /* ---------- pointer (mouse, pen and touch) ---------- */
    const onMove = (e: PointerEvent) => {
      const m = svg.getScreenCTM();
      if (!m) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.inside = true;
      pointer.t = t;
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    if (reduced) {
      // Static, fully-visible frame; no animation or pointer tracking.
      step(6);
      redrawRef.current = () => step(0.0001);
    } else {
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave);
      section.addEventListener("pointercancel", onLeave);
      section.addEventListener("pointerup", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(section);

    start();

    return () => {
      stop();
      observer.disconnect();
      redrawRef.current = null;
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointercancel", onLeave);
      section.removeEventListener("pointerup", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      far.replaceChildren();
      mid.replaceChildren();
      near.replaceChildren();
      motesGroup.replaceChildren();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="fluentx-hero-shell relative isolate overflow-hidden"
      style={shellStyle}
    >
      <div className="fluentx-banner-bg pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="mouseAlphabetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentLight} stopOpacity={isDark ? 0.24 : 0.12} />
              <stop offset="40%" stopColor={accent} stopOpacity={isDark ? 0.09 : 0.05} />
              <stop offset="100%" stopColor={baseBg} stopOpacity="0" />
            </radialGradient>

            <radialGradient id="ambientAlphabetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity={isDark ? 0.11 : 0.06} />
              <stop offset="55%" stopColor={accentLight} stopOpacity={isDark ? 0.035 : 0.02} />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>

            {/* Keeps the left side (behind the headline) calmer */}
            <linearGradient id="fxReadability" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={baseBg} stopOpacity="0.5" />
              <stop offset="55%" stopColor={baseBg} stopOpacity="0.15" />
              <stop offset="100%" stopColor={baseBg} stopOpacity="0" />
            </linearGradient>

            <pattern id="microDots" width="55" height="55" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.65" fill={accent} opacity={isDark ? 0.045 : 0.035} />
            </pattern>

            <filter id="blurLarge">
              <feGaussianBlur stdDeviation="40" />
            </filter>
            <filter id="blurMedium">
              <feGaussianBlur stdDeviation="22" />
            </filter>

            {/* Depth of field for the far / near letter layers */}
            <filter id="fxBlurFar" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="1000">
              <feGaussianBlur stdDeviation="0.8" />
            </filter>
            <filter id="fxBlurNear" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="1000">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>

          {/* Base background */}
          <rect width={W} height={H} fill={baseBg} />

          {/* Very subtle texture */}
          <rect width={W} height={H} fill="url(#microDots)" />

          {/* Ambient light */}
          <g ref={ambientRef}>
            <ellipse cx="925" cy="275" rx="350" ry="260" fill="url(#ambientAlphabetGlow)" filter="url(#blurLarge)" />
            <ellipse cx="750" cy="500" rx="240" ry="130" fill={accent} opacity={isDark ? 0.025 : 0.015} filter="url(#blurMedium)" />
            <ellipse cx="1080" cy="120" rx="180" ry="140" fill={accentLight} opacity={isDark ? 0.025 : 0.015} filter="url(#blurMedium)" />
          </g>

          {/* Slow trailing halo + cursor light */}
          <circle ref={trailRef} cx="600" cy="300" r="360" fill="url(#ambientAlphabetGlow)" opacity="0.7" />
          <circle ref={glowRef} cx="600" cy="300" r="230" fill="url(#mouseAlphabetGlow)" />

          {/* Floating dust */}
          <g ref={motesRef} />

          {/* Letters – three depth layers */}
          <g ref={farRef} filter="url(#fxBlurFar)" />
          <g ref={midRef} />
          <g ref={nearRef} filter="url(#fxBlurNear)" />

          {/* Readability veil */}
          <rect width={W} height={H} fill="url(#fxReadability)" />
        </svg>
      </div>

      {/* Hero content */}
      <Container className="relative z-10 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p
            className={`mb-3 text-xs font-bold uppercase tracking-widest ${
              isDark ? "text-brand-200" : "text-brand-700"
            }`}
          >
            {brand.name}
          </p>

          <h1
            className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Prepare for IELTS, PTE and more — with guidance built around you.
          </h1>

          <p
            className={`mt-5 max-w-2xl text-lg ${
              isDark ? "text-slate-200/90" : "text-slate-700"
            }`}
          >
            {brand.name} offers IELTS, PTE, Duolingo English Test, CELPIP and Spoken English
            preparation, plus French and USA/UK interview preparation.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton
              href="/services"
              className={
                isDark
                  ? "!bg-brand-500 !text-white hover:!bg-brand-400"
                  : "!bg-brand-600 !text-white hover:!bg-brand-700"
              }
            >
              Explore Services
            </LinkButton>

            <LinkButton
              href="/consultation"
              variant="outline"
              className={
                isDark
                  ? "!border-white/30 !bg-white/5 !text-white hover:!bg-white/10"
                  : "!border-brand-200 !bg-white !text-slate-900 hover:!border-brand-300 hover:!bg-brand-50"
              }
            >
              Schedule Free Consultation
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
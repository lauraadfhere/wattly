"use client";

import { useEffect, useMemo, useRef } from "react";

type LetterSpec = {
  char: string;
  /** Index 0…N along the wave */
  index: number;
  size: number;
  phase: number;
  row: number;
};

/** Full A–Z (numbered order) + lowercase companions — wave field, no circle. */
function buildWaveAlphabet(): LetterSpec[] {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const letters: LetterSpec[] = [];

  upper.forEach((char, i) => {
    letters.push({
      char,
      index: i,
      size: i % 4 === 0 ? 2.4 : i % 3 === 0 ? 1.7 : 1.15,
      phase: i * 0.38,
      row: 0,
    });
    // Small lowercase under every other letter
    if (i % 2 === 0) {
      letters.push({
        char: char.toLowerCase(),
        index: i,
        size: 0.75 + (i % 3) * 0.1,
        phase: i * 0.38 + 1.2,
        row: 1,
      });
    }
  });

  // ABCD accent cluster (still in alphabet order art)
  ["A", "B", "C", "D"].forEach((char, i) => {
    letters.push({
      char,
      index: i,
      size: 2.8 - i * 0.25,
      phase: i * 0.5,
      row: -1,
    });
  });

  return letters;
}

export default function HeroWaveLetters() {
  const letters = useMemo(() => buildWaveAlphabet(), []);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.45, active: false });
  const smooth = useRef({ x: 0.5, y: 0.45, active: 0 });
  const raf = useRef<number>(0);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const pad = 48;
      const inside =
        event.clientX >= rect.left - pad &&
        event.clientX <= rect.right + pad &&
        event.clientY >= rect.top - pad &&
        event.clientY <= rect.bottom + pad;

      if (!inside) {
        pointer.current.active = false;
        return;
      }

      pointer.current = {
        active: true,
        x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      };
    };

    const tick = (time: number) => {
      const t = time * 0.001;
      const want = pointer.current.active ? 1 : 0;
      smooth.current.active += (want - smooth.current.active) * 0.09;
      const idleX = 0.55 + Math.sin(t * 0.35) * 0.08;
      const idleY = 0.45 + Math.cos(t * 0.28) * 0.06;
      const targetX = pointer.current.active ? pointer.current.x : idleX;
      const targetY = pointer.current.active ? pointer.current.y : idleY;
      smooth.current.x += (targetX - smooth.current.x) * 0.1;
      smooth.current.y += (targetY - smooth.current.y) * 0.1;

      const mx = smooth.current.x;
      const my = smooth.current.y;
      const interact = smooth.current.active;
      const w = stage.clientWidth;
      const h = stage.clientHeight;

      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const spec = letters[i];
        if (!spec) return;

        // Layout: A–Z left→right; right edge stops at burger (stage end)
        const along = spec.index / 25;
        const baseX = 0.04 + along * 0.92;
        const waveAmp = reduceMotion ? 8 : 22 + interact * 18;
        const wave =
          Math.sin(along * Math.PI * 2.2 + t * 1.35 + spec.phase) * waveAmp +
          Math.cos(along * Math.PI * 1.1 + t * 0.9) * (waveAmp * 0.35);

        const rowOffset =
          spec.row === -1 ? -h * 0.16 : spec.row === 1 ? h * 0.07 : 0;

        // Follow mouse: wave peak leans toward pointer
        const pullX = (mx - along) * w * 0.12 * (0.25 + interact * 0.9);
        const pullY = (my - 0.5) * h * 0.22 * (0.2 + interact * 0.95);

        // Keep centers inside the stage so the ribbon stops at the burger edge
        const x = Math.min(w - 8, Math.max(8, baseX * w + pullX));
        const y = h * 0.54 + wave + rowOffset + pullY;

        const dist = Math.hypot(along - mx, (y / h) - my);
        const near = Math.max(0, 1 - dist * 1.6);
        const boost = 1 + near * interact * 0.55;

        const depth = 0.55 + Math.sin(along * Math.PI + t + spec.phase) * 0.2;
        const tiltY = (mx - along) * (18 + interact * 28);
        const tiltX = (my - 0.5) * (-14 - interact * 20);
        const rotZ =
          Math.sin(along * Math.PI * 2 + t + spec.phase) * (6 + interact * 8);

        const idleOpacity = 0.28 + depth * 0.25;
        const hotOpacity = 0.45 + near * 0.5;
        const opacity = idleOpacity + (hotOpacity - idleOpacity) * interact;

        el.style.transform = [
          "translate(-50%, -50%)",
          `translate3d(${x}px, ${y}px, ${depth * 40}px)`,
          `rotateX(${tiltX}deg)`,
          `rotateY(${tiltY}deg)`,
          `rotateZ(${rotZ}deg)`,
          `scale(${boost * (0.9 + depth * 0.15)})`,
        ].join(" ");
        el.style.opacity = String(Math.min(0.95, opacity * (0.75 + near * interact * 0.4)));
        el.style.zIndex = String(Math.round(20 + near * interact * 80 + depth * 20));
      });

      raf.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(raf.current);
    };
  }, [letters]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {/* Same max-w + end inset as HeroActions so the ribbon stops at the burger */}
      <div className="relative mx-auto h-full w-full max-w-6xl">
        <div
          ref={stageRef}
          className="absolute top-[18%] bottom-[6%] end-4 w-[min(100%,36rem)] overflow-hidden sm:end-8 sm:w-[min(100%,40rem)] lg:end-12 lg:w-[min(100%,44rem)]"
          style={{ perspective: "900px", transformStyle: "preserve-3d" }}
        >
          {letters.map((spec, index) => (
            <span
              key={`${spec.char}-${spec.row}-${index}`}
              ref={(node) => {
                letterRefs.current[index] = node;
              }}
              className="hero-wave-letter absolute left-0 top-0 select-none font-bold leading-none text-white"
              style={{
                fontSize: `${spec.size}rem`,
                fontFamily: '"Times New Roman", Times, serif',
                fontWeight: 700,
                textShadow: [
                  "0 1px 0 rgba(255,255,255,0.95)",
                  "0 2px 0 rgba(210,215,230,0.8)",
                  "0 3px 0 rgba(150,155,175,0.45)",
                  "0 6px 14px rgba(0,0,0,0.28)",
                  "0 0 16px rgba(255,255,255,0.18)",
                ].join(", "),
                opacity: 0.3,
                willChange: "transform, opacity",
                transformStyle: "preserve-3d",
              }}
            >
              {spec.char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

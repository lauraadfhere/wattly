"use client";

import { useEffect, useMemo, useRef } from "react";

type WordSpec = {
  word: string;
  lat: number;
  lon: number;
  size: number;
  phase: number;
};

const GLOBE_WORDS = [
  "learn", "speak", "listen", "read", "write", "word", "sound", "voice",
  "calm", "clear", "practice", "lesson", "level", "path", "progress",
  "english", "wattly", "teacher", "student", "kids", "adults", "story",
  "book", "audio", "live", "remote", "caption", "fluent", "alphabet",
  "hello", "world", "share", "grow", "focus", "start", "next", "again",
  "a", "to", "and", "the", "you", "with", "from", "for", "of", "in",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

function buildWordEarth(ringCount = 32, basePerRing = 28): WordSpec[] {
  const specs: WordSpec[] = [];
  let wi = 0;

  for (let r = 0; r < ringCount; r += 1) {
    const lat = -0.94 + (r / (ringCount - 1)) * 1.88;
    const ringR = Math.sqrt(Math.max(0.04, 1 - lat * lat));
    const count = Math.max(8, Math.round(basePerRing * (0.4 + ringR * 0.85)));

    for (let i = 0; i < count; i += 1) {
      const lon = (i / count) * Math.PI * 2 + r * 0.08;
      const word = GLOBE_WORDS[wi % GLOBE_WORDS.length]!;
      specs.push({
        word,
        lat,
        lon,
        size: word.length === 1 ? 0.5 + ringR * 0.1 : 0.44 + ringR * 0.08,
        phase: r * 0.2 + i * 0.05,
      });
      wi += 1;
    }
  }

  return specs;
}

export default function HeroWaveLetters() {
  const words = useMemo(() => buildWordEarth(32, 28), []);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false, nx: 0, ny: 0 });
  const smooth = useRef({ x: 0.5, y: 0.5, active: 0, nx: 0, ny: 0 });
  const spinAngle = useRef(0);
  const raf = useRef<number>(0);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const pad = 48;
      const inside =
        event.clientX >= rect.left - pad &&
        event.clientX <= rect.right + pad &&
        event.clientY >= rect.top - pad &&
        event.clientY <= rect.bottom + pad;

      pointer.current.active = inside;
      if (!inside) return;

      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      pointer.current.x = x;
      pointer.current.y = y;
      pointer.current.nx = (x - 0.5) * 2;
      pointer.current.ny = (y - 0.5) * 2;
    };

    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;

      const w = stage.clientWidth;
      const h = stage.clientHeight;
      // Skip until stage has real size — prevents words collapsing / vanishing
      if (w < 40 || h < 40) {
        raf.current = window.requestAnimationFrame(tick);
        return;
      }

      const want = pointer.current.active ? 1 : 0;
      smooth.current.active += (want - smooth.current.active) * 0.08;
      smooth.current.x += (pointer.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (pointer.current.y - smooth.current.y) * 0.1;
      smooth.current.nx += (pointer.current.nx - smooth.current.nx) * 0.1;
      smooth.current.ny += (pointer.current.ny - smooth.current.ny) * 0.1;

      const interact = smooth.current.active;
      const mx = smooth.current.x;
      const my = smooth.current.y;
      const pnx = smooth.current.nx;
      const pny = smooth.current.ny;

      const rollSpeed = reduceMotion ? 0 : interact * 0.85;
      spinAngle.current += rollSpeed * dt;

      const radius = Math.min(w, h) * 0.42;
      const cx = w * 0.5;
      const cy = h * 0.5;

      const tiltY = (mx - 0.5) * interact * 0.4;
      const tiltX = (my - 0.5) * interact * 0.28;
      const rotY = spinAngle.current + tiltY;
      const rotX = 0.05 + tiltX;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const spec = words[i];
        if (!spec) return;

        const ringR = Math.sqrt(Math.max(0, 1 - spec.lat * spec.lat));
        const px = Math.cos(spec.lon) * ringR;
        const py = spec.lat;
        const pz = Math.sin(spec.lon) * ringR;

        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const screenX = cx + x1 * radius;
        const screenY = cy + y2 * radius;
        const dx = screenX / w - mx;
        const dy = screenY / h - my;
        const dist = Math.hypot(dx, dy);
        const near = Math.max(0, 1 - dist * 3) * interact;
        const place = near * near;

        const bulge = 1 + place * 0.14;
        const slideX = pnx * place * radius * 0.03;
        const slideY = pny * place * radius * 0.03;

        const sx = cx + x1 * radius * bulge + slideX;
        const sy = cy + y2 * radius * bulge + slideY;
        const depth = z2;

        // Front stays solid white; back stays faintly visible — never zero
        const front = Math.max(0.15, (depth + 1) / 2);
        const shade = 0.5 + front * 0.5;
        const scale = Math.max(0.55, (0.82 + front * 0.28) * (1 + place * 0.22));

        el.style.transform = [
          "translate(-50%, -50%)",
          `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, ${(depth * radius * 0.35).toFixed(2)}px)`,
          `scale(${scale.toFixed(3)})`,
        ].join(" ");
        el.style.opacity = String(Math.max(0.35, Math.min(1, shade)));
        el.style.zIndex = String(Math.round(40 + depth * 80 + place * 30));
      });

      raf.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(raf.current);
    };
  }, [words]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      <div className="relative mx-auto h-full w-full max-w-6xl">
        <div
          ref={stageRef}
          className="pointer-events-auto absolute top-[12%] bottom-[10%] end-3 aspect-square w-[min(80%,24rem)] overflow-visible sm:end-8 sm:w-[min(62%,28rem)] lg:end-10 lg:w-[min(52%,32rem)]"
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          {words.map((spec, index) => (
            <span
              key={`${spec.word}-${index}`}
              ref={(node) => {
                wordRefs.current[index] = node;
              }}
              className="hero-wave-letter absolute left-0 top-0 select-none leading-none text-white"
              style={{
                fontSize: `${spec.size}rem`,
                fontFamily: '"Times New Roman", Times, serif',
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#ffffff",
                textShadow: "0 1px 2px rgba(0,0,40,0.25)",
                opacity: 0.9,
                willChange: "transform, opacity",
                transformStyle: "preserve-3d",
                whiteSpace: "nowrap",
              }}
            >
              {spec.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

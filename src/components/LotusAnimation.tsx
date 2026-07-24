import { useEffect, useRef } from "react";

/* ---------- Single Lotus Petal (SVG) ---------- */
const Petal = () => (
  <svg width="60" height="90" viewBox="0 0 60 90" className="block">
    <defs>
      <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFB6C1" />
        <stop offset="100%" stopColor="#FF69B4" />
      </linearGradient>
    </defs>
    <path
      d="
        M30 5
        C46 22, 56 48, 30 85
        C4 48, 14 22, 30 5
        Z
      "
      fill="url(#petalGradient)"
      stroke="#FF1493"
      strokeWidth="1"
    />
  </svg>
);

/* ---------- Lotus Animation Component ---------- */
export const LotusAnimation = () => {
  const lotusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!lotusRef.current) return;

      const t = Math.min(
        window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight),
        1,
      );

      lotusRef.current
        .querySelectorAll<HTMLElement>(".petal")
        .forEach((petal) => {
          const side = Number(petal.dataset.side);
          const layer = Number(petal.dataset.layer);

          const progress = Math.max(0, Math.min(1, t - layer * 0.15));

          const x = side * progress * (30 + layer * 15);
          const y = -progress * (10 + layer * 6);
          const rotate = side * progress * (20 + layer * 5);
          const scale = 0.8 + progress * 0.25;

          petal.style.transform = `
            translate(${x}px, ${y}px)
            rotate(${rotate}deg)
            scale(${scale})
          `;
        });
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-[-40px] z-40 pointer-events-none"
      style={{ transform: "translateX(42vw)" }}
    >
      <div ref={lotusRef} className="relative ">
        {/* ---------- Back Layer (2 petals) ---------- */}
        {[-1, 1].map((side, i) => (
          <div
            key={`back-${i}`}
            className="petal absolute left-1/2 bottom-0 -translate-x-1/2"
            data-side={side}
            data-layer={0}
            style={{ zIndex: 1 }}
          >
            <Petal />
          </div>
        ))}

        {/* ---------- Middle Layer (4 petals) ---------- */}
        {[-1, 1, -1, 1].map((side, i) => (
          <div
            key={`mid-${i}`}
            className="petal absolute left-1/2 bottom-0 -translate-x-1/2"
            data-side={side}
            data-layer={1}
            style={{ zIndex: 5 }}
          >
            <Petal />
          </div>
        ))}

        {/* ---------- Center Petal ---------- */}
        <div
          className="petal absolute left-1/2 bottom-0 -translate-x-1/2"
          data-side={0}
          data-layer={2}
          style={{ zIndex: 10 }}
        >
          <Petal />
        </div>
      </div>
    </div>
  );
};

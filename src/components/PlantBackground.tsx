/**
 * PlantBackground — Artistic money plant parallax
 *
 * Pure SVG leaves (no photos, no blend mode, no checkers).
 * 3 parallax depth layers — each moves at a different scroll speed
 * creating genuine depth. Layer 0 = far/slow, Layer 2 = close/fast.
 *
 * Layout: leaves clustered at the 4 corners + edges of the viewport,
 * never covering the centre content area.
 */

import { useEffect, useRef } from "react";

// ── Money plant leaf SVG paths (centered at 0,0) ─────────────────────────
// Tip at top, stem notch at bottom — characteristic pothos silhouette
const LEAF_BODY = `
  M 0,-54
  C 8,-54 26,-44 28,-24
  C 30,-4  26,18  18,32
  C 10,44  3,52   0,57
  C -3,52 -10,44 -18,32
  C -26,18 -30,-4 -28,-24
  C -26,-44 -8,-54 0,-54 Z
`;
const MIDRIB = "M 0,-54 C 0.5,-10 0.5,30 0,57";
const VEINS = [
  "M 0,-34 C -10,-22 -18,-10 -18,2",
  "M 0,-14 C -16,-2  -20,12  -17,24",
  "M 0, 8  C -10,16  -14,28  -10,36",
  "M 0,-34 C  10,-22  18,-10  18,2",
  "M 0,-14 C  16,-2   20,12   17,24",
  "M 0, 8  C  10,16   14,28   10,36",
];

// ── Colour palette per depth layer ──────────────────────────────────────
// Layer 0: back / large / dark & faint
// Layer 1: mid
// Layer 2: front / small / bright & opaque
const PALETTE = [
  {
    fill: "hsl(150,48%,22%)",
    stroke: "hsl(148,44%,14%)",
    vein: "hsl(148,40%,32%)",
    varieg: "hsl(86,42%,44%)",
    opacity: 0.36,
    shadow: "drop-shadow(0 4px 12px hsla(150,50%,10%,0.18))",
  },
  {
    fill: "hsl(148,42%,30%)",
    stroke: "hsl(146,38%,20%)",
    vein: "hsl(145,36%,42%)",
    varieg: "hsl(90,46%,54%)",
    opacity: 0.56,
    shadow: "drop-shadow(0 6px 16px hsla(148,50%,10%,0.22))",
  },
  {
    fill: "hsl(145,38%,38%)",
    stroke: "hsl(143,34%,26%)",
    vein: "hsl(142,32%,54%)",
    varieg: "hsl(92,50%,62%)",
    opacity: 0.74,
    shadow: "drop-shadow(0 8px 20px hsla(145,50%,10%,0.26))",
  },
];

// ── Parallax speeds per layer (fraction of scrollY applied as translateY) ─
const SPEED = [0.04, 0.15, 0.30];

// ── Leaf definitions ─────────────────────────────────────────────────────
// cx/cy: viewport % (left/top)   s: scale   r: rotation   layer: 0|1|2
// flip: mirror X (adds variety)  varieg: show golden patch
interface LeafDef {
  cx: number; cy: number;
  s: number; r: number;
  layer: 0 | 1 | 2;
  flip?: boolean;
  varieg?: boolean;
  swayDur: number;
  swayAmp: number;
}

const LEAVES: LeafDef[] = [
  // ── Layer 0: large background leaves at far edges ───────────────────
  { cx: -5, cy: -8, s: 2.0, r: 18, layer: 0, swayDur: 5.2, swayAmp: 3 },
  { cx: 105, cy: -6, s: 1.9, r: -22, layer: 0, flip: true, swayDur: 4.8, swayAmp: 3 },
  { cx: -6, cy: 50, s: 1.8, r: -6, layer: 0, swayDur: 6.0, swayAmp: 2 },
  { cx: 106, cy: 48, s: 1.7, r: 8, layer: 0, flip: true, swayDur: 5.5, swayAmp: 2 },
  { cx: -5, cy: 105, s: 2.1, r: -10, layer: 0, swayDur: 4.6, swayAmp: 3 },
  { cx: 105, cy: 103, s: 2.0, r: 14, layer: 0, flip: true, swayDur: 5.0, swayAmp: 3 },

  // ── Layer 1: mid leaves, spread around edges ─────────────────────────
  { cx: 10, cy: 2, s: 1.2, r: 32, layer: 1, varieg: true, swayDur: 4.2, swayAmp: 5 },
  { cx: 90, cy: 4, s: 1.1, r: -36, layer: 1, flip: true, varieg: true, swayDur: 3.8, swayAmp: 5 },
  { cx: -2, cy: 28, s: 1.3, r: -16, layer: 1, swayDur: 5.1, swayAmp: 4 },
  { cx: 102, cy: 26, s: 1.2, r: 20, layer: 1, flip: true, swayDur: 4.7, swayAmp: 4 },
  { cx: 7, cy: 70, s: 1.2, r: -8, layer: 1, varieg: true, swayDur: 4.5, swayAmp: 4 },
  { cx: 93, cy: 68, s: 1.1, r: 12, layer: 1, flip: true, varieg: true, swayDur: 5.3, swayAmp: 4 },
  { cx: 18, cy: 96, s: 1.1, r: 26, layer: 1, swayDur: 4.0, swayAmp: 5 },
  { cx: 82, cy: 94, s: 1.0, r: -28, layer: 1, flip: true, swayDur: 4.4, swayAmp: 5 },

  // ── Layer 2: small foreground leaves, peeking from edges ─────────────
  { cx: 7, cy: -2, s: 0.80, r: 48, layer: 2, varieg: true, swayDur: 3.4, swayAmp: 7 },
  { cx: 93, cy: -1, s: 0.75, r: -52, layer: 2, flip: true, varieg: true, swayDur: 3.0, swayAmp: 7 },
  { cx: -1, cy: 42, s: 0.85, r: -24, layer: 2, swayDur: 3.7, swayAmp: 6 },
  { cx: 101, cy: 40, s: 0.80, r: 26, layer: 2, flip: true, swayDur: 3.3, swayAmp: 6 },
  { cx: 5, cy: 88, s: 0.78, r: 18, layer: 2, varieg: true, swayDur: 3.6, swayAmp: 7 },
  { cx: 95, cy: 86, s: 0.74, r: -20, layer: 2, flip: true, varieg: true, swayDur: 3.2, swayAmp: 7 },
];

// ── Individual Leaf SVG ──────────────────────────────────────────────────
function Leaf({ leaf, gradId }: { leaf: LeafDef; gradId: string }) {
  const p = PALETTE[leaf.layer];
  const sz = leaf.s * 60; // half-width px

  return (
    <div
      style={{
        position: "absolute",
        left: `${leaf.cx}vw`,
        top: `${leaf.cy}vh`,
        width: sz * 2,
        height: sz * 2.2,
        marginLeft: -sz,
        marginTop: -sz * 1.1,
        animation: `mp-sway-${leaf.layer % 3} ${leaf.swayDur}s ease-in-out infinite alternate`,
        transformOrigin: "50% 90%",  // sway from stem
        willChange: "transform",
      }}
    >
      <svg
        viewBox="-62 -64 124 130"
        width="100%"
        height="100%"
        style={{
          transform: `rotate(${leaf.r}deg) scaleX(${leaf.flip ? -1 : 1})`,
          filter: p.shadow,
          overflow: "visible",
        }}
      >
        {/* Highlight gradient */}
        <defs>
          <radialGradient id={gradId} cx="38%" cy="32%" r="55%">
            <stop offset="0%" stopColor={p.vein} stopOpacity="0.35" />
            <stop offset="100%" stopColor={p.fill} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Leaf body */}
        <path d={LEAF_BODY} fill={p.fill} stroke={p.stroke} strokeWidth="1.8" />

        {/* Inner highlight */}
        <path d={LEAF_BODY} fill={`url(#${gradId})`} />

        {/* Variegation patch */}
        {leaf.varieg && (
          <ellipse cx="10" cy="-14" rx="12" ry="18"
            fill={p.varieg} opacity="0.30" />
        )}

        {/* Midrib */}
        <path d={MIDRIB} stroke={p.vein} strokeWidth="1.4"
          strokeLinecap="round" fill="none" opacity="0.70" />

        {/* Lateral veins */}
        {VEINS.map((v, vi) => (
          <path key={vi} d={v} stroke={p.vein}
            strokeWidth="0.65" strokeLinecap="round"
            fill="none" opacity="0.40" />
        ))}
      </svg>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────
export const PlantBackground = () => {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const y = window.scrollY;
      layerRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${-(y * SPEED[i]).toFixed(2)}px)`;
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // Group leaves by layer
  const byLayer = [0, 1, 2].map(li =>
    LEAVES.filter(l => l.layer === li)
  );

  return (
    <>
      {/* Sway keyframes injected once */}
      <style>{`
        @keyframes mp-sway-0 {
          from { transform: rotate(-3deg); }
          to   { transform: rotate( 3deg); }
        }
        @keyframes mp-sway-1 {
          from { transform: rotate(-4deg); }
          to   { transform: rotate( 5deg); }
        }
        @keyframes mp-sway-2 {
          from { transform: rotate(-6deg); }
          to   { transform: rotate( 4deg); }
        }
      `}</style>

      {/* Fixed viewport container */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        {byLayer.map((leaves, li) => (
          /* One layer div per parallax depth */
          <div
            key={li}
            ref={el => { layerRefs.current[li] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              opacity: PALETTE[li].opacity,
              willChange: "transform",
            }}
          >
            {leaves.map((leaf, ki) => (
              <Leaf
                key={ki}
                leaf={leaf}
                gradId={`mp-g-${li}-${ki}`}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

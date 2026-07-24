/**
 * MoneyPlantVine — Premium scroll-driven money plant growth
 *
 * FIX: All leaf positions are computed precisely using SVGPathElement.getPointAtLength()
 * after the vine path is rendered. Positioning is done via SVG `transform` attribute
 * (exact SVG coordinate system), and GSAP only animates scale / opacity / sway on
 * the inner group (no coordinate-system confusion).
 *
 * Architecture:
 *  <g ref={posRef} transform="translate(bx,by) rotate(leafRot)">  ← exact SVG position
 *    <g ref={animRef} style={{opacity:0}}>                         ← GSAP target
 *      <LeafShape />
 *    </g>
 *  </g>
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Leaf anatomy ──────────────────────────────────────────────────────────────
// Attachment at (0,0), tip at (0,−72).
const BODY = `M 0,0 C -5,-4 -23,-8 -25,-24 C -27,-40 -21,-57 -10,-66 C -4,-71 0,-75 0,-75 C 4,-71 10,-67 10,-66 C 21,-57 27,-40 25,-24 C 23,-8 5,-4 0,0 Z`;
const MIDRIB = `M 0,0 C 0.5,-24 0.5,-50 0,-75`;
const VEINS = [
  "M 0,-20 C -11,-17 -18,-9 -18,-1",
  "M 0,-38 C -14,-33 -19,-21 -17,-9",
  "M 0,-56 C -12,-52 -15,-40 -13,-28",
  "M 0,-20 C  11,-17  18,-9  18,-1",
  "M 0,-38 C  14,-33  19,-21  17,-9",
  "M 0,-56 C  12,-52  15,-40  13,-28",
];

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  vineDark:   "hsl(148,50%,16%)",
  vineMid:    "hsl(148,44%,24%)",
  vineTip:    "hsl(145,40%,32%)",
  branch:     "hsl(148,42%,22%)",
  leafFill:   "hsl(150,50%,27%)",
  leafStroke: "hsl(148,46%,16%)",
  vein:       "hsl(144,36%,46%)",
  variegA:    "hsl(90,44%,56%)",
  variegB:    "hsl(86,40%,62%)",
};

// ── Leaf component (drawn at local origin; outer group handles positioning) ───
function LeafShape({ varieg, flip }: { varieg: boolean; flip: boolean }) {
  return (
    <g transform={`scale(${flip ? -1 : 1},1)`}>
      <path d={BODY} fill={C.leafFill} stroke={C.leafStroke} strokeWidth="1.7" />
      <path d={BODY} fill="url(#leaf-hl)" opacity="0.4" />
      {varieg && (
        <>
          <ellipse cx="7"  cy="-26" rx="9"  ry="15" fill={C.variegA} opacity="0.35" />
          <ellipse cx="-4" cy="-52" rx="5"  ry="9"  fill={C.variegB} opacity="0.28" />
        </>
      )}
      <path d={MIDRIB} stroke={C.vein} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />
      {VEINS.map((v, i) => (
        <path key={i} d={v} stroke={C.vein} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.42" />
      ))}
    </g>
  );
}

// ── Config ────────────────────────────────────────────────────────────────────
const FRACS_DESKTOP = [0.08,0.17,0.27,0.37,0.47,0.57,0.67,0.77,0.87,0.96];
const FRACS_MOBILE  = [0.12,0.28,0.44,0.60,0.76,0.90];
const SCALES        = [1.1,0.90,1.04,0.86,1.00,0.88,1.06,0.84,0.98,0.80];
const BRANCH_LEN    = 68; // px

// ── Exact point on path ───────────────────────────────────────────────────────
interface VPt {
  vx: number; vy: number;  // vine attachment (for branch start)
  bx: number; by: number;  // branch end (leaf attachment in SVG space)
  leafRot: number;          // SVG rotate value for outer positioning group
}

function computeLeafPoints(
  path: SVGPathElement,
  fracs: number[],
  isRight: boolean,
): VPt[] {
  const len = path.getTotalLength();
  return fracs.map((f, i) => {
    const pt  = path.getPointAtLength(f * len);
    const pt1 = path.getPointAtLength(Math.max(0,   f * len - 3));
    const pt2 = path.getPointAtLength(Math.min(len, f * len + 3));

    // Tangent angle of vine at this point (degrees)
    const tang = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * 180 / Math.PI;

    // Branch goes perpendicular to vine, inward (right for left-vine, left for right-vine)
    // ±30° alternation gives organic zigzag
    const perpBase = tang + (isRight ? -90 : 90);
    const alt      = i % 2 === 0 ? -30 : 30;
    const brAngle  = perpBase + alt;

    // Branch end point
    const rad = brAngle * Math.PI / 180;
    const bx  = pt.x + BRANCH_LEN * Math.cos(rad);
    const by  = pt.y + BRANCH_LEN * Math.sin(rad);

    // Leaf tip direction = extend branch direction
    // Leaf default: tip at (0,−75) = pointing "up" (−90° in SVG)
    // To make tip point along branch: leafRot = brAngle + 90
    const leafRot = brAngle + 90;

    return { vx: pt.x, vy: pt.y, bx, by, leafRot };
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export const MoneyPlantVine = () => {
  const svgRef    = useRef<SVGSVGElement>(null);
  const lVineRef  = useRef<SVGPathElement>(null);
  const rVineRef  = useRef<SVGPathElement>(null);

  // Per-leaf refs — max 10 per side = 20 total
  const branchRef = useRef<(SVGLineElement|null)[]>(Array(20).fill(null));
  const posRef    = useRef<(SVGGElement|null)[]>(Array(20).fill(null));   // positioning group
  const animRef   = useRef<(SVGGElement|null)[]>(Array(20).fill(null));   // GSAP animation target

  useEffect(() => {
    const lVine = lVineRef.current;
    const rVine = rVineRef.current;
    if (!lVine || !rVine) return;

    const W        = window.innerWidth;
    const H        = window.innerHeight;
    const isMobile = W < 768;
    const FRACS    = isMobile ? FRACS_MOBILE : FRACS_DESKTOP;
    const N        = FRACS.length;

    const ll = lVine.getTotalLength();
    const rl = rVine.getTotalLength();

    // ── Set exact dasharray now that we know path length ─────────────────────
    lVine.style.strokeDasharray  = String(ll);
    lVine.style.strokeDashoffset = String(ll);
    rVine.style.strokeDasharray  = String(rl);
    rVine.style.strokeDashoffset = String(rl);

    // ── Compute exact leaf positions ──────────────────────────────────────────
    const lPts = computeLeafPoints(lVine, FRACS, false);
    const rPts = computeLeafPoints(rVine, FRACS, true);

    // ── Position leaves & branches via SVG attribute (exact coords) ───────────
    const allPts = [...lPts, ...rPts]; // 0..N-1 = left, N..2N-1 = right
    allPts.forEach((pt, idx) => {
      // Branch line: from vine to leaf attachment
      const br = branchRef.current[idx];
      if (br) {
        br.setAttribute("x1", String(pt.vx));
        br.setAttribute("y1", String(pt.vy));
        br.setAttribute("x2", String(pt.bx));
        br.setAttribute("y2", String(pt.by));
      }
      // Positioning group: translate to leaf attachment, rotate so tip faces outward
      const pos = posRef.current[idx];
      if (pos) {
        pos.setAttribute("transform", `translate(${pt.bx},${pt.by}) rotate(${pt.leafRot})`);
      }
    });

    // ── Reduced motion ────────────────────────────────────────────────────────
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      lVine.style.strokeDashoffset = "0";
      rVine.style.strokeDashoffset = "0";
      animRef.current.forEach(el => {
        if (!el) return;
        el.style.opacity   = "0.92";
        el.style.transform = "scale(1)";
      });
      branchRef.current.forEach(el => { if (el) el.style.opacity = "0.88"; });
      return;
    }

    // ── GSAP context ──────────────────────────────────────────────────────────
    const ctx = gsap.context(() => {

      // ── VINE DRAW (scrubbed to scroll) ──────────────────────────────────────
      gsap.to(lVine, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 2.8,  // 2.8s lag = slow, organic feel
        },
      });
      gsap.to(rVine, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 2.8,
        },
      });

      // ── LEAVES: sprout + sway ────────────────────────────────────────────────
      allPts.forEach((_, idx) => {
        const frac    = FRACS[idx % N];
        const pct     = frac * 100;
        const sc      = SCALES[idx % SCALES.length];
        const animEl  = animRef.current[idx];
        const brEl    = branchRef.current[idx];

        if (!animEl) return;

        // Initial state: invisible, scaled to zero from attachment point
        gsap.set(animEl, { scale: 0, opacity: 0, transformOrigin: "0px 0px" });

        // Branch fade-in
        if (brEl) {
          gsap.set(brEl, { opacity: 0 });
          gsap.to(brEl, {
            opacity: 0.88,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "body",
              start: `${Math.max(0, pct - 1)}% top`,
              toggleActions: "play none none none",
            },
          });
        }

        // Leaf sprout — elastic spring from attachment point
        gsap.to(animEl, {
          scale: sc,
          opacity: 0.92,
          duration: 1.4,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: "body",
            start: `${Math.max(0, pct - 0.5)}% top`,
            toggleActions: "play none none none",
          },
          onComplete: () => {
            // Begin ambient sway AFTER sprout is done
            gsap.to(animEl, {
              rotation: 3 + (idx % 3) * 1.5,
              transformOrigin: "0px 0px",
              duration: 3.0 + (idx % 5) * 0.55,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: (idx % 4) * 0.4,
            });
          },
        });
      });

    }); // end gsap.context

    return () => ctx.revert();
  }, []);

  // ── Build vine paths (called at render time) ──────────────────────────────
  const W = typeof window !== "undefined" ? window.innerWidth  : 1440;
  const H = typeof window !== "undefined" ? window.innerHeight : 900;
  const isMobile = W < 768;
  const FRACS    = isMobile ? FRACS_MOBILE : FRACS_DESKTOP;
  const N        = FRACS.length;
  const VARIEG   = FRACS.map((_, i) => i % 2 === 0);

  // Left vine: S-curve up the left edge (starts just below viewport)
  const lPath = [
    `M ${W*0.038},${H*1.04}`,
    `C ${W*-0.050},${H*0.875}  ${W*0.120},${H*0.735}  ${W*0.038},${H*0.595}`,
    `C ${W*-0.042},${H*0.455}  ${W*0.115},${H*0.315}  ${W*0.036},${H*0.175}`,
    `C ${W*-0.038},${H*0.040}  ${W*0.090},${H*-0.015} ${W*0.036},${H*-0.090}`,
  ].join(" ");

  // Right vine: mirror
  const rPath = [
    `M ${W*0.962},${H*1.04}`,
    `C ${W*1.050},${H*0.875}  ${W*0.880},${H*0.735}  ${W*0.962},${H*0.595}`,
    `C ${W*1.042},${H*0.455}  ${W*0.885},${H*0.315}  ${W*0.964},${H*0.175}`,
    `C ${W*1.038},${H*0.040}  ${W*0.910},${H*-0.015} ${W*0.964},${H*-0.090}`,
  ].join(" ");

  const vineWidth = isMobile ? 3.5 : 5.5;

  // Render leaves for one side (all initially hidden at origin, positioned in useEffect)
  const renderSide = (isRight: boolean, offset: number) =>
    FRACS.map((_, i) => {
      const idx  = offset + i;
      const flip = isRight ? i % 2 === 1 : i % 2 === 0;

      return (
        <g key={`${isRight ? "r" : "l"}-${i}`}>
          {/* Branch line — x1/y1/x2/y2 set in useEffect */}
          <line
            ref={el => { branchRef.current[idx] = el as SVGLineElement; }}
            x1="0" y1="0" x2="0" y2="0"
            stroke={C.branch}
            strokeWidth={isMobile ? 1.8 : 2.6}
            strokeLinecap="round"
            style={{ opacity: 0, willChange: "opacity" }}
          />

          {/* Positioning group — SVG transform set in useEffect via setAttribute */}
          <g ref={el => { posRef.current[idx] = el as SVGGElement; }}
            transform="translate(0,0)">

            {/* GSAP animation target — scale/opacity/sway */}
            <g ref={el => { animRef.current[idx] = el as SVGGElement; }}
              style={{ opacity: 0, willChange: "transform, opacity" }}>
              <LeafShape varieg={VARIEG[i]} flip={flip} />
            </g>

          </g>
        </g>
      );
    });

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        overflow: "visible",
      }}
    >
      <defs>
        {/* Vine: dark roots → lighter new-growth tip */}
        <linearGradient id="vg-l" gradientUnits="userSpaceOnUse"
          x1={W*0.038} y1={H*1.04} x2={W*0.036} y2={H*-0.09}>
          <stop offset="0%"   stopColor={C.vineDark} />
          <stop offset="60%"  stopColor={C.vineMid}  />
          <stop offset="100%" stopColor={C.vineTip}  />
        </linearGradient>
        <linearGradient id="vg-r" gradientUnits="userSpaceOnUse"
          x1={W*0.962} y1={H*1.04} x2={W*0.964} y2={H*-0.09}>
          <stop offset="0%"   stopColor={C.vineDark} />
          <stop offset="60%"  stopColor={C.vineMid}  />
          <stop offset="100%" stopColor={C.vineTip}  />
        </linearGradient>
        {/* Leaf inner highlight */}
        <radialGradient id="leaf-hl" cx="38%" cy="32%" r="55%">
          <stop offset="0%"   stopColor={C.vein}     stopOpacity="0.45" />
          <stop offset="100%" stopColor={C.leafFill} stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* LEFT VINE */}
      <path ref={lVineRef} d={lPath}
        fill="none" stroke="url(#vg-l)"
        strokeWidth={vineWidth} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="9999" strokeDashoffset="9999"
        opacity="0.90" style={{ willChange: "stroke-dashoffset" }}
      />
      {renderSide(false, 0)}

      {/* RIGHT VINE */}
      <path ref={rVineRef} d={rPath}
        fill="none" stroke="url(#vg-r)"
        strokeWidth={vineWidth} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="9999" strokeDashoffset="9999"
        opacity="0.90" style={{ willChange: "stroke-dashoffset" }}
      />
      {renderSide(true, N)}
    </svg>
  );
};

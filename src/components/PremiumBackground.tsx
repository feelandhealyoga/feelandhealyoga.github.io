/**
 * PremiumBackground — Luxury ambient gradient orbs
 *
 * Four softly animated radial gradient blobs create an atmospheric,
 * premium depth effect without distracting from content.
 * No JavaScript, no scroll tracking — pure GPU-accelerated CSS.
 * Earthy greens, sage, warm gold, soft rose — yoga wellness palette.
 */
export const PremiumBackground = () => (
  <>
    <style>{`
      @keyframes orb-drift-a {
        0%, 100% { transform: translate(0, 0) scale(1);    }
        33%       { transform: translate(4%, 7%) scale(1.06); }
        66%       { transform: translate(-3%, 4%) scale(0.97); }
      }
      @keyframes orb-drift-b {
        0%, 100% { transform: translate(0, 0) scale(1.04); }
        40%       { transform: translate(-6%, -5%) scale(1);    }
        75%       { transform: translate(4%, -3%) scale(1.08); }
      }
      @keyframes orb-drift-c {
        0%, 100% { transform: translate(0, 0) scale(1);    }
        50%       { transform: translate(5%, -6%) scale(1.10); }
      }
      @keyframes orb-drift-d {
        0%, 100% { transform: translate(0, 0) scale(1.05); }
        60%       { transform: translate(-4%, 5%) scale(1);    }
      }
    `}</style>

    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Orb 1 — top-right, sage green bloom */}
      <div style={{
        position: "absolute",
        right: "-18%", top: "-12%",
        width: "70vw", height: "70vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, hsla(145,42%,65%,0.16) 0%, transparent 68%)",
        filter: "blur(72px)",
        animation: "orb-drift-a 24s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 2 — bottom-left, warm gold bloom */}
      <div style={{
        position: "absolute",
        left: "-14%", bottom: "-14%",
        width: "62vw", height: "62vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, hsla(38,60%,72%,0.13) 0%, transparent 68%)",
        filter: "blur(80px)",
        animation: "orb-drift-b 32s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 3 — center, very soft sage (barely there, pure atmosphere) */}
      <div style={{
        position: "absolute",
        left: "25%", top: "28%",
        width: "55vw", height: "55vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, hsla(145,24%,88%,0.20) 0%, transparent 70%)",
        filter: "blur(100px)",
        animation: "orb-drift-c 40s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 4 — top-left, soft blush */}
      <div style={{
        position: "absolute",
        left: "-10%", top: "12%",
        width: "44vw", height: "44vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, hsla(340,22%,82%,0.09) 0%, transparent 68%)",
        filter: "blur(85px)",
        animation: "orb-drift-d 28s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 5 — bottom-right, deep forest note */}
      <div style={{
        position: "absolute",
        right: "-8%", bottom: "5%",
        width: "38vw", height: "38vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, hsla(145,48%,55%,0.09) 0%, transparent 68%)",
        filter: "blur(65px)",
        animation: "orb-drift-a 20s ease-in-out infinite reverse",
        willChange: "transform",
      }} />
    </div>
  </>
);

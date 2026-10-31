import { useEffect, useState } from "react";

const SESSION_KEY = "retreat_popup_seen_v1";

export const RetreatPopup = () => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Show only once per session, after a 1.8s delay
    if (!sessionStorage.getItem(SESSION_KEY)) {
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 320);
  };

  const openYogi = () => {
    window.dispatchEvent(new CustomEvent("open-yogi-retreat"));
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Karjat Mindfulness Retreat"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0 0 max(24px, env(safe-area-inset-bottom))",
        background: "rgba(13,31,23,0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: leaving ? "popupFadeOut 0.32s ease forwards" : "popupFadeIn 0.38s ease forwards",
      } as React.CSSProperties}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div style={{
        width: "100%", maxWidth: 440,
        background: "linear-gradient(160deg, #0D1F17 0%, #173F32 55%, #1C2E20 100%)",
        borderRadius: "24px 24px 20px 20px",
        padding: "28px 24px 24px",
        position: "relative",
        border: "1px solid rgba(201,166,107,0.20)",
        boxShadow: "0 -8px 48px rgba(0,0,0,0.45)",
        animation: leaving ? "sheetSlideOut 0.32s ease forwards" : "sheetSlideIn 0.40s cubic-bezier(0.34,1.3,0.64,1) forwards",
      }}>
        {/* Close */}
        <button onClick={dismiss} aria-label="Close"
          style={{
            position: "absolute", top: 16, right: 16,
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(255,255,255,0.10)", border: "none",
            cursor: "pointer", color: "rgba(247,244,236,0.60)",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          } as React.CSSProperties}>✕</button>

        {/* Pill label */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(201,166,107,0.15)", border: "1px solid rgba(201,166,107,0.30)",
          borderRadius: 99, padding: "4px 12px", marginBottom: 16 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A66B",
            display: "inline-block", animation: "pulse-dot 2s infinite" }} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase" as const, color: "#C9A66B" }}>
            Upcoming · 28–29 Nov 2026
          </span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700,
          color: "#F7F4EC", margin: "0 0 8px", lineHeight: 1.2,
        }}>
          Your Phone Has Airplane Mode.<br />
          <em style={{ color: "#A8C5A0", fontStyle: "italic" }}>Why Don't You?</em>
        </h2>

        <p style={{ fontSize: 12, color: "rgba(247,244,236,0.55)", margin: "0 0 16px", lineHeight: 1.65 }}>
          Switch off the noise. Tune into yourself.<br />
          📍 Karjat Retreat · 1-Night Mindfulness Experience
        </p>

        {/* Activity chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
          {["🧘 Yoga", "🌬️ Breathwork", "🍵 Tea", "🎵 Music", "🤝 Connect"].map(a => (
            <span key={a} style={{ fontSize: 10, color: "rgba(247,244,236,0.65)",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 99, padding: "4px 10px" }}>{a}</span>
          ))}
        </div>

        {/* CTA */}
        <button onClick={openYogi}
          id="retreat-popup-yogi-btn"
          style={{
            width: "100%", padding: "14px", borderRadius: 99,
            border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #C9A66B, #B8924F)",
            color: "#173F32", fontSize: 14, fontWeight: 700,
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.03em",
            boxShadow: "0 6px 24px rgba(201,166,107,0.35)",
            marginBottom: 10,
          } as React.CSSProperties}>
          🌿 Register with YOGI AI
        </button>

        <a href="/retreat/karjat-2026" onClick={dismiss}
          style={{ display: "block", textAlign: "center" as const,
            fontSize: 11, color: "rgba(247,244,236,0.35)", textDecoration: "none" }}>
          View full retreat details ↗
        </a>
      </div>

      <style>{`
        @keyframes popupFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popupFadeOut { from{opacity:1} to{opacity:0} }
        @keyframes sheetSlideIn { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes sheetSlideOut { from{transform:translateY(0);opacity:1} to{transform:translateY(60px);opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
      `}</style>
    </div>
  );
};

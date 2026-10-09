import { useEffect, useState } from "react";

const RETREAT_DATE = new Date("2026-10-24T06:00:00+05:30");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export const RetreatBanner = () => {
  const { days, hours, minutes, seconds } = useCountdown(RETREAT_DATE);

  const openRetreatsYogi = () => {
    window.dispatchEvent(new CustomEvent("open-yogi-retreat"));
    // analytics
    try { (window as any).gtag?.("event", "retreat_yogi_opened", { event_category: "retreat" }); } catch (_) {}
  };

  const trackExplore = () => {
    try { (window as any).gtag?.("event", "retreat_explore_clicked", { event_category: "retreat" }); } catch (_) {}
  };

  return (
    <section
      id="retreat-banner"
      aria-label="Karjat Mindfulness Retreat"
      style={{
        background: "linear-gradient(135deg, hsl(80,18%,14%) 0%, hsl(145,30%,18%) 50%, hsl(25,35%,22%) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle texture dots */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "radial-gradient(hsl(38,80%,75%) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Leaf accents */}
      <div aria-hidden style={{ position: "absolute", top: -30, right: -30, fontSize: 120, opacity: 0.07, transform: "rotate(20deg)", userSelect: "none" }}>🌿</div>
      <div aria-hidden style={{ position: "absolute", bottom: -20, left: -20, fontSize: 100, opacity: 0.07, transform: "rotate(-15deg)", userSelect: "none" }}>🍃</div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 24px 48px", position: "relative", zIndex: 1 }}>

        {/* Label pill */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)",
            borderRadius: 999, padding: "5px 16px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "hsl(38,90%,72%)",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "hsl(38,90%,62%)", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
            1-Night Mindfulness Retreat · Karjat
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          textAlign: "center", margin: "0 0 12px",
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(26px, 5vw, 46px)",
          fontWeight: 800, lineHeight: 1.2,
          color: "hsl(38,60%,94%)",
          letterSpacing: "-0.01em",
        }}>
          Your Phone Has Airplane Mode.
          <br />
          <em style={{ color: "hsl(145,50%,68%)", fontStyle: "italic" }}>Why Don't You?</em>
        </h2>

        {/* Sub */}
        <p style={{ textAlign: "center", color: "hsl(38,25%,72%)", fontSize: 16, margin: "0 auto 8px", maxWidth: 480 }}>
          Switch off the noise. Tune into yourself.
        </p>
        <p style={{ textAlign: "center", color: "hsl(38,60%,80%)", fontSize: 14, fontWeight: 600, margin: "0 0 32px", letterSpacing: "0.02em" }}>
          📅 24 – 25 October 2026 &nbsp;·&nbsp; 📍 Karjat, Maharashtra
        </p>

        {/* Activities row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 36 }}>
          {[
            ["🧘", "Yoga & Meditation"],
            ["🌬️", "Breathwork"],
            ["🍵", "Mindful Tea"],
            ["🎵", "Music"],
            ["🤝", "Connections"],
            ["🎲", "Fun Games"],
          ].map(([icon, label]) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999, padding: "5px 14px",
              fontSize: 12, color: "hsl(38,40%,85%)", fontWeight: 500,
            }}>
              {icon} {label}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
          <a
            href="/retreat/karjat-2026"
            onClick={trackExplore}
            id="retreat-explore-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, hsl(145,40%,36%), hsl(160,42%,44%))",
              color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "13px 28px", borderRadius: 999, border: "none",
              textDecoration: "none", cursor: "pointer",
              boxShadow: "0 4px 20px hsla(145,40%,36%,0.45)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            🌿 Explore Retreat
          </a>
          <button
            onClick={openRetreatsYogi}
            id="retreat-yogi-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, hsl(25,70%,44%), hsl(15,72%,38%))",
              color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "13px 28px", borderRadius: 999, border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px hsla(25,70%,44%,0.45)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            💬 Register with YOGI AI
          </button>
        </div>

        {/* Countdown */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            [days, "Days"],
            [hours, "Hours"],
            [minutes, "Minutes"],
            [seconds, "Seconds"],
          ].map(([val, label]) => (
            <div key={label as string} style={{ textAlign: "center" }}>
              <div style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 12, padding: "10px 18px", minWidth: 60,
                fontFamily: "'DM Mono', monospace",
                fontSize: "clamp(20px, 4vw, 30px)", fontWeight: 800,
                color: "hsl(38,85%,78%)", lineHeight: 1,
              }}>
                {String(val).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 10, color: "hsl(38,20%,60%)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </section>
  );
};

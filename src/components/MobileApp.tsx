import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════ */
type Tab = "home" | "classes" | "gallery" | "about";

const WA_BOOK    = "https://wa.me/919920155875?text=Namaste!%20%F0%9F%99%8F%20I%27d%20like%20to%20book%20a%20FREE%20trial%20yoga%20class%20at%20Feel%20%26%20Heal%20Yoga.%20Could%20you%20please%20help%20me%20set%20up%20a%20slot%3F";
const WA_GENERAL = "https://wa.me/919920155875";
const INSTAGRAM  = "https://www.instagram.com/feelandhealyoga/";
const LINKEDIN   = "https://www.linkedin.com/company/feel-heal-yoga/";

const openTrial = () => window.dispatchEvent(new CustomEvent("open-yogi-trial"));
const openChat  = () => window.dispatchEvent(new CustomEvent("open-yogi-chat"));

/* ═══════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════ */
const DG   = "hsl(145,44%,20%)";   // dark green — headings, active
const SG   = "hsl(145,38%,40%)";   // sage green — CTAs
const LG   = "hsl(145,30%,93%)";   // light green — badges
const CREAM = "hsl(42,28%,97%)";   // warm page bg
const TD   = "hsl(220,18%,13%)";   // text dark
const TM   = "hsl(220,10%,50%)";   // text muted
const GOLD = "hsl(38,80%,50%)";    // star gold
const WHITE = "#ffffff";

/* ═══════════════════════════════════════
   GALLERY DATA
   ═══════════════════════════════════════ */
const soloImages = [
  "WhatsApp Image 2026-01-22 at 22.08.35.jpeg",
];

const groupImages = [
  "WhatsApp Image 2026-01-22 at 22.46.02.jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (1).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (2).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (3).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (4).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (5).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (6).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.02 (7).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03.jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (1).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (2).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (3).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (4).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (5).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (6).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (7).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (8).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (9).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (10).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (11).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (12).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (13).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (14).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (15).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (16).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (17).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (18).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (19).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (20).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (21).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (22).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (23).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (24).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (25).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (26).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (27).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (28).jpeg",
  "WhatsApp Image 2026-01-22 at 22.46.03 (29).jpeg",
];

const allGalleryImages = [...soloImages, ...groupImages];

const youtubeIds = [
  "29PJnLn8xxU", "9f8V18vKlbY", "NY0STA5U1RQ",
  "jgO2-SUE6Fw", "rXBB5g1aixo", "FoSUPzcJyB4",
];

/* ═══════════════════════════════════════
   CONTENT DATA
   ═══════════════════════════════════════ */
const SCHEDULE = [
  { label: "6 AM",    time: "6:00 – 7:00 AM",  days: "Mon–Fri", accent: DG },
  { label: "8 AM",    time: "8:00 – 9:00 AM",  days: "Mon–Fri", accent: GOLD },
  { label: "7:30 PM", time: "7:30 – 8:30 PM",  days: "Mon–Fri", accent: "hsl(220,44%,38%)" },
];

const PROGRAMS = [
  { name: "Weight Loss",      desc: "Sustainable fat loss & body toning",          img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(3).jpeg" },
  { name: "Back Pain Relief", desc: "Therapeutic poses for a strong spine",         img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(4).jpeg" },
  { name: "Women's Wellness", desc: "Hormone balance, PCOD & inner strength",       img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(1).jpeg" },
  { name: "Meditation",       desc: "Breathwork, pranayama & deep mindfulness",     img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03.jpeg" },
  { name: "Prenatal Yoga",    desc: "Safe, gentle yoga for every stage",            img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(6).jpeg" },
  { name: "Personal Training",desc: "1-on-1 sessions tailored to your goals",       img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(5).jpeg" },
];

const REVIEWS = [
  { name: "Priya M.",  stars: 5, text: "Best yoga studio in Navi Mumbai! The personal attention is truly incredible." },
  { name: "Rahul S.",  stars: 5, text: "Lost 8kg in 3 months. The teacher genuinely cares about every student." },
  { name: "Sneha K.",  stars: 5, text: "The Women's batch is so warm and welcoming. I love every single session!" },
];

const CREDENTIALS = [
  "Internationally Certified", "Hatha & Vinyasa", "Pranayama Expert",
  "Pre & Post Natal", "Diploma in Naturopathy", "Holistic Wellness",
];

/* ═══════════════════════════════════════
   SHARED STYLE HELPERS
   ═══════════════════════════════════════ */
const lbl: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, color: SG,
  letterSpacing: "0.20em", textTransform: "uppercase" as const,
  margin: "0 0 6px", display: "block",
};

const h2Style: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 24, fontWeight: 800, color: DG,
  margin: "0 0 20px", lineHeight: 1.2,
};

const pill = (active: boolean): React.CSSProperties => ({
  padding: "8px 18px", borderRadius: 99, border: "none",
  background: active ? DG : "hsl(145,20%,94%)",
  color: active ? WHITE : TM,
  fontWeight: 600, fontSize: 12, cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.2s",
  WebkitTapHighlightColor: "transparent",
});

const primaryBtn: React.CSSProperties = {
  width: "100%", padding: "14px 0", borderRadius: 99,
  background: `linear-gradient(135deg, hsl(145,42%,36%), hsl(145,44%,20%))`,
  color: WHITE, fontWeight: 700, fontSize: 14,
  border: "none", cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  letterSpacing: "0.01em",
  boxShadow: "0 4px 20px rgba(40,100,60,0.30)",
  WebkitTapHighlightColor: "transparent",
};

/* ═══════════════════════════════════════
   NAV BUTTON
   ═══════════════════════════════════════ */
const NavBtn = ({ active, onClick, label, emoji }: {
  active: boolean; onClick: () => void; label: string; emoji: string;
}) => (
  <button onClick={onClick} style={{
    flex: 1, display: "flex", flexDirection: "column" as const,
    alignItems: "center", justifyContent: "center",
    gap: 2, padding: "8px 0",
    border: "none", background: "none", cursor: "pointer",
    color: active ? DG : TM, position: "relative" as const,
    WebkitTapHighlightColor: "transparent",
    transition: "color .15s",
    fontFamily: "'Inter', sans-serif",
  } as any}>
    <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
    <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, letterSpacing: "0.03em" }}>{label}</span>
    {active && <span style={{ position: "absolute", bottom: 0, width: 20, height: 2.5, background: DG, borderRadius: 99 }} />}
  </button>
);

/* ═══════════════════════════════════════
   SHELL
   ═══════════════════════════════════════ */
export const MobileApp = () => {
  const [tab,  setTab]  = useState<Tab>("home");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const target = sessionStorage.getItem("mobileTargetTab");
    if (target) {
      sessionStorage.removeItem("mobileTargetTab");
      const map: Record<string, Tab> = {
        home: "home", schedule: "classes", classes: "classes",
        about: "about", gallery: "gallery",
      };
      if (map[target]) setTab(map[target]);
    }
  }, []);

  return (
    <>
      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .m-fadeup { animation: fadeUp 0.45s ease forwards; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { scrollbar-width: none; }
        .prog-card:active { transform: scale(0.97); }
        .tap-scale:active { transform: scale(0.97); }
      `}</style>

      <div
        className="fixed inset-0 md:hidden"
        style={{ zIndex: 60, background: CREAM, fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {/* ── Scrollable content ── */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll"
          style={{ WebkitOverflowScrolling: "touch", paddingBottom: 68 } as any}
        >
          {tab === "home"    && <HomeTab    setTab={setTab} setMenu={setMenu} />}
          {tab === "classes" && <ClassesTab setMenu={setMenu} />}
          {tab === "gallery" && <GalleryTab setMenu={setMenu} />}
          {tab === "about"   && <AboutTab   setMenu={setMenu} />}
        </div>

        {/* ── Bottom navigation ── */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 70,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid hsl(40,18%,91%)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.07)",
          paddingBottom: "env(safe-area-inset-bottom)",
        } as any}>
          <div style={{ display: "flex", alignItems: "stretch", minHeight: 60, position: "relative" }}>
            <NavBtn active={tab==="home"}    onClick={()=>setTab("home")}    label="Home"    emoji="🏠" />
            <NavBtn active={tab==="classes"} onClick={()=>setTab("classes")} label="Classes" emoji="📅" />

            {/* Elevated Trial FAB */}
            <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <button
                onClick={openTrial}
                className="tap-scale"
                aria-label="Book Free Trial"
                style={{
                  position: "absolute", bottom: 8,
                  width: 54, height: 54, borderRadius: "50%",
                  background: `linear-gradient(135deg, hsl(145,42%,36%), hsl(145,44%,20%))`,
                  boxShadow: "0 4px 20px rgba(40,100,60,0.45), 0 0 0 3px white",
                  border: "none", color: WHITE, fontSize: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", outline: "none",
                  transition: "transform 0.15s",
                  WebkitTapHighlightColor: "transparent",
                } as any}
              >🌿</button>
            </div>

            <NavBtn active={tab==="gallery"} onClick={()=>setTab("gallery")} label="Gallery" emoji="📸" />
            <NavBtn active={tab==="about"}   onClick={()=>setTab("about")}   label="About"   emoji="🌿" />
          </div>
        </div>

        {/* ── Full-screen menu sheet ── */}
        {menu && (
          <>
            <div
              onClick={() => setMenu(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)", zIndex: 200, backdropFilter: "blur(4px)" }}
            />
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
              background: WHITE, borderRadius: "22px 22px 0 0",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
              paddingBottom: "max(32px, env(safe-area-inset-bottom))",
              animation: "fadeUp 0.25s ease",
            }}>
              <div style={{ width: 36, height: 4, background: "hsl(40,18%,86%)", borderRadius: 99, margin: "14px auto 22px" }} />
              {[
                { label: "Home",               emoji: "🏠", fn: () => { setMenu(false); setTab("home");     } },
                { label: "Classes & Schedule", emoji: "📅", fn: () => { setMenu(false); setTab("classes");  } },
                { label: "Meet Our Teacher",   emoji: "🧘", fn: () => { setMenu(false); setTab("about");    } },
                { label: "Gallery",            emoji: "📸", fn: () => { setMenu(false); setTab("gallery");  } },
                { label: "Society & Franchise",emoji: "🏘️", fn: () => { setMenu(false); window.location.href = "/bring-yoga-to-your-society"; } },
                { label: "Let's Connect",      emoji: "📞", fn: () => { setMenu(false); window.open(WA_GENERAL, "_blank"); } },
              ].map(item => (
                <button key={item.label} onClick={item.fn} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  width: "100%", padding: "14px 24px",
                  border: "none", borderBottom: "1px solid hsl(40,18%,95%)",
                  background: "none", cursor: "pointer", textAlign: "left" as const,
                  color: TD, fontSize: 15, fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  WebkitTapHighlightColor: "transparent",
                } as any}>
                  <span style={{ fontSize: 20, width: 28, textAlign: "center" as const }}>{item.emoji}</span>
                  {item.label}
                </button>
              ))}
              <div style={{ padding: "20px 24px 0" }}>
                <button onClick={() => { setMenu(false); openTrial(); }} style={{ ...primaryBtn }}>
                  🌿 Book Free Trial
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════
   SHARED TAB HEADER (non-home tabs)
   ═══════════════════════════════════════ */
const TabHeader = ({ title, sub, setMenu }: { title: string; sub?: string; setMenu: (v: boolean) => void }) => (
  <div style={{
    paddingTop: "max(16px, env(safe-area-inset-top))",
    padding: "max(16px,env(safe-area-inset-top)) 20px 0",
    background: WHITE,
    position: "relative",
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  }}>
    <div>
      <span style={lbl}>{sub || "Feel & Heal Yoga"}</span>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: DG, margin: "4px 0 0", lineHeight: 1.1 }}>{title}</h1>
    </div>
    <button onClick={() => setMenu(true)} style={{
      display: "flex", flexDirection: "column" as const, gap: 5,
      padding: 10, border: "none", background: LG, borderRadius: 12,
      cursor: "pointer", flexShrink: 0, marginTop: 4,
      WebkitTapHighlightColor: "transparent",
    } as any}>
      {[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 18, height: 2, background: DG, borderRadius: 99 }} />)}
    </button>
  </div>
);

/* ═══════════════════════════════════════
   HOME TAB
   ═══════════════════════════════════════ */
interface HomeTabProps { setTab: (t: Tab) => void; setMenu: (v: boolean) => void; }

const HomeTab = ({ setTab, setMenu }: HomeTabProps) => {
  const [batch, setBatch]       = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const touchX = useRef(0);

  return (
    <div className="m-fadeup">

      {/* ── SECTION 1: HERO ── */}
      <section style={{ height: "82dvh", position: "relative", overflow: "hidden" }}>
        <img
          src="/assets/hero-yoga.jpg"
          alt="Feel & Heal Yoga classes in Kharghar"
          loading="eager"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(4,14,8,0.30) 0%, rgba(4,14,8,0.82) 100%)" }} />

        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "max(16px,env(safe-area-inset-top)) 20px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src="/assets/feel-and-heal-yoga-logo.svg"
              alt="Feel & Heal Yoga"
              style={{ width: 28, height: 28, filter: "brightness(0) invert(1)" }}
            />
            <span style={{ color: WHITE, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13 }}>
              Feel &amp; Heal Yoga
            </span>
          </div>
          <button onClick={() => setMenu(true)} style={{
            display: "flex", flexDirection: "column" as const, gap: 5,
            padding: 10, border: "none",
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            borderRadius: 12, cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          } as any}>
            {[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 20, height: 2, background: WHITE, borderRadius: 99 }} />)}
          </button>
        </div>

        {/* Hero headline */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "28%", padding: "0 24px" }}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, margin: "0 0 12px" }}>
            Yoga · Wellness · Healing
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 42, fontWeight: 800, color: WHITE,
            lineHeight: 1.08, margin: "0 0 14px",
          }}>
            Move Better.<br />Breathe Deeper.<br />Feel Better.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, margin: "0 0 8px" }}>
            Online &amp; Offline Yoga · Kharghar, Navi Mumbai
          </p>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 11, margin: 0 }}>
            ★★★★★ 5.0 Rating &nbsp;·&nbsp; 5+ Years &nbsp;·&nbsp; 500+ Students
          </p>
        </div>

        {/* Hero CTAs */}
        <div style={{
          position: "absolute", bottom: "max(24px,calc(env(safe-area-inset-bottom)+20px))",
          left: 24, right: 24,
          display: "flex", flexDirection: "column" as const, gap: 10,
        }}>
          <button
            onClick={openTrial}
            className="tap-scale"
            style={{
              ...primaryBtn,
              boxShadow: "0 6px 24px rgba(40,100,60,0.40)",
            }}
          >
            🌿 Book Free Trial
          </button>
          <button
            onClick={() => document.getElementById("programs-section")?.scrollIntoView({ behavior: "smooth" })}
            className="tap-scale"
            style={{
              width: "100%", padding: "12px 0", borderRadius: 99,
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.32)",
              color: WHITE, fontWeight: 600, fontSize: 13,
              cursor: "pointer", fontFamily: "'Inter', sans-serif",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              WebkitTapHighlightColor: "transparent",
            } as any}
          >
            Explore Classes →
          </button>
        </div>
      </section>

      {/* ── SECTION 2: PROGRAMS (horizontal swipe) ── */}
      <section id="programs-section" style={{ padding: "36px 0 32px", background: CREAM }}>
        <div style={{ padding: "0 20px 18px" }}>
          <span style={lbl}>Find Your Practice</span>
          <h2 style={h2Style}>Our Programs</h2>
        </div>
        <div
          className="hide-scroll"
          style={{
            display: "flex", gap: 14,
            overflowX: "scroll" as const, padding: "4px 20px 16px",
            scrollSnapType: "x mandatory" as const,
            WebkitOverflowScrolling: "touch",
          } as any}
        >
          {PROGRAMS.map((prog, i) => (
            <div
              key={i}
              onClick={openTrial}
              className="prog-card"
              style={{
                minWidth: "70vw", scrollSnapAlign: "start",
                borderRadius: 18, overflow: "hidden",
                flexShrink: 0, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                background: WHITE, transition: "transform 0.15s",
              }}
            >
              <div style={{ position: "relative", height: 170 }}>
                <img
                  src={prog.img}
                  alt={prog.name}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.target as HTMLImageElement).src = "/assets/hero-yoga.jpg"; }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,16,9,0.72) 0%, transparent 55%)" }} />
                <h3 style={{
                  position: "absolute", bottom: 12, left: 14,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800, fontSize: 18, color: WHITE, margin: 0,
                }}>{prog.name}</h3>
              </div>
              <div style={{ padding: "12px 14px 16px" }}>
                <p style={{ color: TM, fontSize: 12, margin: "0 0 10px", lineHeight: 1.5 }}>{prog.desc}</p>
                <span style={{ color: SG, fontSize: 12, fontWeight: 700 }}>Book Free Trial →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: SCHEDULE SELECTOR ── */}
      <section style={{ padding: "0 20px 36px", background: WHITE }}>
        <span style={lbl}>Choose Your Time</span>
        <h2 style={h2Style}>Class Schedule</h2>

        {/* Batch pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {SCHEDULE.map((s, i) => (
            <button key={i} onClick={() => setBatch(i)} style={pill(batch === i) as any}>{s.label}</button>
          ))}
        </div>

        {/* Expanded batch card */}
        <div style={{
          background: CREAM, borderRadius: 18, padding: "22px 20px",
          border: `1px solid hsl(145,20%,89%)`,
          borderLeft: `4px solid ${SCHEDULE[batch].accent}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          transition: "all 0.25s",
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32, fontWeight: 800, color: DG, margin: "0 0 6px",
          }}>{SCHEDULE[batch].time}</h3>
          <p style={{ color: TM, fontSize: 13, margin: "0 0 16px" }}>
            Adults Batch &nbsp;·&nbsp; {SCHEDULE[batch].days}
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <span style={{ background: LG, color: DG, padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>🌐 Online</span>
            <span style={{ background: LG, color: DG, padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>🏠 Offline</span>
          </div>
          <button onClick={openTrial} style={{ ...primaryBtn }} className="tap-scale">Book This Batch →</button>
        </div>
      </section>

      {/* ── SECTION 4: MEET YOUR TEACHER ── */}
      <section style={{ position: "relative", height: 340, overflow: "hidden" }}>
        <img
          src="/assets/instructor-priyanka.jpg"
          alt="Priyanka Sahu — Yoga Teacher"
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,14,8,0.90) 0%, rgba(4,14,8,0.08) 55%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 28px" }}>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 10, letterSpacing: "0.20em", textTransform: "uppercase" as const, margin: "0 0 6px" }}>
            Your Guide
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: WHITE, margin: "0 0 6px" }}>
            Meet Priyanka
          </h2>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 12, margin: "0 0 18px" }}>
            Internationally Certified Yoga Teacher &nbsp;·&nbsp; 5+ Years
          </p>
          <button
            onClick={() => setTab("about")}
            className="tap-scale"
            style={{
              background: "rgba(255,255,255,0.13)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,0.28)",
              color: WHITE, borderRadius: 99,
              padding: "10px 22px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Inter', sans-serif",
              WebkitTapHighlightColor: "transparent",
            } as any}
          >
            Know Your Teacher →
          </button>
        </div>
      </section>

      {/* ── SECTION 5: TESTIMONIALS (swipeable) ── */}
      <section style={{ padding: "36px 20px 32px", background: CREAM }}>
        <span style={lbl}>Real People. Real Progress.</span>

        <div
          style={{ overflow: "hidden" }}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = touchX.current - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 48) {
              if (dx > 0) setReviewIdx(i => Math.min(i + 1, REVIEWS.length - 1));
              else        setReviewIdx(i => Math.max(i - 1, 0));
            }
          }}
        >
          <div style={{
            display: "flex",
            transform: `translateX(${-reviewIdx * 100}%)`,
            transition: "transform 0.36s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ minWidth: "100%", paddingRight: 2 }}>
                <div style={{ color: GOLD, fontSize: 20, marginBottom: 16, letterSpacing: 2 }}>
                  {"★".repeat(r.stars)}
                </div>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 21, fontWeight: 700, color: TD,
                  lineHeight: 1.4, margin: "0 0 16px",
                }}>
                  "{r.text}"
                </p>
                <p style={{ color: TM, fontSize: 13 }}>— {r.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 6, marginTop: 22 }}>
          {REVIEWS.map((_, i) => (
            <button key={i} onClick={() => setReviewIdx(i)} style={{
              width: i === reviewIdx ? 24 : 7, height: 7, borderRadius: 99,
              background: i === reviewIdx ? SG : "hsl(145,15%,82%)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease",
              WebkitTapHighlightColor: "transparent",
            } as any} />
          ))}
        </div>
      </section>

      {/* ── SECTION 6: FINAL CTA ── */}
      <section style={{ margin: "0 16px 40px", borderRadius: 20, overflow: "hidden" }}>
        <div style={{
          background: `linear-gradient(135deg, hsl(145,44%,20%), hsl(155,40%,28%))`,
          padding: "32px 24px", textAlign: "center" as const,
        }}>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 10, letterSpacing: "0.20em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>
            Limited Spots Available
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26, fontWeight: 800, color: WHITE,
            margin: "0 0 12px", lineHeight: 1.2,
          }}>
            Your First Class<br />Is On Us.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, margin: "0 0 24px", lineHeight: 1.5 }}>
            Experience Feel &amp; Heal Yoga before choosing your plan.
          </p>
          <button
            onClick={openTrial}
            className="tap-scale"
            style={{
              width: "100%", padding: "15px 0", borderRadius: 99,
              background: WHITE, color: DG,
              fontWeight: 700, fontSize: 14,
              border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              WebkitTapHighlightColor: "transparent",
            } as any}
          >
            Book Your Free Trial
          </button>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, marginTop: 12 }}>
            Online &amp; Offline Classes Available · Kharghar
          </p>
        </div>
      </section>

    </div>
  );
};

/* ═══════════════════════════════════════
   CLASSES TAB
   ═══════════════════════════════════════ */
const ClassesTab = ({ setMenu }: { setMenu: (v: boolean) => void }) => (
  <div className="m-fadeup">
    <TabHeader title="Class Schedule" sub="Mon – Fri · Kharghar" setMenu={setMenu} />

    <div style={{ padding: "24px 20px 36px" }}>
      {/* Batch cards */}
      {SCHEDULE.map((s, i) => (
        <div key={i} style={{
          background: WHITE, borderRadius: 16, padding: "20px",
          marginBottom: 12,
          borderLeft: `4px solid ${s.accent}`,
          boxShadow: "0 2px 14px rgba(0,0,0,0.055)",
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: TD, margin: "0 0 4px" }}>
            {s.time}
          </h3>
          <p style={{ color: TM, fontSize: 12, margin: "0 0 14px" }}>Adults Batch &nbsp;·&nbsp; {s.days}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: LG, color: DG, padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>🌐 Online</span>
            <span style={{ background: LG, color: DG, padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>🏠 Offline</span>
          </div>
        </div>
      ))}

      {/* Why join — 3 key points */}
      <div style={{ margin: "28px 0 24px" }}>
        <span style={lbl}>Why Feel &amp; Heal?</span>
        <h2 style={{ ...h2Style, fontSize: 22 }}>What Makes Us Different</h2>
        {[
          { emoji: "🌿", title: "Small Intimate Batches",  desc: "Real personal attention — you're never lost in a crowd." },
          { emoji: "🌐", title: "Online & Offline",        desc: "Attend from home or visit us in Kharghar, Navi Mumbai."  },
          { emoji: "👁️", title: "Personal Guidance",       desc: "Your teacher adapts every session to your individual needs." },
        ].map(r => (
          <div key={r.title} style={{
            display: "flex", gap: 14, background: WHITE,
            borderRadius: 14, padding: "16px",
            marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}>
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{r.emoji}</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, color: TD, margin: "0 0 3px" }}>{r.title}</p>
              <p style={{ color: TM, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={openTrial} style={{ ...primaryBtn }} className="tap-scale">
        🌿 Book Free Trial
      </button>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   GALLERY TAB
   ═══════════════════════════════════════ */
const GalleryTab = ({ setMenu }: { setMenu: (v: boolean) => void }) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "solo" | "group">("all");
  const [showAll, setShowAll]           = useState(false);
  const [lightbox, setLightbox]         = useState<number | null>(null);

  const filtered =
    activeFilter === "solo"  ? soloImages
    : activeFilter === "group" ? groupImages
    : allGalleryImages;

  const visible = showAll ? filtered : filtered.slice(0, 8);

  const openLb  = (i: number) => { setLightbox(i); setShowAll(true); };
  const closeLb = () => setLightbox(null);
  const prevLb  = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const nextLb  = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <div className="m-fadeup">
      <TabHeader title="Gallery" sub="Our Studio & Classes" setMenu={setMenu} />

      <div style={{ padding: "20px 20px 0" }}>
        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" as const }}>
          {(["all", "solo", "group"] as const).map(f => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); setShowAll(false); }}
              style={pill(activeFilter === f) as any}
            >
              {f === "all"   ? `All (${allGalleryImages.length})`
               : f === "solo" ? `🧘 Individual (${soloImages.length})`
               :                `👥 Group (${groupImages.length})`}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {visible.map((img, i) => (
            <div
              key={i}
              onClick={() => openLb(i)}
              style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", cursor: "pointer", background: LG }}
            >
              <img
                src={`/assets/images/${encodeURIComponent(img)}`}
                alt={`Yoga class — Photo ${i + 1}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { (e.target as HTMLImageElement).src = "/assets/hero-yoga.jpg"; }}
              />
            </div>
          ))}
        </div>

        {!showAll && filtered.length > 8 && (
          <button
            onClick={() => openLb(0)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "13px 0", borderRadius: 12, marginBottom: 28,
              background: DG, color: WHITE, fontWeight: 700, fontSize: 13,
              border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              WebkitTapHighlightColor: "transparent",
            } as any}
            className="tap-scale"
          >
            Show All {filtered.length} Photos →
          </button>
        )}
      </div>

      {/* YouTube Videos */}
      <div style={{ padding: "8px 20px 36px" }}>
        <span style={lbl}>Yoga Videos</span>
        <h2 style={{ ...h2Style, fontSize: 22 }}>Watch &amp; Learn</h2>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
          {youtubeIds.map((id, i) => (
            <div key={i} style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.10)", background: "#000" }}>
              <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=0&mute=1&rel=0&modestbranding=1`}
                title={`Yoga video ${i + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={closeLb}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.94)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <button onClick={closeLb} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.14)", border: "none", borderRadius: "50%", width: 42, height: 42, color: WHITE, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } as any}>✕</button>
          <button onClick={e => { e.stopPropagation(); prevLb(); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.14)", border: "none", borderRadius: "50%", width: 42, height: 42, color: WHITE, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } as any}>‹</button>
          <img
            src={`/assets/images/${encodeURIComponent(filtered[lightbox])}`}
            alt={`Photo ${lightbox + 1}`}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "92vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 8 }}
            onError={e => { (e.target as HTMLImageElement).src = "/assets/hero-yoga.jpg"; }}
          />
          <button onClick={e => { e.stopPropagation(); nextLb(); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.14)", border: "none", borderRadius: "50%", width: 42, height: 42, color: WHITE, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } as any}>›</button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.55)", color: WHITE, padding: "5px 16px", borderRadius: 99, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   ABOUT TAB
   ═══════════════════════════════════════ */
const AboutTab = ({ setMenu }: { setMenu: (v: boolean) => void }) => (
  <div className="m-fadeup">
    <TabHeader title="Meet Priyanka" sub="Your Yoga Teacher" setMenu={setMenu} />

    {/* Profile */}
    <div style={{ textAlign: "center" as const, padding: "28px 20px 20px" }}>
      <div style={{
        width: 120, height: 120, borderRadius: "50%",
        border: `3px solid ${SG}`,
        overflow: "hidden", margin: "0 auto 16px",
        boxShadow: `0 4px 24px rgba(40,100,60,0.22)`,
      }}>
        <img
          src="/assets/instructor-priyanka.jpg"
          alt="Priyanka Sahu"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }}
        />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: DG, margin: "0 0 4px" }}>
        Priyanka Sahu
      </h2>
      <p style={{ color: TM, fontSize: 13, margin: "0 0 20px" }}>Yoga Teacher &nbsp;·&nbsp; Wellness Expert</p>

      {/* Credential chips */}
      <div className="hide-scroll" style={{ display: "flex", gap: 8, overflowX: "scroll" as const, padding: "0 0 2px", justifyContent: "flex-start" } as any}>
        {CREDENTIALS.map((c, i) => (
          <span key={i} style={{
            flexShrink: 0, background: LG, color: DG,
            padding: "7px 14px", borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" as const,
          }}>
            {c}
          </span>
        ))}
      </div>
    </div>

    {/* Bio */}
    <div style={{ padding: "0 20px 24px", textAlign: "center" as const }}>
      <p style={{ color: TM, fontSize: 14, lineHeight: 1.65 }}>
        With 5+ years of teaching experience, Priyanka specialises in Hatha Yoga, Vinyasa Flow, Pranayama and therapeutic yoga — guiding every student with patience, care, and genuine dedication to their wellbeing.
      </p>
    </div>

    <div style={{ height: 1, background: "hsl(40,18%,91%)", margin: "0 20px 28px" }} />

    {/* Contact */}
    <div style={{ padding: "0 20px" }}>
      <span style={lbl}>Get In Touch</span>
      <h2 style={{ ...h2Style, fontSize: 22 }}>Contact Us</h2>

      <a href={WA_BOOK} target="_blank" rel="noopener noreferrer" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "14px 0", borderRadius: 99,
        background: "#25D366", color: WHITE,
        fontWeight: 700, fontSize: 14, textDecoration: "none",
        marginBottom: 10, fontFamily: "'Inter', sans-serif",
        WebkitTapHighlightColor: "transparent",
      } as any} className="tap-scale">
        💬 Chat on WhatsApp
      </a>

      <a href="tel:+919920155875" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "13px 0", borderRadius: 99,
        background: LG, color: DG,
        fontWeight: 700, fontSize: 14, textDecoration: "none",
        marginBottom: 20, fontFamily: "'Inter', sans-serif",
        WebkitTapHighlightColor: "transparent",
      } as any} className="tap-scale">
        📞 +91 99201 55875
      </a>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "12px 0", borderRadius: 14,
          background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
          color: WHITE, fontWeight: 600, fontSize: 12, textDecoration: "none",
          fontFamily: "'Inter', sans-serif",
        } as any}>📸 Instagram</a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "12px 0", borderRadius: 14,
          background: "#0077B5", color: WHITE,
          fontWeight: 600, fontSize: 12, textDecoration: "none",
          fontFamily: "'Inter', sans-serif",
        } as any}>💼 LinkedIn</a>
      </div>

      {/* Location */}
      <div style={{ background: CREAM, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>📍</span>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, color: TD, margin: "0 0 3px" }}>Studio Location</p>
          <p style={{ color: TM, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
            Club House, Adhiraj Garden,<br />Sector 5, Kharghar, Navi Mumbai – 410210
          </p>
        </div>
      </div>

      {/* Society + Franchise links */}
      <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
        <a href="/bring-yoga-to-your-society" style={{
          flex: 1, display: "flex", flexDirection: "column" as const, gap: 4,
          padding: "16px", borderRadius: 14, background: LG, textDecoration: "none",
        } as any}>
          <span style={{ fontSize: 20 }}>🏘️</span>
          <span style={{ fontWeight: 700, fontSize: 12, color: DG }}>Society Yoga</span>
          <span style={{ fontSize: 11, color: TM }}>Bring yoga to your community</span>
        </a>
        <a href="/franchise-with-us" style={{
          flex: 1, display: "flex", flexDirection: "column" as const, gap: 4,
          padding: "16px", borderRadius: 14, background: LG, textDecoration: "none",
        } as any}>
          <span style={{ fontSize: 20 }}>🤝</span>
          <span style={{ fontWeight: 700, fontSize: 12, color: DG }}>Franchise</span>
          <span style={{ fontSize: 11, color: TM }}>Partner with us</span>
        </a>
      </div>
    </div>
  </div>
);

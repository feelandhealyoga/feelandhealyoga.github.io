import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   TYPES & LINKS
───────────────────────────────────────────── */
type Tab = "home" | "book" | "gallery" | "about";

const WA_BOOK    = "https://wa.me/919920155875?text=Namaste!%20I%27d%20like%20to%20book%20a%20FREE%20trial%20yoga%20class.";
const WA_GENERAL = "https://wa.me/919920155875";
const INSTAGRAM  = "https://www.instagram.com/feelandhealyoga/";
const LINKEDIN   = "https://www.linkedin.com/company/feel-heal-yoga/";
const openTrial  = () => window.dispatchEvent(new CustomEvent("open-yogi-trial"));

/* ─────────────────────────────────────────────
   PALETTE  (warm off-white · sage · charcoal)
───────────────────────────────────────────── */
const C = {
  bg:     "#F9F6F1",   // warm off-white page bg
  card:   "#FFFFFF",   // pure white cards
  green:  "#2D6A4F",   // deep forest green
  sage:   "#52796F",   // sage green
  mint:   "#EAF2EE",   // light mint tint
  ink:    "#1A1F1C",   // near-black text
  muted:  "#7A8A82",   // muted text
  gold:   "#C48B2F",   // warm gold
  line:   "#E8EDE9",   // divider lines
};

/* ─────────────────────────────────────────────
   GALLERY DATA
───────────────────────────────────────────── */
const soloImages = ["WhatsApp Image 2026-01-22 at 22.08.35.jpeg"];

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

const allImages = [...soloImages, ...groupImages];

const youtubeIds = [
  "29PJnLn8xxU","9f8V18vKlbY","NY0STA5U1RQ",
  "jgO2-SUE6Fw","rXBB5g1aixo","FoSUPzcJyB4",
];

/* ─────────────────────────────────────────────
   CONTENT
───────────────────────────────────────────── */
const BATCHES = [
  { time: "6:00 – 7:00 AM",  label: "Early Morning", days: "Mon – Fri" },
  { time: "8:00 – 9:00 AM",  label: "Morning",       days: "Mon – Fri" },
  { time: "7:30 – 8:30 PM",  label: "Evening",       days: "Mon – Fri" },
];

const PROGRAMS = [
  { name: "Weight Loss",       img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(3).jpeg" },
  { name: "Back Pain Relief",  img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(4).jpeg" },
  { name: "Women's Wellness",  img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(1).jpeg" },
  { name: "Meditation",        img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03.jpeg"        },
  { name: "Prenatal Yoga",     img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(6).jpeg" },
  { name: "Personal Training", img: "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(5).jpeg" },
];

const REVIEWS = [
  { name: "Priya M.",  text: "Best yoga studio in Navi Mumbai! The personal attention is incredible." },
  { name: "Rahul S.",  text: "Lost 8 kg in 3 months. The teacher genuinely cares about every student." },
  { name: "Sneha K.",  text: "The Women's batch is so warm and welcoming. I love every session!" },
];

const CREDS = [
  "Internationally Certified", "Hatha & Vinyasa", "Pranayama",
  "Pre & Post Natal", "Naturopathy Diploma", "5+ Years",
];

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

  .ma-root { -webkit-font-smoothing: antialiased; }
  .ma-root * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  @keyframes ma-rise { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .ma-rise { animation: ma-rise 0.4s ease both; }

  .ma-scroll::-webkit-scrollbar { display: none; }
  .ma-scroll { scrollbar-width: none; }

  .ma-btn:active { opacity: 0.82; transform: scale(0.98); }
  .ma-img-card:active { transform: scale(0.97); }

  /* Nav active dot */
  .ma-nav-dot { transition: transform 0.25s ease, opacity 0.25s ease; }
`;

/* ─────────────────────────────────────────────
   SHELL
───────────────────────────────────────────── */
export const MobileApp = () => {
  const [tab,  setTab]  = useState<Tab>("home");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("mobileTargetTab");
    if (t) {
      sessionStorage.removeItem("mobileTargetTab");
      const map: Record<string, Tab> = {
        home: "home", schedule: "book", classes: "book",
        about: "about", gallery: "gallery",
      };
      if (map[t]) setTab(map[t]);
    }
  }, []);

  return (
    <>
      <style>{G}</style>

      {/* ── Shell: only on mobile ── */}
      <div
        className="fixed inset-0 md:hidden flex flex-col ma-root"
        style={{ zIndex: 60, background: C.bg, fontFamily: "'Inter', sans-serif", overflow: "hidden" }}
      >
        {/* ── Scrollable content ── */}
        <div
          className="flex-1 overflow-y-auto ma-scroll"
          style={{ WebkitOverflowScrolling: "touch", overflowX: "hidden" } as any}
        >
          {tab === "home"    && <HomeScreen    setTab={setTab} setMenu={setMenu} />}
          {tab === "book"    && <BookScreen    setMenu={setMenu} />}
          {tab === "gallery" && <GalleryScreen setMenu={setMenu} />}
          {tab === "about"   && <AboutScreen   setMenu={setMenu} />}
        </div>

        {/* ── Bottom tab bar ── */}
        <BottomBar tab={tab} setTab={setTab} />

        {/* ── Menu drawer ── */}
        {menu && <MenuDrawer onClose={() => setMenu(false)} setTab={setTab} />}
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   BOTTOM BAR
───────────────────────────────────────────── */
const BottomBar = ({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) => {
  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home",    label: "Home",    icon: <HomeIcon    active={tab === "home"}    /> },
    { id: "book",    label: "Classes", icon: <ClassesIcon active={tab === "book"}    /> },
    { id: "gallery", label: "Gallery", icon: <GalleryIcon active={tab === "gallery"} /> },
    { id: "about",   label: "About",   icon: <AboutIcon   active={tab === "about"}   /> },
  ];

  return (
    <div style={{
      flexShrink: 0,
      background: C.card,
      borderTop: `1px solid ${C.line}`,
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {/* Trial strip */}
      <button
        onClick={openTrial}
        className="ma-btn"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "10px 0",
          background: C.green, border: "none", cursor: "pointer",
          color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em",
          fontFamily: "'Inter', sans-serif",
          transition: "transform 0.15s, opacity 0.15s",
        } as any}
      >
        <LeafIcon />
        Book Your Free Trial
      </button>

      {/* Tabs */}
      <div style={{ display: "flex" }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 4, padding: "10px 0",
              border: "none", background: "none", cursor: "pointer",
              color: tab === item.id ? C.green : C.muted,
              fontFamily: "'Inter', sans-serif",
              transition: "color 0.2s",
            } as any}
          >
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: tab === item.id ? 600 : 400 }}>
              {item.label}
            </span>
            {/* Active dot */}
            <span style={{
              width: 4, height: 4, borderRadius: "50%",
              background: tab === item.id ? C.green : "transparent",
              transition: "background 0.2s",
            }} />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TOP HEADER (shared by non-home tabs)
───────────────────────────────────────────── */
const TopBar = ({ title, setMenu }: { title: string; setMenu: (v: boolean) => void }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "max(16px, env(safe-area-inset-top)) 20px 14px",
    background: C.card,
    borderBottom: `1px solid ${C.line}`,
    position: "sticky", top: 0, zIndex: 10,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img
        src="/assets/feel-and-heal-yoga-logo.svg"
        alt="Feel & Heal Yoga"
        style={{ width: 28, height: 28 }}
      />
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 17, fontWeight: 600, color: C.green, letterSpacing: "0.01em",
      }}>
        {title}
      </span>
    </div>
    <button
      onClick={() => setMenu(true)}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: C.ink }}
    >
      <MenuIcon />
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   HOME SCREEN
───────────────────────────────────────────── */
const HomeScreen = ({
  setTab, setMenu,
}: { setTab: (t: Tab) => void; setMenu: (v: boolean) => void }) => {
  const [reviewIdx, setReviewIdx] = useState(0);
  const [batch,     setBatch]     = useState(0);
  const touchX = useRef(0);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "72dvh", overflow: "hidden" }}>
        <img
          src="/assets/hero-yoga.jpg"
          alt="Feel & Heal Yoga"
          loading="eager"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* Gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(10,20,14,0.20) 0%, rgba(10,20,14,0.75) 100%)",
        }} />

        {/* Header inside hero */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "max(16px, env(safe-area-inset-top)) 20px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src="/assets/feel-and-heal-yoga-logo.svg"
              alt="Feel & Heal Yoga"
              style={{ width: 26, height: 26, filter: "brightness(0) invert(1)" }}
            />
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "0.01em",
            }}>
              Feel &amp; Heal Yoga
            </span>
          </div>
          <button
            onClick={() => setMenu(true)}
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer" } as any}
          >
            <MenuIcon white />
          </button>
        </div>

        {/* Hero text */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 32px",
        }}>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 500 }}>
            Yoga · Wellness · Healing
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 44, fontWeight: 600, color: "#fff",
            lineHeight: 1.05, margin: "0 0 10px",
            fontStyle: "italic",
          }}>
            Move Better.<br />Feel Better.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 12, margin: "0 0 20px" }}>
            Online &amp; Offline · Kharghar, Navi Mumbai
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={openTrial}
              className="ma-btn"
              style={{
                flex: 1, padding: "12px 0", borderRadius: 6,
                background: C.green, border: "none", cursor: "pointer",
                color: "#fff", fontSize: 13, fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                transition: "transform 0.15s, opacity 0.15s",
              } as any}
            >
              Book Free Trial
            </button>
            <button
              onClick={() => setTab("book")}
              className="ma-btn"
              style={{
                flex: 1, padding: "12px 0", borderRadius: 6,
                background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.28)",
                cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                transition: "transform 0.15s, opacity 0.15s",
              } as any}
            >
              View Classes
            </button>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{
        display: "flex", justifyContent: "space-around",
        padding: "18px 20px",
        background: C.card,
        borderBottom: `1px solid ${C.line}`,
      }}>
        {[
          { val: "5.0★", lbl: "Google Rating" },
          { val: "5+",   lbl: "Years Active"  },
          { val: "500+", lbl: "Students"       },
        ].map(s => (
          <div key={s.lbl} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: C.green }}>
              {s.val}
            </div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 400, letterSpacing: "0.04em" }}>
              {s.lbl}
            </div>
          </div>
        ))}
      </section>

      {/* ── PROGRAMS ── */}
      <section style={{ padding: "32px 0 0" }}>
        <SectionLabel text="Our Programs" sub="Find your practice" />
        <div
          className="ma-scroll"
          style={{
            display: "flex", gap: 12, padding: "16px 20px 28px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          } as any}
        >
          {PROGRAMS.map((p, i) => (
            <div
              key={i}
              onClick={openTrial}
              className="ma-img-card"
              style={{
                minWidth: 150, height: 200,
                borderRadius: 10, overflow: "hidden",
                flexShrink: 0, cursor: "pointer",
                position: "relative",
                scrollSnapAlign: "start",
                transition: "transform 0.15s",
              }}
            >
              <img
                src={p.img} alt={p.name} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { (e.target as HTMLImageElement).src = "/assets/hero-yoga.jpg"; }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(10,20,14,0.80) 0%, transparent 55%)",
              }} />
              <p style={{
                position: "absolute", bottom: 12, left: 12, right: 8,
                color: "#fff", fontFamily: "'Cormorant Garamond', serif",
                fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.2,
              }}>{p.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCHEDULE PREVIEW ── */}
      <section style={{ padding: "0 20px 32px" }}>
        <SectionLabel text="Class Timings" sub="All batches — Mon to Fri" />

        {/* Batch tabs */}
        <div style={{ display: "flex", gap: 6, margin: "14px 0 16px" }}>
          {BATCHES.map((b, i) => (
            <button
              key={i}
              onClick={() => setBatch(i)}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 6, border: "none",
                background: batch === i ? C.green : C.mint,
                color: batch === i ? "#fff" : C.sage,
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              } as any}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div style={{
          background: C.card, borderRadius: 10, padding: "18px 18px 16px",
          border: `1px solid ${C.line}`,
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
            {BATCHES[batch].time}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
            {BATCHES[batch].days} &nbsp;·&nbsp; Online &amp; Offline
          </div>
          <button
            onClick={openTrial}
            className="ma-btn"
            style={{
              width: "100%", padding: "11px 0", borderRadius: 6,
              background: C.green, border: "none", cursor: "pointer",
              color: "#fff", fontSize: 13, fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              transition: "transform 0.15s, opacity 0.15s",
            } as any}
          >
            Book This Batch →
          </button>
        </div>
      </section>

      {/* ── TEACHER ── */}
      <section style={{ margin: "0 20px 32px", borderRadius: 12, overflow: "hidden", position: "relative", height: 260 }}>
        <img
          src="/assets/instructor-priyanka.jpg"
          alt="Priyanka Sahu"
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,20,14,0.88) 0%, rgba(10,20,14,0.10) 55%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 5px" }}>Your Teacher</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#fff", margin: "0 0 3px" }}>Priyanka Sahu</p>
          <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 12, margin: "0 0 14px" }}>Internationally Certified Yoga Teacher</p>
          <button
            onClick={() => setTab("about")}
            className="ma-btn"
            style={{
              background: "rgba(255,255,255,0.14)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 6, padding: "8px 16px",
              color: "#fff", fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "transform 0.15s, opacity 0.15s",
            } as any}
          >
            Know More →
          </button>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "0 20px 36px" }}>
        <SectionLabel text="Reviews" sub="Real people, real results" />

        <div
          style={{ overflow: "hidden", marginTop: 14 }}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = touchX.current - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 44) {
              if (dx > 0) setReviewIdx(i => Math.min(i + 1, REVIEWS.length - 1));
              else        setReviewIdx(i => Math.max(i - 1, 0));
            }
          }}
        >
          <div style={{
            display: "flex",
            transform: `translateX(${-reviewIdx * 100}%)`,
            transition: "transform 0.35s ease",
          }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ minWidth: "100%", paddingRight: 4 }}>
                <div style={{ background: C.card, borderRadius: 10, padding: "20px", border: `1px solid ${C.line}` }}>
                  <div style={{ color: C.gold, fontSize: 15, marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 400, fontStyle: "italic",
                    color: C.ink, lineHeight: 1.45, margin: "0 0 14px",
                  }}>
                    "{r.text}"
                  </p>
                  <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>— {r.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 14 }}>
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setReviewIdx(i)}
              style={{
                width: i === reviewIdx ? 20 : 6, height: 6, borderRadius: 99,
                background: i === reviewIdx ? C.green : C.line,
                border: "none", padding: 0, cursor: "pointer",
                transition: "all 0.3s",
              } as any}
            />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        margin: "0 20px 40px", borderRadius: 12, overflow: "hidden",
        background: C.green, padding: "32px 24px", textAlign: "center",
      }}>
        <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 10px" }}>
          Limited Spots
        </p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28, fontWeight: 600, color: "#fff",
          margin: "0 0 8px", lineHeight: 1.15, fontStyle: "italic",
        }}>
          Your first class<br />is on us.
        </p>
        <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 12, margin: "0 0 22px" }}>
          Online &amp; Offline · Kharghar, Navi Mumbai
        </p>
        <button
          onClick={openTrial}
          className="ma-btn"
          style={{
            width: "100%", padding: "13px 0", borderRadius: 6,
            background: "#fff", border: "none", cursor: "pointer",
            color: C.green, fontSize: 14, fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            transition: "transform 0.15s, opacity 0.15s",
          } as any}
        >
          Book Free Trial
        </button>
      </section>
    </div>
  );
};

/* ─────────────────────────────────────────────
   BOOK / CLASSES SCREEN
───────────────────────────────────────────── */
const BookScreen = ({ setMenu }: { setMenu: (v: boolean) => void }) => {
  const [batch, setBatch] = useState(0);

  return (
    <div className="ma-rise">
      <TopBar title="Classes" setMenu={setMenu} />
      <div style={{ padding: "24px 20px 40px" }}>

        <SectionLabel text="Choose Your Time" sub="All batches — Mon to Fri" />

        {/* Batch tabs */}
        <div style={{ display: "flex", gap: 8, margin: "14px 0 18px" }}>
          {BATCHES.map((b, i) => (
            <button key={i} onClick={() => setBatch(i)} style={{
              flex: 1, padding: "9px 0", borderRadius: 6, border: "none",
              background: batch === i ? C.green : C.mint,
              color: batch === i ? "#fff" : C.sage,
              fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
            } as any}>{b.label}</button>
          ))}
        </div>

        {/* Active batch card */}
        <div style={{
          background: C.card, borderRadius: 10, padding: "22px 20px 20px",
          border: `1px solid ${C.line}`, marginBottom: 24,
          borderLeft: `3px solid ${C.green}`,
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
            {BATCHES[batch].time}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
            {BATCHES[batch].days} &nbsp;·&nbsp; Adults
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <Tag label="🌐 Online" />
            <Tag label="🏠 Offline" />
          </div>
          <button onClick={openTrial} className="ma-btn" style={{
            width: "100%", padding: "12px 0", borderRadius: 6,
            background: C.green, border: "none", cursor: "pointer",
            color: "#fff", fontSize: 13, fontWeight: 600,
            fontFamily: "'Inter', sans-serif", transition: "transform 0.15s, opacity 0.15s",
          } as any}>Book This Batch →</button>
        </div>

        {/* Divider */}
        <Divider />

        <SectionLabel text="Why Join?" sub="What makes us different" />
        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 14 }}>
          {[
            { e: "🌿", h: "Small Batches",     d: "Personal attention every session" },
            { e: "🌐", h: "Online & Offline",   d: "Attend from home or visit Kharghar" },
            { e: "👁", h: "Personal Guidance",  d: "Adapted to your body and goals" },
            { e: "⭐", h: "5.0 Google Rating",  d: "Loved by 500+ students" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 0", borderBottom: i < 3 ? `1px solid ${C.line}` : "none",
            }}>
              <span style={{ fontSize: 20, width: 30, textAlign: "center", flexShrink: 0 }}>{r.e}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: 13, color: C.ink, margin: "0 0 2px" }}>{r.h}</p>
                <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>{r.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   GALLERY SCREEN
───────────────────────────────────────────── */
const GalleryScreen = ({ setMenu }: { setMenu: (v: boolean) => void }) => {
  const [filter,   setFilter]   = useState<"all" | "solo" | "group">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [videos,   setVideos]   = useState(false);

  const filtered = filter === "solo" ? soloImages : filter === "group" ? groupImages : allImages;

  const prev = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <div className="ma-rise">
      <TopBar title="Gallery" setMenu={setMenu} />

      <div style={{ padding: "20px" }}>
        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {(["all", "solo", "group"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 14px", borderRadius: 6, border: "none",
              background: filter === f ? C.green : C.mint,
              color: filter === f ? "#fff" : C.sage,
              fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
            } as any}>
              {f === "all" ? `All (${allImages.length})` : f === "solo" ? `Individual (${soloImages.length})` : `Group (${groupImages.length})`}
            </button>
          ))}
        </div>

        {/* Masonry-style 2-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {filtered.slice(0, 12).map((img, i) => (
            <div
              key={i}
              onClick={() => setLightbox(i)}
              style={{
                borderRadius: 8, overflow: "hidden", cursor: "pointer",
                aspectRatio: i % 5 === 0 ? "3/4" : "1",
                background: C.mint,
              }}
            >
              <img
                src={`/assets/images/${encodeURIComponent(img)}`}
                alt={`Photo ${i + 1}`} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => { (e.target as HTMLImageElement).src = "/assets/hero-yoga.jpg"; }}
              />
            </div>
          ))}
        </div>

        {filtered.length > 12 && (
          <button onClick={() => setLightbox(0)} className="ma-btn" style={{
            width: "100%", padding: "12px 0", borderRadius: 6, marginBottom: 24,
            background: C.green, border: "none", cursor: "pointer",
            color: "#fff", fontSize: 13, fontWeight: 600,
            fontFamily: "'Inter', sans-serif", transition: "transform 0.15s, opacity 0.15s",
          } as any}>View All {filtered.length} Photos</button>
        )}

        <Divider />

        {/* Videos */}
        <div style={{ marginTop: 20 }}>
          <SectionLabel text="Yoga Videos" sub="Watch & learn" />
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {youtubeIds.map((id, i) => (
              <div key={i} style={{ borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                  title={`Yoga video ${i + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen loading="lazy"
                  style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } as any}>✕</button>
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } as any}>‹</button>
          <img
            src={`/assets/images/${encodeURIComponent(filtered[lightbox])}`}
            alt={`Photo ${lightbox + 1}`}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "92vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 6 }}
            onError={e => { (e.target as HTMLImageElement).src = "/assets/hero-yoga.jpg"; }}
          />
          <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } as any}>›</button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.55)", color: "#fff", padding: "5px 14px", borderRadius: 99, fontSize: 11, fontFamily: "'Inter', sans-serif" }}>
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   ABOUT SCREEN
───────────────────────────────────────────── */
const AboutScreen = ({ setMenu }: { setMenu: (v: boolean) => void }) => (
  <div className="ma-rise">
    <TopBar title="About" setMenu={setMenu} />

    <div style={{ padding: "32px 20px 48px" }}>

      {/* Profile */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          border: `2px solid ${C.green}`,
          overflow: "hidden", margin: "0 auto 16px",
          boxShadow: "0 4px 20px rgba(45,106,79,0.18)",
        }}>
          <img
            src="/assets/instructor-priyanka.jpg"
            alt="Priyanka Sahu"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 12%" }}
          />
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: C.green, margin: "0 0 4px" }}>
          Priyanka Sahu
        </h1>
        <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Yoga Teacher &nbsp;·&nbsp; Wellness Expert</p>

        {/* Credential chips */}
        <div className="ma-scroll" style={{ display: "flex", gap: 7, overflowX: "auto", marginTop: 16, justifyContent: "flex-start" } as any}>
          {CREDS.map((c, i) => (
            <span key={i} style={{
              flexShrink: 0, background: C.mint, color: C.sage,
              padding: "5px 12px", borderRadius: 4, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
            }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Bio */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 18, fontWeight: 400, fontStyle: "italic",
        color: C.ink, lineHeight: 1.6, textAlign: "center", marginBottom: 28,
      }}>
        "5+ years guiding students through Hatha, Vinyasa, Pranayama &amp; therapeutic yoga with patience and genuine dedication."
      </p>

      <Divider />

      {/* Contact */}
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <SectionLabel text="Get In Touch" />

        <a href={WA_BOOK} target="_blank" rel="noopener noreferrer" className="ma-btn" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "13px 0", borderRadius: 6,
          background: "#25D366", color: "#fff",
          fontWeight: 600, fontSize: 13, textDecoration: "none",
          fontFamily: "'Inter', sans-serif",
          transition: "transform 0.15s, opacity 0.15s",
        } as any}>
          💬 Chat on WhatsApp
        </a>

        <a href="tel:+919920155875" className="ma-btn" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "12px 0", borderRadius: 6,
          background: C.mint, color: C.green,
          fontWeight: 600, fontSize: 13, textDecoration: "none",
          fontFamily: "'Inter', sans-serif",
          transition: "transform 0.15s, opacity 0.15s",
        } as any}>
          📞 +91 99201 55875
        </a>

        <div style={{ display: "flex", gap: 8 }}>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="ma-btn" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "11px 0", borderRadius: 6,
            background: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)",
            color: "#fff", fontWeight: 600, fontSize: 12, textDecoration: "none",
            fontFamily: "'Inter', sans-serif",
            transition: "transform 0.15s, opacity 0.15s",
          } as any}>📸 Instagram</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="ma-btn" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "11px 0", borderRadius: 6,
            background: "#0077B5", color: "#fff",
            fontWeight: 600, fontSize: 12, textDecoration: "none",
            fontFamily: "'Inter', sans-serif",
            transition: "transform 0.15s, opacity 0.15s",
          } as any}>💼 LinkedIn</a>
        </div>
      </div>

      <Divider />

      {/* Location */}
      <div style={{ marginTop: 24, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>📍</span>
        <div>
          <p style={{ fontWeight: 600, fontSize: 13, color: C.ink, margin: "0 0 3px" }}>Studio</p>
          <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            Club House, Adhiraj Garden,<br />Sector 5, Kharghar, Navi Mumbai – 410210
          </p>
        </div>
      </div>

      {/* Society + Franchise */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <a href="/bring-yoga-to-your-society" style={{
          flex: 1, display: "flex", flexDirection: "column", gap: 5,
          padding: "14px", borderRadius: 8, background: C.mint, textDecoration: "none",
        } as any}>
          <span style={{ fontSize: 22 }}>🏘️</span>
          <span style={{ fontWeight: 700, fontSize: 12, color: C.green }}>Society Yoga</span>
          <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>Bring yoga to your community</span>
        </a>
        <a href="/franchise-with-us" style={{
          flex: 1, display: "flex", flexDirection: "column", gap: 5,
          padding: "14px", borderRadius: 8, background: C.mint, textDecoration: "none",
        } as any}>
          <span style={{ fontSize: 22 }}>🤝</span>
          <span style={{ fontWeight: 700, fontSize: 12, color: C.green }}>Franchise</span>
          <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>Partner with us</span>
        </a>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MENU DRAWER
───────────────────────────────────────────── */
const MenuDrawer = ({ onClose, setTab }: { onClose: () => void; setTab: (t: Tab) => void }) => (
  <>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,20,14,0.50)", zIndex: 200, backdropFilter: "blur(3px)" }} />
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
      background: "#fff", borderRadius: "20px 20px 0 0",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
      paddingBottom: "max(28px, env(safe-area-inset-bottom))",
    }}>
      <div style={{ width: 36, height: 4, background: C.line, borderRadius: 99, margin: "14px auto 20px" }} />
      {[
        { label: "Home",               fn: () => { onClose(); setTab("home");    } },
        { label: "Classes & Schedule", fn: () => { onClose(); setTab("book");    } },
        { label: "Gallery",            fn: () => { onClose(); setTab("gallery"); } },
        { label: "About / Contact",    fn: () => { onClose(); setTab("about");   } },
        { label: "Society Yoga",       fn: () => { onClose(); window.location.href = "/bring-yoga-to-your-society"; } },
        { label: "Franchise",          fn: () => { onClose(); window.location.href = "/franchise-with-us"; } },
      ].map((item, i, arr) => (
        <button key={item.label} onClick={item.fn} style={{
          display: "block", width: "100%", padding: "15px 24px",
          border: "none", borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : "none",
          background: "none", cursor: "pointer", textAlign: "left",
          color: C.ink, fontSize: 15, fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
        } as any}>{item.label}</button>
      ))}
      <div style={{ padding: "20px 24px 0" }}>
        <button onClick={() => { onClose(); openTrial(); }} className="ma-btn" style={{
          width: "100%", padding: "13px 0", borderRadius: 6,
          background: C.green, border: "none", cursor: "pointer",
          color: "#fff", fontSize: 14, fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          transition: "transform 0.15s, opacity 0.15s",
        } as any}>Book Free Trial</button>
      </div>
    </div>
  </>
);

/* ─────────────────────────────────────────────
   TINY SHARED ATOMS
───────────────────────────────────────────── */
const SectionLabel = ({ text, sub }: { text: string; sub?: string }) => (
  <div>
    {sub && <p style={{ fontSize: 10, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 500 }}>{sub}</p>}
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: C.green, margin: 0, lineHeight: 1.1 }}>{text}</h2>
  </div>
);

const Tag = ({ label }: { label: string }) => (
  <span style={{ background: C.mint, color: C.sage, padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{label}</span>
);

const Divider = () => (
  <div style={{ height: 1, background: C.line, margin: "8px 0" }} />
);

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */
const HomeIcon    = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? C.green : "none"} stroke={active ? C.green : C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ClassesIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? C.green : C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const GalleryIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? C.green : C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const AboutIcon   = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? C.green : C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuIcon = ({ white = false }: { white?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={white ? "#fff" : C.ink} strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const LeafIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

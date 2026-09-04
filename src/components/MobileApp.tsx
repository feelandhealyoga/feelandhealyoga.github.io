import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────
   LINKS & EVENTS
───────────────────────────────────────*/
const WA = "https://wa.me/919920155875?text=Namaste!%20I%27d%20like%20to%20book%20a%20FREE%20trial%20yoga%20class.";
const WA_G = "https://wa.me/919920155875";
const IG = "https://www.instagram.com/feelandhealyoga/";
const LI = "https://www.linkedin.com/company/feel-heal-yoga/";

const openTrial = () => window.dispatchEvent(new CustomEvent("open-yogi-trial"));
const openYogi  = () => window.dispatchEvent(new CustomEvent("open-yogi-chat"));

/* ─────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────*/
const T = {
  green:  "#1B4332",
  sage:   "#40916C",
  mint:   "#EEF6F1",
  white:  "#FFFFFF",
  bg:     "#F8FAF9",
  ink:    "#111C17",
  muted:  "#6B7E78",
  border: "#DDE8E3",
  gold:   "#C48B2F",
  yogi:   "#0A3D2B",   // deeper for Yogi
};

/* ─────────────────────────────────────
   DATA
───────────────────────────────────────*/
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
const soloImages = ["WhatsApp Image 2026-01-22 at 22.08.35.jpeg"];
const allImages  = [...soloImages, ...groupImages];

const youtubeIds = ["29PJnLn8xxU","9f8V18vKlbY","NY0STA5U1RQ","jgO2-SUE6Fw","rXBB5g1aixo","FoSUPzcJyB4"];

const BATCHES = [
  { short:"6 AM",    label:"Early Morning", time:"6:00 – 7:00 AM",  days:"Mon – Fri" },
  { short:"8 AM",    label:"Morning",       time:"8:00 – 9:00 AM",  days:"Mon – Fri" },
  { short:"7:30 PM", label:"Evening",       time:"7:30 – 8:30 PM",  days:"Mon – Fri" },
];

const PROGRAMS = [
  { name:"Weight Loss",        img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(3).jpeg" },
  { name:"Back Pain",          img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(4).jpeg" },
  { name:"Women's Wellness",   img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(1).jpeg" },
  { name:"Meditation",         img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03.jpeg"        },
  { name:"Prenatal Yoga",      img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(6).jpeg" },
  { name:"1-on-1 Training",    img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(5).jpeg" },
];

const REVIEWS = [
  { name:"Priya M.",  text:"Best yoga studio in Navi Mumbai! The personal attention is incredible." },
  { name:"Rahul S.",  text:"Lost 8 kg in 3 months. The teacher genuinely cares about every student." },
  { name:"Sneha K.",  text:"The Women's batch is so warm and welcoming. I love every session!" },
];

/* ─────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────*/
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

  .fh * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  .fh { -webkit-font-smoothing:antialiased; }

  /* Scrollbar hide */
  .fh-scroll::-webkit-scrollbar { display:none; }
  .fh-scroll { scrollbar-width:none; }

  /* Fade-up enter */
  @keyframes fhIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .fh-in { animation: fhIn 0.35s ease both; }

  /* Yogi pulse ring */
  @keyframes yogiRing {
    0%   { box-shadow: 0 0 0 0px rgba(27,67,50,0.50), 0 6px 24px rgba(27,67,50,0.45); }
    70%  { box-shadow: 0 0 0 12px rgba(27,67,50,0), 0 6px 24px rgba(27,67,50,0.45); }
    100% { box-shadow: 0 0 0 0px rgba(27,67,50,0), 0 6px 24px rgba(27,67,50,0.45); }
  }
  .yogi-ring { animation: yogiRing 2.4s ease-in-out infinite; }

  /* Tap feedback */
  .fh-tap { transition: transform 0.12s ease, opacity 0.12s ease; }
  .fh-tap:active { transform: scale(0.96); opacity:0.85; }

  /* Active pill slide */
  @keyframes pillPop { from{transform:scale(0.80);opacity:0} to{transform:scale(1);opacity:1} }
  .pill-pop { animation: pillPop 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* Horizontal swipe */
  .fh-swipe { display:flex; overflow-x:auto; gap:12px; scrollbar-width:none; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; }
  .fh-swipe::-webkit-scrollbar { display:none; }
  .fh-snap { scroll-snap-align:start; }
`;

/* ─────────────────────────────────────
   TAB TYPE
───────────────────────────────────────*/
type Tab = "home" | "classes" | "gallery" | "about";

/* ═════════════════════════════════════
   SHELL
═════════════════════════════════════*/
export const MobileApp = () => {
  const [tab,  setTab]  = useState<Tab>("home");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("mobileTargetTab");
    if (t) {
      sessionStorage.removeItem("mobileTargetTab");
      const m: Record<string,Tab> = { home:"home", schedule:"classes", classes:"classes", about:"about", gallery:"gallery" };
      if (m[t]) setTab(m[t]);
    }
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="fixed inset-0 md:hidden flex flex-col fh"
        style={{ zIndex:60, background:T.bg, fontFamily:"'Inter',sans-serif", overflow:"hidden" }}>

        {/* ── Scrollable area ── */}
        <div className="flex-1 overflow-y-auto fh-scroll"
          style={{ WebkitOverflowScrolling:"touch", overflowX:"hidden",
            paddingBottom:"calc(90px + max(20px, env(safe-area-inset-bottom)))" } as any}>
          {tab==="home"    && <HomeScreen    setTab={setTab} setMenu={setMenu} />}
          {tab==="classes" && <ClassesScreen setMenu={setMenu} setTab={setTab} />}
          {tab==="gallery" && <GalleryScreen setMenu={setMenu} setTab={setTab} />}
          {tab==="about"   && <AboutScreen   setMenu={setMenu} setTab={setTab} />}
        </div>

        {/* ── Floating nav (fixed, outside flex flow) ── */}
        <BottomNav tab={tab} setTab={setTab} />

        {/* ── Menu drawer ── */}
        {menu && <MenuSheet onClose={()=>setMenu(false)} setTab={setTab} />}
      </div>
    </>
  );
};

/* ─────────────────────────────────────
   FLOATING SEGMENTED NAV
   Two pill clusters flank a glowing Yogi orb — all floating above bottom
───────────────────────────────────────*/
const BottomNav = ({ tab, setTab }: { tab:Tab; setTab:(t:Tab)=>void }) => (
  <div style={{
    position: "fixed",
    bottom: "max(18px, env(safe-area-inset-bottom))",
    left: 0, right: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 12, zIndex: 70,
    pointerEvents: "none",
  } as any}>

    {/* ── Left pill: Home + Classes ── */}
    <div style={{
      pointerEvents: "all",
      display: "flex", alignItems: "center",
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 99,
      boxShadow: "0 6px 24px rgba(27,67,50,0.14), 0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
      padding: "6px",
      gap: 2,
    } as any}>
      <SegTab id="home"    label="Home"    active={tab==="home"}    setTab={setTab} icon={<IcoHome    on={tab==="home"}    />} />
      <SegTab id="classes" label="Classes" active={tab==="classes"} setTab={setTab} icon={<IcoClasses on={tab==="classes"} />} />
    </div>

    {/* ── Centre Yogi orb ── */}
    <div style={{ pointerEvents: "all", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 } as any}>
      <button
        onClick={openYogi}
        className="yogi-ring fh-tap"
        style={{
          width: 58, height: 58, borderRadius: "50%",
          background: `linear-gradient(145deg, #2D6A4F, ${T.yogi})`,
          border: `3px solid rgba(255,255,255,0.95)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", outline: "none",
        } as any}
        aria-label="Chat with Yogi AI"
      >
        <YogiIcon large />
      </button>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
        color: T.yogi, textTransform: "uppercase",
        background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)",
        padding: "2px 8px", borderRadius: 99,
        boxShadow: "0 1px 4px rgba(27,67,50,0.12)",
      } as any}>Yogi AI</span>
    </div>

    {/* ── Right pill: Gallery + About ── */}
    <div style={{
      pointerEvents: "all",
      display: "flex", alignItems: "center",
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 99,
      boxShadow: "0 6px 24px rgba(27,67,50,0.14), 0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
      padding: "6px",
      gap: 2,
    } as any}>
      <SegTab id="gallery" label="Gallery" active={tab==="gallery"} setTab={setTab} icon={<IcoGallery on={tab==="gallery"} />} />
      <SegTab id="about"   label="About"   active={tab==="about"}   setTab={setTab} icon={<IcoAbout   on={tab==="about"}   />} />
    </div>

  </div>
);

/* Segment tab button inside pill cluster */
const SegTab = ({ id, label, active, setTab, icon }: {
  id: Tab; label: string; active: boolean;
  setTab: (t:Tab)=>void; icon: JSX.Element;
}) => (
  <button
    onClick={() => setTab(id)}
    style={{
      display: "flex", alignItems: "center",
      gap: active ? 6 : 0,
      padding: active ? "8px 14px" : "8px 12px",
      borderRadius: 99, border: "none",
      background: active ? T.green : "transparent",
      color: active ? "#fff" : T.muted,
      cursor: "pointer", outline: "none",
      transition: "all 0.28s cubic-bezier(0.34,1.30,0.64,1)",
      fontFamily: "'Inter', sans-serif",
      WebkitTapHighlightColor: "transparent",
      minWidth: 44,
      overflow: "hidden",
    } as any}
    aria-label={label}
  >
    {/* Icon — white when active, muted when not */}
    <span style={{ display:"flex", flexShrink:0, transition:"transform 0.22s ease",
      transform: active ? "scale(1.05)" : "scale(1)" }}>
      {icon}
    </span>
    {/* Label slides in when active */}
    <span style={{
      fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
      color: active ? "#fff" : "transparent",
      maxWidth: active ? 56 : 0,
      opacity: active ? 1 : 0,
      overflow: "hidden",
      transition: "max-width 0.28s ease, opacity 0.20s ease",
    }}>{label}</span>
  </button>
);

const NavTab = ({ item, active, onClick }: { item:any; active:boolean; onClick:()=>void }) => (
  <button onClick={onClick} style={{
    flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    gap:3, padding:"10px 0 8px", border:"none", background:"none", cursor:"pointer",
    color:active ? T.green : T.muted, fontFamily:"'Inter',sans-serif",
    transition:"color 0.18s",
  } as any}>
    {item.icon}
    <span style={{ fontSize:9.5, fontWeight:active?600:400 }}>{item.label}</span>
    {active && <span style={{ width:18, height:2.5, background:T.green, borderRadius:99, display:"block" }} />}
  </button>
);

/* ─────────────────────────────────────
   SHARED HEADER (non-home) — luxury centered style
───────────────────────────────────────*/
const Topbar = ({ title, setMenu, setTab }: { title:string; setMenu:(v:boolean)=>void; setTab?:(t:Tab)=>void }) => (
  <div style={{
    position:"sticky", top:0, zIndex:20,
    background:"rgba(255,255,255,0.97)",
    backdropFilter:"blur(20px)",
    WebkitBackdropFilter:"blur(20px)",
    borderBottom:`1px solid ${T.border}`,
    paddingTop:"max(10px,env(safe-area-inset-top))",
  } as any}>
    {/* Top strip: back · logo · menu */}
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px 10px" }}>
      <button
        onClick={()=>setTab?.("home")}
        style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${T.border}`,
          background:"transparent", display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", color:T.muted, flexShrink:0 } as any}
        aria-label="Home">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Centered brand + page */}
      <div style={{ textAlign:"center", flex:1 }}>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700,
          color:T.green, margin:0, letterSpacing:"0.01em" }}>{title}</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:2 }}>
          <div style={{ height:1, width:24, background:T.border }} />
          <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.18em",
            textTransform:"uppercase", color:T.muted }}>Feel &amp; Heal Yoga</span>
          <div style={{ height:1, width:24, background:T.border }} />
        </div>
      </div>

      <button onClick={()=>setMenu(true)}
        style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${T.border}`,
          background:"transparent", display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", color:T.ink, flexShrink:0 } as any}
        aria-label="Menu">
        <IcoMenu />
      </button>
    </div>
  </div>
);

/* ═════════════════════════════════════
   HOME SCREEN — ZERO SCROLL
   Hero (flex:1) + Yogi + Teacher strip + Book CTA
═════════════════════════════════════*/
const HomeScreen = ({ setTab, setMenu }: { setTab:(t:Tab)=>void; setMenu:(v:boolean)=>void }) => (
  <div style={{
    height:"calc(100dvh - max(80px, calc(60px + max(18px, env(safe-area-inset-bottom)))))",
    display:"flex", flexDirection:"column", overflow:"hidden",
  }}>

    {/* ════ HERO ════ */}
    <section style={{ flex:1, position:"relative", overflow:"hidden", minHeight:0 }}>
      <img src="/assets/hero-yoga.jpg" alt="Feel &amp; Heal Yoga"
        loading="eager"
        style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 30%", display:"block" }} />
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(to bottom, rgba(5,15,10,0.15) 0%, rgba(5,15,10,0.75) 100%)" }} />

      {/* Pill nav */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:2,
        display:"flex", justifyContent:"center",
        padding:"max(14px,env(safe-area-inset-top)) 16px 0",
        pointerEvents:"none" }}>
        <div style={{ pointerEvents:"all", display:"flex", alignItems:"center",
          justifyContent:"space-between", width:"100%",
          background:"rgba(255,255,255,0.10)", backdropFilter:"blur(16px)",
          WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.22)",
          borderRadius:99, padding:"8px 8px 8px 18px",
          boxShadow:"0 2px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
        } as any}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
              background:"radial-gradient(circle, #52D68A, #1B4332)",
              animation:"yogiRing 2.4s ease-in-out infinite" }} />
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:13, fontWeight:700,
              color:"rgba(255,255,255,0.95)", letterSpacing:"0.06em",
              textTransform:"uppercase" as const }}>Feel &amp; Heal Yoga</span>
          </div>
          <button onClick={()=>setMenu(true)}
            style={{ width:34, height:34, borderRadius:"50%",
              background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.28)",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", flexShrink:0 } as any} aria-label="Menu">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <line x1="2" y1="5" x2="16" y2="5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="2" y1="9" x2="12" y2="9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="2" y1="13" x2="16" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Hero content */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 20px 22px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {["\u2605 5.0","5+ Years"].map(t=>(
            <span key={t} style={{ background:"rgba(255,255,255,0.16)", backdropFilter:"blur(6px)",
              color:"rgba(255,255,255,0.90)", fontSize:10, fontWeight:600,
              padding:"3px 10px", borderRadius:99 }}>{t}</span>
          ))}
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(30px,8.5vw,40px)", fontWeight:700, color:"#fff",
          lineHeight:1.08, margin:"0 0 4px" }}>Move Better.<br/>Breathe Deeper.</h1>
        <p style={{ color:"rgba(255,255,255,0.60)", fontSize:11, margin:"0 0 16px" }}>
          Online &amp; Offline Yoga · Kharghar, Navi Mumbai
        </p>
        <button onClick={openTrial} className="fh-tap" style={{
            width:"100%", padding:"14px 0",
            borderRadius:99,
            background:"linear-gradient(135deg, hsl(38,92%,52%), hsl(30,86%,46%))",
            border:"none", cursor:"pointer",
            color:"hsl(220,18%,12%)",
            fontSize:14, fontWeight:700,
            fontFamily:"'Inter',sans-serif",
            letterSpacing:"0.02em",
            boxShadow:"0 6px 28px hsla(38,92%,52%,0.55), inset 0 1px 0 rgba(255,255,255,0.28)",
          } as any}>🌿 Book Free Trial</button>
      </div>
    </section>

    {/* ════ BOTTOM STRIP ════ */}
    <div style={{ background:T.white, flexShrink:0 }}>
      <button onClick={openYogi} className="fh-tap" style={{ display:"flex", alignItems:"center",
        gap:12, width:"100%", padding:"12px 16px",
        background:`linear-gradient(135deg, ${T.yogi}, #2D6A4F)`,
        border:"none", cursor:"pointer", textAlign:"left" as const } as any}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.18)",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <YogiIcon />
        </div>
        <div style={{ flex:1 }}>
          <p style={{ color:"#fff", fontWeight:700, fontSize:13, margin:0,
            fontFamily:"'Playfair Display',serif" }}>Chat with Yogi AI</p>
          <p style={{ color:"rgba(255,255,255,0.60)", fontSize:11, margin:0 }}>
            Programs · Schedule · Personalised plan →
          </p>
        </div>
        <span style={{ color:"rgba(255,255,255,0.50)", fontSize:20, flexShrink:0 }}>›</span>
      </button>
    </div>


  </div>
);


/* ═════════════════════════════════════
   CLASSES SCREEN
═════════════════════════════════════*/
const ClassesScreen = ({ setMenu, setTab }: { setMenu:(v:boolean)=>void; setTab:(t:Tab)=>void }) => {
  const [batch, setBatch] = useState(0);

  return (
    <div className="fh-in">
      <Topbar title="Classes" setMenu={setMenu} setTab={setTab} />

      <div style={{ padding:"20px 16px 40px" }}>

        {/* Batch selector */}
        <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 4px", fontWeight:600 }}>Choose Your Time</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.green, margin:"0 0 14px" }}>Class Schedule</h2>

        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {BATCHES.map((b,i)=>(
            <button key={i} onClick={()=>setBatch(i)} style={{
              flex:1, padding:"9px 0", borderRadius:8, border:"none",
              background: batch===i ? T.green : T.mint,
              color: batch===i ? "#fff" : T.sage,
              fontSize:11, fontWeight:700, cursor:"pointer",
              fontFamily:"'Inter',sans-serif", transition:"all 0.2s",
            } as any}>{b.short}</button>
          ))}
        </div>

        <div style={{ background:T.white, borderRadius:14, padding:"20px", borderLeft:`3px solid ${T.green}`,
          boxShadow:"0 2px 14px rgba(27,67,50,0.07)", marginBottom:20 }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:T.ink, margin:"0 0 4px" }}>
            {BATCHES[batch].time}
          </p>
          <p style={{ color:T.muted, fontSize:12, margin:"0 0 14px" }}>
            {BATCHES[batch].label} · {BATCHES[batch].days}
          </p>
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            {["🌐 Online","🏠 Offline"].map(l=>(
              <span key={l} style={{ background:T.mint, color:T.sage, padding:"5px 12px", borderRadius:6, fontSize:11, fontWeight:600 }}>{l}</span>
            ))}
          </div>
          <button onClick={openTrial} className="fh-tap" style={{
            width:"100%", padding:"12px 0", borderRadius:8, background:T.green, border:"none", cursor:"pointer",
            color:"#fff", fontSize:13, fontWeight:700, fontFamily:"'Inter',sans-serif",
          } as any}>Book Free Trial →</button>
        </div>

        {/* Yogi AI card */}
        <button onClick={openYogi} className="fh-tap" style={{
          width:"100%", display:"flex", alignItems:"center", gap:12,
          padding:"14px", borderRadius:12,
          background:`linear-gradient(135deg, ${T.yogi}, #2D6A4F)`,
          border:"none", cursor:"pointer", textAlign:"left", marginBottom:20,
        } as any}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.18)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <YogiIcon />
          </div>
          <div>
            <p style={{ color:"#fff", fontWeight:700, fontSize:13, margin:"0 0 2px" }}>Not sure which batch? Ask Yogi AI</p>
            <p style={{ color:"rgba(255,255,255,0.60)", fontSize:11, margin:0 }}>Get a personalised recommendation →</p>
          </div>
        </button>

        {/* Why section */}
        <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 12px", fontWeight:600 }}>Why Join?</p>
        {[
          { e:"🌿", h:"Small Batches",     d:"Real personal attention every session" },
          { e:"🌐", h:"Online & Offline",   d:"Attend from home or visit Kharghar"   },
          { e:"🤖", h:"Yogi AI Support",    d:"24/7 AI yoga assistant at your service", action:openYogi },
          { e:"⭐", h:"5.0 Google Rating",  d:"Trusted by 500+ students"              },
        ].map((r,i,arr)=>(
          <div key={i} onClick={r.action}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 0",
              borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",
              cursor:r.action?"pointer":"default" }}>
            <span style={{ fontSize:22, width:32, textAlign:"center", flexShrink:0 }}>{r.e}</span>
            <div>
              <p style={{ fontWeight:600, fontSize:13, color:T.ink, margin:"0 0 1px" }}>{r.h}</p>
              <p style={{ color:T.muted, fontSize:12, margin:0 }}>{r.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════
   GALLERY SCREEN
═════════════════════════════════════*/
const GalleryScreen = ({ setMenu, setTab }: { setMenu:(v:boolean)=>void; setTab:(t:Tab)=>void }) => {
  const [filter, setFilter] = useState<"all"|"solo"|"group">("all");
  const [lb,     setLb]     = useState<number|null>(null);

  const filtered = filter==="solo" ? soloImages : filter==="group" ? groupImages : allImages;
  const prev = () => setLb(i=>i!==null?(i-1+filtered.length)%filtered.length:null);
  const next = () => setLb(i=>i!==null?(i+1)%filtered.length:null);

  return (
    <div className="fh-in">
      <Topbar title="Gallery" setMenu={setMenu} setTab={setTab} />

      <div style={{ padding:"16px 16px 40px" }}>

        {/* Filter */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {(["all","solo","group"] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"7px 14px", borderRadius:8, border:"none",
              background:filter===f?T.green:T.mint,
              color:filter===f?"#fff":T.sage,
              fontSize:11, fontWeight:600, cursor:"pointer",
              fontFamily:"'Inter',sans-serif", transition:"all 0.18s",
            } as any}>
              {f==="all"?`All (${allImages.length})`:f==="solo"?`Individual`:f==="group"?`Group`:""}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {filtered.slice(0,9).map((img,i)=>(
            <div key={i} onClick={()=>setLb(i)}
              style={{ aspectRatio:"1", borderRadius:8, overflow:"hidden", cursor:"pointer", background:T.mint, position:"relative" }}>
              <img src={`/assets/images/${encodeURIComponent(img)}`} alt={`Photo ${i+1}`} loading="lazy"
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }} />
              {i===8 && filtered.length>9 && (
                <div style={{ position:"absolute", inset:0, background:"rgba(5,15,10,0.65)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:"#fff", fontWeight:800, fontSize:18 }}>+{filtered.length-8}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={()=>setLb(0)} className="fh-tap" style={{
          width:"100%", padding:"12px 0", borderRadius:8, marginBottom:24,
          background:T.green, border:"none", cursor:"pointer",
          color:"#fff", fontSize:13, fontWeight:700,
          fontFamily:"'Inter',sans-serif",
        } as any}>View All {filtered.length} Photos</button>

        {/* Videos */}
        <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 14px", fontWeight:600 }}>Yoga Videos</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {youtubeIds.map((id,i)=>(
            <div key={i} style={{ borderRadius:10, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
              <iframe
                src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                title={`Yoga video ${i+1}`}
                allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                allowFullScreen loading="lazy"
                style={{ width:"100%", aspectRatio:"16/9", border:"none", display:"block" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lb!==null && (
        <div onClick={()=>setLb(null)}
          style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.96)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <button onClick={()=>setLb(null)} style={{ position:"absolute", top:16, right:16,
            background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%",
            width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" } as any}>✕</button>
          <button onClick={e=>{e.stopPropagation();prev();}} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
            background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%",
            width:40, height:40, color:"#fff", fontSize:22, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" } as any}>‹</button>
          <img src={`/assets/images/${encodeURIComponent(filtered[lb])}`} alt={`Photo ${lb+1}`}
            onClick={e=>e.stopPropagation()}
            style={{ maxWidth:"92vw", maxHeight:"88vh", objectFit:"contain", borderRadius:6 }}
            onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }} />
          <button onClick={e=>{e.stopPropagation();next();}} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%",
            width:40, height:40, color:"#fff", fontSize:22, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" } as any}>›</button>
          <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)",
            background:"rgba(0,0,0,0.55)", color:"#fff", padding:"4px 14px", borderRadius:99, fontSize:11 }}>
            {lb+1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═════════════════════════════════════
   ABOUT SCREEN
═════════════════════════════════════*/
const AboutScreen = ({ setMenu, setTab }: { setMenu:(v:boolean)=>void; setTab:(t:Tab)=>void }) => (
  <div className="fh-in">
    <Topbar title="About" setMenu={setMenu} setTab={setTab} />

    <div style={{ padding:"24px 16px 48px" }}>

      {/* Profile */}
      <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:20 }}>
        <div style={{ width:88, height:88, borderRadius:"50%", border:`2px solid ${T.green}`,
          overflow:"hidden", flexShrink:0, boxShadow:"0 3px 16px rgba(27,67,50,0.18)" }}>
          <img src="/assets/instructor-priyanka.jpg" alt="Priyanka Sahu"
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 12%" }} />
        </div>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.green, margin:"0 0 3px" }}>
            Priyanka Sahu
          </h1>
          <p style={{ color:T.muted, fontSize:12, margin:"0 0 10px" }}>Yoga Teacher · Wellness Expert</p>
          <div className="fh-scroll" style={{ display:"flex", gap:6, overflowX:"auto" } as any}>
            {["Int'l Certified","Hatha","Vinyasa","Pranayama","Prenatal","5+ Yrs"].map((c,i)=>(
              <span key={i} style={{ flexShrink:0, background:T.mint, color:T.sage,
                padding:"4px 10px", borderRadius:4, fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontStyle:"italic",
        color:T.ink, lineHeight:1.6, marginBottom:20, borderLeft:`3px solid ${T.mint}`, paddingLeft:14 }}>
        "5+ years guiding students through Hatha, Vinyasa, Pranayama &amp; therapeutic yoga with patience and genuine care."
      </p>

      {/* Yogi AI card */}
      <button onClick={openYogi} className="fh-tap" style={{
        width:"100%", display:"flex", alignItems:"center", gap:12,
        padding:"14px", borderRadius:12,
        background:`linear-gradient(135deg, ${T.yogi}, #2D6A4F)`,
        border:"none", cursor:"pointer", textAlign:"left", marginBottom:20,
      } as any}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.18)",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <YogiIcon />
        </div>
        <div>
          <p style={{ color:"#fff", fontWeight:700, fontSize:13, margin:"0 0 2px" }}>Talk to Yogi AI</p>
          <p style={{ color:"rgba(255,255,255,0.60)", fontSize:11, margin:0 }}>Ask anything about yoga →</p>
        </div>
      </button>

      <div style={{ height:1, background:T.border, marginBottom:20 }} />

      {/* ── WHY JOIN US ── */}
      <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 4px", fontWeight:600 }}>Why Choose Us</p>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:T.green, margin:"0 0 14px" }}>Why Join Feel &amp; Heal</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
        {[
          { icon:"🌍", title:"Int'l Certified",   sub:"Yoga Teacher" },
          { icon:"🌿", title:"Naturopathy",        sub:"Natural & Yogic Therapy" },
          { icon:"👶", title:"Pre & Post Natal",   sub:"Certified Specialist" },
          { icon:"🧘", title:"Hatha & Vinyasa",    sub:"Traditional fusion" },
          { icon:"🫁", title:"Pranayama",           sub:"Breathwork & Alignment" },
          { icon:"💫", title:"Holistic Wellness",  sub:"Mind, body & breath" },
        ].map((c,i)=>(
          <div key={i} style={{ background:T.white, borderRadius:10, padding:"12px",
            border:`1px solid ${T.border}`, boxShadow:"0 1px 6px rgba(27,67,50,0.06)" }}>
            <span style={{ fontSize:22, display:"block", marginBottom:4 }}>{c.icon}</span>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:12, fontWeight:700, color:T.green, margin:"0 0 2px" }}>{c.title}</p>
            <p style={{ color:T.muted, fontSize:10, margin:0, lineHeight:1.4 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── STUDENT TESTIMONIALS ── */}
      <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 4px", fontWeight:600 }}>Testimonials</p>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:T.green, margin:"0 0 14px" }}>What Students Say</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {[
          { name:"Nidhi Shree",      text:"I absolutely love attending this yoga class every day! Incredibly knowledgeable instructors, calming atmosphere — the perfect place to find peace.", color:"#2d8a5f" },
          { name:"Vinu NS",          text:"Best Yoga Class — A True Mind-Body-Spirit Experience. Each session is truly transformative and leaves me feeling renewed.", color:"#d4810e" },
          { name:"Bharti Paunikar", text:"Your classes always nourish me in the most amazing ways. It's HEALING. I really loved the meditation — so helpful for my daily life.", color:"#b5395e" },
          { name:"Nilam Shinde",    text:"Priyanka gives individual attention. Teaches advanced asanas too. Bahut acchi teacher hai — very kind and patient.", color:"#6c4eb8" },
        ].map((r,i)=>(
          <div key={i} style={{ background:T.white, borderRadius:12, padding:"14px 16px",
            border:`1px solid ${T.border}`, borderLeft:`3px solid ${r.color}`,
            boxShadow:"0 1px 8px rgba(27,67,50,0.05)" }}>
            <div style={{ color:"#f59e0b", fontSize:13, marginBottom:6, letterSpacing:1 }}>★★★★★</div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:14, fontStyle:"italic",
              color:T.ink, lineHeight:1.5, margin:"0 0 8px" }}>"{r.text}"</p>
            <p style={{ color:T.muted, fontSize:11, margin:0, fontWeight:600 }}>— {r.name}</p>
          </div>
        ))}
      </div>
      <p style={{ textAlign:"center", fontSize:11, color:T.muted, marginBottom:20 }}>
        ⭐⭐⭐⭐⭐ 5.0 on Google &nbsp;·&nbsp;
        <a href="https://g.page/r/feelandhealyoga" target="_blank" rel="noopener noreferrer"
          style={{ color:T.sage, fontWeight:600 }}>See all reviews</a>
      </p>

      <div style={{ height:1, background:T.border, marginBottom:20 }} />

      {/* Contact */}
      <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 12px", fontWeight:600 }}>Get In Touch</p>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <a href={WA} target="_blank" rel="noopener noreferrer" className="fh-tap" style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"13px 0",
          borderRadius:8, background:"#25D366", color:"#fff",
          fontWeight:700, fontSize:13, textDecoration:"none", fontFamily:"'Inter',sans-serif",
        } as any}>💬 Chat on WhatsApp</a>

        <a href="tel:+919920155875" className="fh-tap" style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 0",
          borderRadius:8, background:T.mint, color:T.green,
          fontWeight:700, fontSize:13, textDecoration:"none", fontFamily:"'Inter',sans-serif",
        } as any}>📞 +91 99201 55875</a>

        <div style={{ display:"flex", gap:8 }}>
          <a href={IG} target="_blank" rel="noopener noreferrer" className="fh-tap" style={{
            flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"11px 0",
            borderRadius:8, background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",
            color:"#fff", fontWeight:600, fontSize:12, textDecoration:"none", fontFamily:"'Inter',sans-serif",
          } as any}>📸 Instagram</a>
          <a href={LI} target="_blank" rel="noopener noreferrer" className="fh-tap" style={{
            flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"11px 0",
            borderRadius:8, background:"#0077B5", color:"#fff",
            fontWeight:600, fontSize:12, textDecoration:"none", fontFamily:"'Inter',sans-serif",
          } as any}>💼 LinkedIn</a>
        </div>
      </div>

      <div style={{ marginTop:16, display:"flex", alignItems:"flex-start", gap:10, padding:"14px", borderRadius:10, background:T.white, border:`1px solid ${T.border}` }}>
        <span style={{ fontSize:18, flexShrink:0 }}>📍</span>
        <div>
          <p style={{ fontWeight:700, fontSize:12, color:T.ink, margin:"0 0 2px" }}>Studio</p>
          <p style={{ color:T.muted, fontSize:12, margin:0, lineHeight:1.55 }}>
            Adhiraj Garden, Sector 5,<br/>Kharghar, Navi Mumbai – 410210
          </p>
        </div>
      </div>

      <div style={{ marginTop:12 }}>
        <a href="/bring-yoga-to-your-society" style={{ display:"flex", alignItems:"center", gap:14,
          padding:"14px 16px", borderRadius:10, background:T.mint, textDecoration:"none" } as any}>
          <span style={{ fontSize:22, flexShrink:0 }}>🏘️</span>
          <div style={{ flex:1 }}>
            <span style={{ fontWeight:700, fontSize:13, color:T.green, display:"block" }}>Society Yoga &amp; Franchise</span>
            <span style={{ fontSize:11, color:T.muted }}>Bring yoga to your community · Partner with us</span>
          </div>
          <span style={{ color:T.muted, fontSize:18 }}>›</span>
        </a>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────
   MENU DRAWER
───────────────────────────────────────*/
const MenuSheet = ({ onClose, setTab }: { onClose:()=>void; setTab:(t:Tab)=>void }) => (
  <>
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(5,15,10,0.50)", zIndex:200, backdropFilter:"blur(3px)" }} />
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:201,
      background:T.white, borderRadius:"20px 20px 0 0",
      boxShadow:"0 -8px 40px rgba(0,0,0,0.12)",
      paddingBottom:"max(28px,env(safe-area-inset-bottom))",
    }}>
      <div style={{ width:36, height:4, background:T.border, borderRadius:99, margin:"14px auto 18px" }} />
      {[
        { l:"Home",              f:()=>{ onClose(); setTab("home");    } },
        { l:"Classes",           f:()=>{ onClose(); setTab("classes"); } },
        { l:"Gallery",           f:()=>{ onClose(); setTab("gallery"); } },
        { l:"About / Contact",   f:()=>{ onClose(); setTab("about");   } },
        { l:"Society & Franchise", f:()=>{ onClose(); window.location.href="/bring-yoga-to-your-society"; } },
      ].map((it,i,arr)=>(
        <button key={it.l} onClick={it.f} style={{
          display:"block", width:"100%", padding:"14px 22px",
          border:"none", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",
          background:"none", cursor:"pointer", textAlign:"left",
          color:T.ink, fontSize:15, fontWeight:500, fontFamily:"'Inter',sans-serif",
        } as any}>{it.l}</button>
      ))}
      <div style={{ display:"flex", gap:8, padding:"16px 22px 0" }}>
        <button onClick={()=>{ onClose(); openYogi(); }} className="fh-tap" style={{
          flex:1, padding:"12px 0", borderRadius:8,
          background:`linear-gradient(135deg, ${T.yogi}, #2D6A4F)`,
          border:"none", cursor:"pointer", color:"#fff",
          fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif",
        } as any}>Ask Yogi 🤖</button>
        <button onClick={()=>{ onClose(); openTrial(); }} className="fh-tap" style={{
          flex:1, padding:"12px 0", borderRadius:8,
          background:T.green, border:"none", cursor:"pointer",
          color:"#fff", fontSize:13, fontWeight:700, fontFamily:"'Inter',sans-serif",
        } as any}>Book Trial</button>
      </div>
    </div>
  </>
);

/* ─────────────────────────────────────
   SVG ICONS
───────────────────────────────────────*/
const s = (on:boolean) => ({ stroke: on ? T.green : T.muted, fill:"none", strokeWidth:1.8, strokeLinecap:"round" as const, strokeLinejoin:"round" as const });

const IcoHome    = ({ on }:{on:boolean}) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill={on?T.green:"none"} {...(on?{}:{stroke:T.muted,strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round"})}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IcoClasses = ({ on }:{on:boolean}) => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...s(on)}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    {on && <><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></>}
  </svg>
);
const IcoGallery = ({ on }:{on:boolean}) => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...s(on)}>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const IcoAbout   = ({ on }:{on:boolean}) => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...s(on)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4" fill={on?T.green:"none"}/>
  </svg>
);
const IcoMenu = ({ white=false }:{white?:boolean}) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={white?"#fff":T.ink} strokeWidth="1.8" strokeLinecap="round">
    <line x1="4" y1="7" x2="20" y2="7"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="17" x2="20" y2="17"/>
  </svg>
);
const YogiIcon = ({ large=false }:{large?:boolean}) => (
  <svg width={large?28:20} height={large?28:20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 20c0-3 2.7-5 6-5s6 2 6 5"/>
    <path d="M12 12v2"/>
    <circle cx="9" cy="15" r="1" fill="#fff"/>
    <circle cx="15" cy="15" r="1" fill="#fff"/>
  </svg>
);

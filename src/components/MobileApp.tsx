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
    0%   { box-shadow: 0 0 0 0px rgba(27,67,50,0.50); }
    70%  { box-shadow: 0 0 0 10px rgba(27,67,50,0); }
    100% { box-shadow: 0 0 0 0px rgba(27,67,50,0); }
  }
  .yogi-ring { animation: yogiRing 2.2s ease-in-out infinite; }

  /* Tap feedback */
  .fh-tap { transition: transform 0.12s ease, opacity 0.12s ease; }
  .fh-tap:active { transform: scale(0.96); opacity:0.85; }

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
          style={{ WebkitOverflowScrolling:"touch", overflowX:"hidden" } as any}>
          {tab==="home"    && <HomeScreen    setTab={setTab} setMenu={setMenu} />}
          {tab==="classes" && <ClassesScreen setMenu={setMenu} />}
          {tab==="gallery" && <GalleryScreen setMenu={setMenu} />}
          {tab==="about"   && <AboutScreen   setMenu={setMenu} />}
        </div>

        {/* ── Bottom nav ── */}
        <BottomNav tab={tab} setTab={setTab} />

        {/* ── Menu drawer ── */}
        {menu && <MenuSheet onClose={()=>setMenu(false)} setTab={setTab} />}
      </div>
    </>
  );
};

/* ─────────────────────────────────────
   BOTTOM NAV
   Home | Classes | [🧘 YOGI] | Gallery | About
───────────────────────────────────────*/
const BottomNav = ({ tab, setTab }: { tab:Tab; setTab:(t:Tab)=>void }) => {
  const navItems: {id:Tab; label:string; icon:JSX.Element}[] = [
    { id:"home",    label:"Home",    icon:<IcoHome    on={tab==="home"}    /> },
    { id:"classes", label:"Classes", icon:<IcoClasses on={tab==="classes"} /> },
    { id:"gallery", label:"Gallery", icon:<IcoGallery on={tab==="gallery"} /> },
    { id:"about",   label:"About",   icon:<IcoAbout   on={tab==="about"}   /> },
  ];

  return (
    <div style={{
      flexShrink:0,
      background:T.white,
      borderTop:`1px solid ${T.border}`,
      paddingBottom:"env(safe-area-inset-bottom)",
    }}>
      <div style={{ display:"flex", alignItems:"flex-end", minHeight:60 }}>

        {/* Left 2 tabs */}
        {navItems.slice(0,2).map(it=>(
          <NavTab key={it.id} item={it} active={tab===it.id} onClick={()=>setTab(it.id)} />
        ))}

        {/* ── YOGI AI — centre elevated ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", paddingBottom:8 }}>
          <button
            onClick={openYogi}
            className="yogi-ring fh-tap"
            style={{
              width:54, height:54, borderRadius:"50%",
              background:`linear-gradient(145deg, #2D6A4F, ${T.yogi})`,
              border:`2.5px solid ${T.white}`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              gap:1, cursor:"pointer", outline:"none",
              boxShadow:`0 4px 18px rgba(27,67,50,0.42)`,
              marginBottom:-6,
            } as any}
            aria-label="Chat with Yogi AI"
          >
            <YogiIcon />
          </button>
          <span style={{ fontSize:9, fontWeight:600, color:T.sage, marginTop:8, letterSpacing:"0.03em" }}>Yogi AI</span>
        </div>

        {/* Right 2 tabs */}
        {navItems.slice(2).map(it=>(
          <NavTab key={it.id} item={it} active={tab===it.id} onClick={()=>setTab(it.id)} />
        ))}

      </div>
    </div>
  );
};

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
   SHARED HEADER (non-home)
───────────────────────────────────────*/
const Topbar = ({ title, setMenu }: { title:string; setMenu:(v:boolean)=>void }) => (
  <div style={{
    position:"sticky", top:0, zIndex:20,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"max(14px,env(safe-area-inset-top)) 20px 14px",
    background:T.white, borderBottom:`1px solid ${T.border}`,
  }}>
    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
      <img src="/assets/feel-and-heal-yoga-logo.svg" alt="Feel & Heal Yoga"
        style={{ width:26, height:26, flexShrink:0 }} />
      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:T.green }}>
        {title}
      </span>
    </div>
    <button onClick={()=>setMenu(true)}
      style={{ background:"none", border:"none", cursor:"pointer", padding:6, color:T.ink }}
      aria-label="Menu">
      <IcoMenu />
    </button>
  </div>
);

/* ═════════════════════════════════════
   HOME SCREEN
   Hero → Quick Actions → Programs → Schedule → Reviews → CTA
═════════════════════════════════════*/
const HomeScreen = ({ setTab, setMenu }: { setTab:(t:Tab)=>void; setMenu:(v:boolean)=>void }) => {
  const [batch, setBatch]       = useState(0);
  const [rIdx,  setRIdx]        = useState(0);
  const touchX = useRef(0);

  return (
    <div className="fh-in">

      {/* ════ HERO ════ */}
      <section style={{ position:"relative", height:"65dvh", overflow:"hidden" }}>
        <img src="/assets/hero-yoga.jpg" alt="Feel & Heal Yoga classes"
          loading="eager"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 30%" }} />

        {/* Overlay gradient */}
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to bottom, rgba(5,15,10,0.22) 0%, rgba(5,15,10,0.80) 100%)" }} />

        {/* ── Hero header ── */}
        <div style={{
          position:"absolute", top:0, left:0, right:0,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"max(14px,env(safe-area-inset-top)) 18px 12px",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <img src="/assets/feel-and-heal-yoga-logo.svg" alt="logo"
              style={{ width:26, height:26, filter:"brightness(0) invert(1)" }} />
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:"#fff", fontWeight:700 }}>
              Feel &amp; Heal Yoga
            </span>
          </div>
          <button onClick={()=>setMenu(true)}
            style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)",
              border:"none", borderRadius:8, padding:8, cursor:"pointer" } as any}>
            <IcoMenu white />
          </button>
        </div>

        {/* ── Hero content ── */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 20px 24px" }}>

          {/* Trust chips */}
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            {["★ 5.0 Rating","5+ Years","500+ Students"].map(t=>(
              <span key={t} style={{
                background:"rgba(255,255,255,0.18)", backdropFilter:"blur(6px)",
                color:"rgba(255,255,255,0.90)", fontSize:10, fontWeight:600,
                padding:"4px 10px", borderRadius:99, letterSpacing:"0.02em",
              }}>{t}</span>
            ))}
          </div>

          <h1 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(34px,9vw,42px)", fontWeight:700, color:"#fff",
            lineHeight:1.08, margin:"0 0 6px",
          }}>
            Move Better.<br/>Breathe Deeper.
          </h1>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, margin:"0 0 18px" }}>
            Online &amp; Offline Yoga · Kharghar, Navi Mumbai
          </p>

          {/* CTAs */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={openTrial} className="fh-tap" style={{
              flex:2, padding:"13px 0", borderRadius:8,
              background:T.green, border:"none", cursor:"pointer",
              color:"#fff", fontSize:13, fontWeight:700,
              fontFamily:"'Inter',sans-serif",
              boxShadow:"0 4px 16px rgba(27,67,50,0.40)",
            } as any}>Book Free Trial</button>
            <button onClick={openYogi} className="fh-tap" style={{
              flex:1, padding:"13px 0", borderRadius:8,
              background:"rgba(255,255,255,0.16)", backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.30)",
              cursor:"pointer", color:"#fff", fontSize:12, fontWeight:600,
              fontFamily:"'Inter',sans-serif",
            } as any}>Ask Yogi 🤖</button>
          </div>
        </div>
      </section>

      {/* ════ YOGI AI BANNER ════ */}
      <section style={{ margin:"16px 16px 0" }}>
        <button onClick={openYogi} className="fh-tap" style={{
          width:"100%", display:"flex", alignItems:"center", gap:14,
          padding:"14px 16px", borderRadius:14,
          background:`linear-gradient(135deg, ${T.yogi}, #2D6A4F)`,
          border:"none", cursor:"pointer", textAlign:"left",
          boxShadow:"0 4px 20px rgba(27,67,50,0.28)",
        } as any}>
          <div style={{
            width:44, height:44, borderRadius:"50%",
            background:"rgba(255,255,255,0.18)", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <YogiIcon large />
          </div>
          <div>
            <p style={{ color:"#fff", fontWeight:700, fontSize:14, margin:"0 0 2px", fontFamily:"'Playfair Display',serif" }}>
              Chat with Yogi AI
            </p>
            <p style={{ color:"rgba(255,255,255,0.65)", fontSize:11, margin:0 }}>
              Ask about yoga, get a personalised plan →
            </p>
          </div>
          <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.60)", fontSize:18 }}>›</span>
        </button>
      </section>

      {/* ════ PROGRAMS — horizontal swipe ════ */}
      <section style={{ padding:"22px 0 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 18px 12px" }}>
          <div>
            <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 3px", fontWeight:600 }}>Find Your Practice</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:T.green, margin:0 }}>
              Our Programs
            </h2>
          </div>
          <button onClick={openTrial} style={{ fontSize:11, color:T.sage, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>
            Book Any →
          </button>
        </div>

        <div className="fh-swipe" style={{ padding:"0 18px 20px" }}>
          {PROGRAMS.map((p,i)=>(
            <div key={i} onClick={openTrial} className="fh-snap fh-tap"
              style={{ minWidth:140, height:185, borderRadius:12, overflow:"hidden", flexShrink:0, cursor:"pointer", position:"relative" }}>
              <img src={p.img} alt={p.name} loading="lazy"
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(5,15,10,0.82) 0%,transparent 55%)" }} />
              <p style={{ position:"absolute", bottom:10, left:10, right:6,
                color:"#fff", fontFamily:"'Playfair Display',serif",
                fontSize:14, fontWeight:700, margin:0, lineHeight:1.2 }}>
                {p.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ SCHEDULE SELECTOR ════ */}
      <section style={{ padding:"0 16px 20px" }}>
        <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 4px", fontWeight:600 }}>Choose Your Time</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:T.green, margin:"0 0 12px" }}>
          Class Schedule
        </h2>

        {/* Batch tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:12 }}>
          {BATCHES.map((b,i)=>(
            <button key={i} onClick={()=>setBatch(i)} style={{
              flex:1, padding:"8px 4px", borderRadius:8, border:"none",
              background: batch===i ? T.green : T.mint,
              color: batch===i ? "#fff" : T.sage,
              fontSize:11, fontWeight:600, cursor:"pointer",
              fontFamily:"'Inter',sans-serif", transition:"all 0.2s",
            } as any}>{b.short}</button>
          ))}
        </div>

        {/* Expanded batch */}
        <div style={{
          background:T.white, borderRadius:12, padding:"16px",
          borderLeft:`3px solid ${T.green}`,
          boxShadow:"0 2px 12px rgba(27,67,50,0.08)",
        }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:T.ink, margin:"0 0 3px" }}>
            {BATCHES[batch].time}
          </p>
          <p style={{ color:T.muted, fontSize:12, margin:"0 0 12px" }}>
            {BATCHES[batch].label} &nbsp;·&nbsp; {BATCHES[batch].days} &nbsp;·&nbsp; Online &amp; Offline
          </p>
          <button onClick={openTrial} className="fh-tap" style={{
            width:"100%", padding:"11px 0", borderRadius:8,
            background:T.green, border:"none", cursor:"pointer",
            color:"#fff", fontSize:13, fontWeight:700,
            fontFamily:"'Inter',sans-serif",
          } as any}>Book This Batch →</button>
        </div>
      </section>

      {/* ════ TEACHER CARD ════ */}
      <section style={{ margin:"0 16px 20px", borderRadius:14, overflow:"hidden", position:"relative", height:220 }}>
        <img src="/assets/instructor-priyanka.jpg" alt="Priyanka Sahu" loading="lazy"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 12%" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(5,15,10,0.88) 0%,rgba(5,15,10,0.05) 55%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 16px 16px" }}>
          <p style={{ color:"rgba(255,255,255,0.50)", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", margin:"0 0 4px" }}>Your Teacher</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#fff", margin:"0 0 3px" }}>Priyanka Sahu</p>
          <p style={{ color:"rgba(255,255,255,0.60)", fontSize:11, margin:"0 0 12px" }}>Internationally Certified · 5+ Years</p>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={openYogi} className="fh-tap" style={{
              padding:"8px 14px", borderRadius:8,
              background:"rgba(255,255,255,0.16)", backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.25)",
              color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer",
              fontFamily:"'Inter',sans-serif",
            } as any}>Ask Yogi 🤖</button>
            <button onClick={openTrial} className="fh-tap" style={{
              padding:"8px 14px", borderRadius:8,
              background:T.green, border:"none",
              color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer",
              fontFamily:"'Inter',sans-serif",
            } as any}>Book Trial</button>
          </div>
        </div>
      </section>

      {/* ════ REVIEWS ════ */}
      <section style={{ padding:"0 16px 20px" }}>
        <p style={{ fontSize:10, color:T.muted, letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 4px", fontWeight:600 }}>Reviews</p>
        <div style={{ overflow:"hidden" }}
          onTouchStart={e=>{ touchX.current=e.touches[0].clientX; }}
          onTouchEnd={e=>{
            const dx=touchX.current-e.changedTouches[0].clientX;
            if(Math.abs(dx)>44){ if(dx>0) setRIdx(i=>Math.min(i+1,REVIEWS.length-1)); else setRIdx(i=>Math.max(i-1,0)); }
          }}>
          <div style={{ display:"flex", transform:`translateX(${-rIdx*100}%)`, transition:"transform 0.32s ease" }}>
            {REVIEWS.map((r,i)=>(
              <div key={i} style={{ minWidth:"100%", paddingRight:2 }}>
                <div style={{ background:T.white, borderRadius:12, padding:"16px", border:`1px solid ${T.border}` }}>
                  <div style={{ color:T.gold, fontSize:14, marginBottom:10, letterSpacing:2 }}>★★★★★</div>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:500, fontStyle:"italic",
                    color:T.ink, lineHeight:1.45, margin:"0 0 10px" }}>"{r.text}"</p>
                  <p style={{ color:T.muted, fontSize:11, margin:0 }}>— {r.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:5, marginTop:10 }}>
          {REVIEWS.map((_,i)=>(
            <button key={i} onClick={()=>setRIdx(i)} style={{
              width:i===rIdx?18:5, height:5, borderRadius:99,
              background:i===rIdx?T.green:T.border,
              border:"none", padding:0, cursor:"pointer", transition:"all 0.25s",
            } as any} />
          ))}
        </div>
      </section>

      {/* ════ FINAL CTA ════ */}
      <section style={{ margin:"0 16px 40px", borderRadius:14, overflow:"hidden",
        background:T.green, padding:"28px 20px", textAlign:"center" }}>
        <p style={{ color:"rgba(255,255,255,0.48)", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", margin:"0 0 8px" }}>Limited Spots</p>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"#fff",
          margin:"0 0 7px", lineHeight:1.15, fontStyle:"italic" }}>
          Your first class<br/>is on us.
        </p>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:12, margin:"0 0 20px" }}>No commitment. No credit card.</p>
        <button onClick={openTrial} className="fh-tap" style={{
          width:"100%", padding:"13px 0", borderRadius:8,
          background:"#fff", border:"none", cursor:"pointer",
          color:T.green, fontSize:14, fontWeight:700,
          fontFamily:"'Inter',sans-serif",
        } as any}>Book Free Trial</button>

        {/* Yogi hint */}
        <button onClick={openYogi} className="fh-tap" style={{
          marginTop:10, background:"none", border:"none", cursor:"pointer",
          color:"rgba(255,255,255,0.55)", fontSize:11,
          fontFamily:"'Inter',sans-serif",
        } as any}>Or ask Yogi AI for a personalised plan 🤖</button>
      </section>

    </div>
  );
};

/* ═════════════════════════════════════
   CLASSES SCREEN
═════════════════════════════════════*/
const ClassesScreen = ({ setMenu }: { setMenu:(v:boolean)=>void }) => {
  const [batch, setBatch] = useState(0);

  return (
    <div className="fh-in">
      <Topbar title="Classes" setMenu={setMenu} />

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
const GalleryScreen = ({ setMenu }: { setMenu:(v:boolean)=>void }) => {
  const [filter, setFilter] = useState<"all"|"solo"|"group">("all");
  const [lb,     setLb]     = useState<number|null>(null);

  const filtered = filter==="solo" ? soloImages : filter==="group" ? groupImages : allImages;
  const prev = () => setLb(i=>i!==null?(i-1+filtered.length)%filtered.length:null);
  const next = () => setLb(i=>i!==null?(i+1)%filtered.length:null);

  return (
    <div className="fh-in">
      <Topbar title="Gallery" setMenu={setMenu} />

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
const AboutScreen = ({ setMenu }: { setMenu:(v:boolean)=>void }) => (
  <div className="fh-in">
    <Topbar title="About" setMenu={setMenu} />

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

      <div style={{ display:"flex", gap:10, marginTop:12 }}>
        <a href="/bring-yoga-to-your-society" style={{ flex:1, display:"flex", flexDirection:"column", gap:4,
          padding:"14px", borderRadius:10, background:T.mint, textDecoration:"none" } as any}>
          <span style={{ fontSize:20 }}>🏘️</span>
          <span style={{ fontWeight:700, fontSize:12, color:T.green }}>Society Yoga</span>
          <span style={{ fontSize:11, color:T.muted }}>Bring yoga to your community</span>
        </a>
        <a href="/franchise-with-us" style={{ flex:1, display:"flex", flexDirection:"column", gap:4,
          padding:"14px", borderRadius:10, background:T.mint, textDecoration:"none" } as any}>
          <span style={{ fontSize:20 }}>🤝</span>
          <span style={{ fontWeight:700, fontSize:12, color:T.green }}>Franchise</span>
          <span style={{ fontSize:11, color:T.muted }}>Partner with us</span>
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
        { l:"Society Yoga",      f:()=>{ onClose(); window.location.href="/bring-yoga-to-your-society"; } },
        { l:"Franchise",         f:()=>{ onClose(); window.location.href="/franchise-with-us"; } },
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

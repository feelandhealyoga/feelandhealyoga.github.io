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

/* ═══════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════ */
const DG    = "hsl(145,44%,20%)";
const SG    = "hsl(145,38%,40%)";
const LG    = "hsl(145,30%,93%)";
const CREAM = "hsl(42,28%,97%)";
const TD    = "hsl(220,18%,13%)";
const TM    = "hsl(220,10%,50%)";
const GOLD  = "hsl(38,80%,50%)";
const WHITE = "#ffffff";

/* ═══════════════════════════════════════
   DATA
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
  "29PJnLn8xxU","9f8V18vKlbY","NY0STA5U1RQ",
  "jgO2-SUE6Fw","rXBB5g1aixo","FoSUPzcJyB4",
];

const SCHEDULE = [
  { label:"6 AM",    time:"6:00 – 7:00 AM",  days:"Mon–Fri", accent:DG },
  { label:"8 AM",    time:"8:00 – 9:00 AM",  days:"Mon–Fri", accent:GOLD },
  { label:"7:30 PM", time:"7:30 – 8:30 PM",  days:"Mon–Fri", accent:"hsl(220,44%,38%)" },
];

const PROGRAMS = [
  { name:"Weight Loss",       desc:"Sustainable fat loss & body toning",       img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(3).jpeg" },
  { name:"Back Pain Relief",  desc:"Therapeutic poses for a strong spine",      img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(4).jpeg" },
  { name:"Women's Wellness",  desc:"Hormone balance, PCOD & inner strength",    img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(1).jpeg" },
  { name:"Meditation",        desc:"Breathwork, pranayama & mindfulness",       img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03.jpeg" },
  { name:"Prenatal Yoga",     desc:"Safe, gentle yoga for every stage",         img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(6).jpeg" },
  { name:"Personal Training", desc:"1-on-1 sessions tailored to your goals",   img:"/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20(5).jpeg" },
];

const REVIEWS = [
  { name:"Priya M.",  stars:5, text:"Best yoga studio in Navi Mumbai! The personal attention is truly incredible." },
  { name:"Rahul S.",  stars:5, text:"Lost 8kg in 3 months. The teacher genuinely cares about every student." },
  { name:"Sneha K.",  stars:5, text:"The Women's batch is so warm and welcoming. I love every single session!" },
];

const CREDENTIALS = [
  "Internationally Certified","Hatha & Vinyasa","Pranayama Expert",
  "Pre & Post Natal","Diploma in Naturopathy","Holistic Wellness",
];

/* ═══════════════════════════════════════
   EXPANDING PILL NAV BUTTON
   ═══════════════════════════════════════ */
const NavBtn = ({ active, onClick, emoji, label }: {
  active:boolean; onClick:()=>void; emoji:string; label:string;
}) => (
  <button
    onClick={onClick}
    style={{
      flex: active ? "0 0 auto" : "1 1 0",
      display:"flex", alignItems:"center", justifyContent:"center",
      gap: active ? 6 : 0,
      height: 44, minWidth: 40,
      padding: active ? "0 14px" : "0",
      borderRadius: 99, border:"none",
      background: active ? DG : "transparent",
      cursor:"pointer", overflow:"hidden",
      transition:"all 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
      WebkitTapHighlightColor:"transparent",
      fontFamily:"'Inter',sans-serif",
    } as any}
  >
    <span style={{ fontSize:17, lineHeight:1, flexShrink:0 }}>{emoji}</span>
    <span style={{
      color:WHITE, fontSize:11, fontWeight:700,
      whiteSpace:"nowrap" as const,
      maxWidth: active ? 80 : 0,
      opacity: active ? 1 : 0,
      overflow:"hidden",
      transition:"max-width 0.32s ease, opacity 0.2s ease",
    }}>{label}</span>
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
      const map: Record<string,Tab> = {
        home:"home", schedule:"classes", classes:"classes",
        about:"about", gallery:"gallery",
      };
      if (map[target]) setTab(map[target]);
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .m-in { animation: fadeUp 0.38s ease forwards; }
        .hide-scroll::-webkit-scrollbar { display:none; }
        .hide-scroll { scrollbar-width:none; }
        .tap:active { transform:scale(0.96); }
        .prog-card:active { transform:scale(0.97); }
      `}</style>

      {/* ─── Full-screen shell, NO overflow anywhere ─── */}
      <div
        className="fixed inset-0 md:hidden"
        style={{
          zIndex:60,
          fontFamily:"'Inter',sans-serif",
          overflow:"hidden",
          display:"flex", flexDirection:"column",
        }}
      >
        {/* ─── Content area: exact fit, zero scroll ─── */}
        <div style={{
          flex:1,
          overflow:"hidden",
          /* reserve space for floating nav: 60px pill + 16px gap + safe-area */
          paddingBottom:"calc(76px + env(safe-area-inset-bottom))",
        }}>
          {tab==="home"    && <HomeTab    key="home"    setTab={setTab} setMenu={setMenu} />}
          {tab==="classes" && <ClassesTab key="classes" setMenu={setMenu} />}
          {tab==="gallery" && <GalleryTab key="gallery" setMenu={setMenu} />}
          {tab==="about"   && <AboutTab   key="about"   setMenu={setMenu} />}
        </div>

        {/* ─── UNIQUE FLOATING PILL NAV ─── */}
        <div style={{
          position:"fixed",
          bottom:"max(16px, env(safe-area-inset-bottom))",
          left:14, right:14, height:60,
          borderRadius:99,
          background:"rgba(255,255,255,0.90)",
          backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)",
          boxShadow:"0 8px 32px rgba(40,100,60,0.22), 0 2px 10px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.8)",
          display:"flex", alignItems:"center",
          padding:"0 10px",
          zIndex:70,
          position:"fixed" as any,  // ts dup allowed
        } as any}>

          <NavBtn active={tab==="home"}    onClick={()=>setTab("home")}    emoji="🏠" label="Home"    />
          <NavBtn active={tab==="classes"} onClick={()=>setTab("classes")} emoji="📅" label="Classes" />

          {/* Centre space for elevated FAB */}
          <div style={{ width:64, flexShrink:0, position:"relative" }}>
            <button
              onClick={openTrial}
              className="tap"
              style={{
                position:"absolute", top:-22, left:"50%", transform:"translateX(-50%)",
                width:52, height:52, borderRadius:"50%",
                background:`linear-gradient(145deg, hsl(145,42%,38%), hsl(145,44%,20%))`,
                boxShadow:"0 6px 22px rgba(40,100,60,0.52), 0 0 0 3px rgba(255,255,255,0.9)",
                border:"none", color:WHITE, fontSize:20,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", outline:"none",
                transition:"transform 0.15s",
                WebkitTapHighlightColor:"transparent",
              } as any}
              aria-label="Book Free Trial"
            >🌿</button>
          </div>

          <NavBtn active={tab==="gallery"} onClick={()=>setTab("gallery")} emoji="📸" label="Gallery" />
          <NavBtn active={tab==="about"}   onClick={()=>setTab("about")}   emoji="🌿" label="About"   />
        </div>

        {/* ─── Menu overlay ─── */}
        {menu && (
          <>
            <div
              onClick={()=>setMenu(false)}
              style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.52)", zIndex:200, backdropFilter:"blur(4px)" }}
            />
            <div style={{
              position:"fixed", bottom:0, left:0, right:0, zIndex:201,
              background:WHITE, borderRadius:"22px 22px 0 0",
              boxShadow:"0 -8px 40px rgba(0,0,0,0.18)",
              paddingBottom:"max(32px,env(safe-area-inset-bottom))",
              animation:"fadeUp 0.22s ease",
            }}>
              <div style={{ width:36, height:4, background:"hsl(40,18%,86%)", borderRadius:99, margin:"14px auto 22px" }} />
              {[
                { label:"Home",               emoji:"🏠", fn:()=>{ setMenu(false); setTab("home");    } },
                { label:"Classes & Schedule", emoji:"📅", fn:()=>{ setMenu(false); setTab("classes"); } },
                { label:"Meet Our Teacher",   emoji:"🧘", fn:()=>{ setMenu(false); setTab("about");   } },
                { label:"Gallery",            emoji:"📸", fn:()=>{ setMenu(false); setTab("gallery"); } },
                { label:"Society & Franchise",emoji:"🏘️",fn:()=>{ setMenu(false); window.location.href="/bring-yoga-to-your-society"; } },
                { label:"Let's Connect",      emoji:"📞", fn:()=>{ setMenu(false); window.open(WA_GENERAL,"_blank"); } },
              ].map(item=>(
                <button key={item.label} onClick={item.fn} style={{
                  display:"flex", alignItems:"center", gap:16,
                  width:"100%", padding:"14px 24px",
                  border:"none", borderBottom:"1px solid hsl(40,18%,95%)",
                  background:"none", cursor:"pointer", textAlign:"left" as const,
                  color:TD, fontSize:15, fontWeight:600, fontFamily:"'Inter',sans-serif",
                  WebkitTapHighlightColor:"transparent",
                } as any}>
                  <span style={{ fontSize:20, width:28, textAlign:"center" as const }}>{item.emoji}</span>
                  {item.label}
                </button>
              ))}
              <div style={{ padding:"20px 24px 0" }}>
                <button onClick={()=>{ setMenu(false); openTrial(); }} style={{
                  width:"100%", padding:"14px 0", borderRadius:99,
                  background:`linear-gradient(135deg,hsl(145,42%,36%),hsl(145,44%,20%))`,
                  color:WHITE, fontWeight:700, fontSize:14,
                  border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif",
                } as any}>🌿 Book Free Trial</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════
   HAMBURGER BUTTON (shared)
   ═══════════════════════════════════════ */
const HamburgerBtn = ({ onOpen, white=false }: { onOpen:()=>void; white?:boolean }) => (
  <button onClick={onOpen} style={{
    display:"flex", flexDirection:"column" as const, gap:5,
    padding:10, border:"none",
    background: white ? "rgba(255,255,255,0.14)" : LG,
    backdropFilter: white ? "blur(8px)" : "none",
    borderRadius:12, cursor:"pointer",
    WebkitTapHighlightColor:"transparent",
    flexShrink:0,
  } as any}>
    {[0,1,2].map(i=>(
      <span key={i} style={{ display:"block", width:18, height:2, background:white?WHITE:DG, borderRadius:99 }} />
    ))}
  </button>
);

/* ═══════════════════════════════════════
   HOME TAB — zero scroll, full screen
   ═══════════════════════════════════════ */
const HomeTab = ({ setTab, setMenu }: { setTab:(t:Tab)=>void; setMenu:(v:boolean)=>void }) => {
  const [batch, setBatch]       = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const touchX = useRef(0);

  return (
    <div className="m-in" style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>

      {/* ── Full-bleed background ── */}
      <img
        src="/assets/hero-yoga.jpg"
        alt="Feel & Heal Yoga"
        loading="eager"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 30%" }}
      />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(4,14,8,0.28) 0%, rgba(4,14,8,0.84) 100%)" }} />

      {/* ── Top bar ── */}
      <div style={{
        position:"relative", zIndex:2, flexShrink:0,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"max(16px,env(safe-area-inset-top)) 20px 12px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <img src="/assets/feel-and-heal-yoga-logo.svg" alt="Feel & Heal Yoga"
            style={{ width:26, height:26, filter:"brightness(0) invert(1)" }} />
          <span style={{ color:WHITE, fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:13 }}>
            Feel &amp; Heal Yoga
          </span>
        </div>
        <HamburgerBtn onOpen={()=>setMenu(true)} white />
      </div>

      {/* ── Hero headline (grows) ── */}
      <div style={{
        position:"relative", zIndex:2, flex:1, minHeight:0,
        display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"0 24px",
      }}>
        <p style={{ color:"rgba(255,255,255,0.50)", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase" as const, margin:"0 0 10px" }}>
          Yoga · Wellness · Healing
        </p>
        <h1 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(34px, 10vw, 44px)",
          fontWeight:800, color:WHITE, lineHeight:1.08, margin:"0 0 12px",
        }}>
          Move Better.<br/>Breathe Deeper.<br/>Feel Better.
        </h1>
        <p style={{ color:"rgba(255,255,255,0.60)", fontSize:12, margin:"0 0 6px" }}>
          Online &amp; Offline Yoga · Kharghar, Navi Mumbai
        </p>
        <p style={{ color:"rgba(255,255,255,0.40)", fontSize:11, margin:0 }}>
          ★★★★★ 5.0 &nbsp;·&nbsp; 5+ Years &nbsp;·&nbsp; 500+ Students
        </p>
      </div>

      {/* ── Swipeable testimonial (compact) ── */}
      <div style={{
        position:"relative", zIndex:2, flexShrink:0,
        padding:"0 24px 10px",
        overflow:"hidden",
      }}
        onTouchStart={e=>{ touchX.current = e.touches[0].clientX; }}
        onTouchEnd={e=>{
          const dx = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(dx)>44) {
            if (dx>0) setReviewIdx(i=>Math.min(i+1,REVIEWS.length-1));
            else      setReviewIdx(i=>Math.max(i-1,0));
          }
        }}
      >
        <div style={{ display:"flex", transition:"transform 0.34s ease", transform:`translateX(${-reviewIdx*100}%)` }}>
          {REVIEWS.map((r,i)=>(
            <div key={i} style={{ minWidth:"100%", paddingRight:2 }}>
              <p style={{ color:GOLD, fontSize:13, margin:"0 0 2px" }}>{"★".repeat(r.stars)}</p>
              <p style={{ color:"rgba(255,255,255,0.70)", fontSize:11, margin:0, fontStyle:"italic" }}>
                "{r.text.slice(0,60)}…" — <span style={{ fontStyle:"normal", fontWeight:700 }}>{r.name}</span>
              </p>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:4, marginTop:6 }}>
          {REVIEWS.map((_,i)=>(
            <button key={i} onClick={()=>setReviewIdx(i)} style={{
              width:i===reviewIdx?18:5, height:5, borderRadius:99,
              background:i===reviewIdx?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)",
              border:"none", padding:0, cursor:"pointer",
              transition:"all 0.3s",
              WebkitTapHighlightColor:"transparent",
            } as any} />
          ))}
        </div>
      </div>

      {/* ── Program cards (horizontal, fixed height) ── */}
      <div style={{ position:"relative", zIndex:2, flexShrink:0, height:155 }}>
        <div
          className="hide-scroll"
          style={{
            display:"flex", gap:10, height:"100%",
            overflowX:"scroll" as const, padding:"8px 20px 12px",
            scrollSnapType:"x mandatory" as const,
            WebkitOverflowScrolling:"touch",
            boxSizing:"border-box" as const,
          } as any}
        >
          {PROGRAMS.map((prog,i)=>(
            <div
              key={i}
              onClick={openTrial}
              className="prog-card"
              style={{
                minWidth:"58vw", scrollSnapAlign:"start",
                borderRadius:16, overflow:"hidden", flexShrink:0,
                cursor:"pointer", transition:"transform 0.15s",
                position:"relative",
              }}
            >
              <img
                src={prog.img} alt={prog.name} loading="lazy"
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }}
              />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(5,14,8,0.80) 0%, transparent 55%)" }} />
              <div style={{ position:"absolute", bottom:10, left:12, right:8 }}>
                <p style={{ color:WHITE, fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:13, margin:"0 0 2px", lineHeight:1.2 }}>{prog.name}</p>
                <p style={{ color:"rgba(255,255,255,0.65)", fontSize:10, margin:0 }}>{prog.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTAs ── */}
      <div style={{
        position:"relative", zIndex:2, flexShrink:0,
        padding:"0 20px 16px",
        display:"flex", flexDirection:"column" as const, gap:8,
      }}>
        <button onClick={openTrial} className="tap" style={{
          width:"100%", padding:"13px 0", borderRadius:99,
          background:`linear-gradient(135deg,hsl(145,42%,38%),hsl(145,44%,20%))`,
          color:WHITE, fontWeight:700, fontSize:14, border:"none", cursor:"pointer",
          fontFamily:"'Inter',sans-serif", boxShadow:"0 4px 20px rgba(40,100,60,0.38)",
          WebkitTapHighlightColor:"transparent", transition:"transform 0.15s",
        } as any}>🌿 Book Free Trial</button>
        <button onClick={()=>setTab("classes")} className="tap" style={{
          width:"100%", padding:"11px 0", borderRadius:99,
          background:"rgba(255,255,255,0.13)",
          border:"1.5px solid rgba(255,255,255,0.30)",
          color:WHITE, fontWeight:600, fontSize:13, cursor:"pointer",
          fontFamily:"'Inter',sans-serif",
          backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
          WebkitTapHighlightColor:"transparent", transition:"transform 0.15s",
        } as any}>View Class Schedule →</button>
      </div>

    </div>
  );
};

/* ═══════════════════════════════════════
   CLASSES TAB — zero scroll, single screen
   ═══════════════════════════════════════ */
const ClassesTab = ({ setMenu }: { setMenu:(v:boolean)=>void }) => {
  const [batch, setBatch] = useState(0);

  return (
    <div className="m-in" style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", background:CREAM }}>

      {/* Header */}
      <div style={{
        flexShrink:0, padding:"max(14px,env(safe-area-inset-top)) 20px 16px",
        background:WHITE,
        display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        borderBottom:"1px solid hsl(40,18%,93%)",
      }}>
        <div>
          <span style={{ display:"block", fontSize:10, fontWeight:700, color:SG, letterSpacing:"0.20em", textTransform:"uppercase" as const, marginBottom:4 }}>Mon – Fri · Kharghar</span>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:800, color:DG, margin:0 }}>Class Schedule</h1>
        </div>
        <HamburgerBtn onOpen={()=>setMenu(true)} />
      </div>

      {/* Content fills remaining space */}
      <div style={{ flex:1, minHeight:0, padding:"16px 20px 0", display:"flex", flexDirection:"column" as const, gap:12 }}>

        {/* Batch selector pills */}
        <div style={{ flexShrink:0, display:"flex", gap:8 }}>
          {SCHEDULE.map((s,i)=>(
            <button key={i} onClick={()=>setBatch(i)} style={{
              flex:1, padding:"9px 0", borderRadius:99, border:"none",
              background: batch===i ? DG : WHITE,
              color: batch===i ? WHITE : TM,
              fontWeight:700, fontSize:12, cursor:"pointer",
              fontFamily:"'Inter',sans-serif",
              boxShadow: batch===i ? "0 4px 14px rgba(40,100,60,0.30)" : "0 1px 4px rgba(0,0,0,0.06)",
              transition:"all 0.22s",
              WebkitTapHighlightColor:"transparent",
            } as any}>{s.label}</button>
          ))}
        </div>

        {/* Active batch card (expands) */}
        <div style={{
          flexShrink:0,
          background:WHITE, borderRadius:18, padding:"20px",
          borderLeft:`4px solid ${SCHEDULE[batch].accent}`,
          boxShadow:"0 3px 16px rgba(0,0,0,0.06)",
          transition:"border-color 0.2s",
        }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:800, color:TD, margin:"0 0 4px" }}>
            {SCHEDULE[batch].time}
          </h2>
          <p style={{ color:TM, fontSize:12, margin:"0 0 14px" }}>Adults Batch &nbsp;·&nbsp; {SCHEDULE[batch].days}</p>
          <div style={{ display:"flex", gap:8 }}>
            <span style={{ background:LG, color:DG, padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:700 }}>🌐 Online</span>
            <span style={{ background:LG, color:DG, padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:700 }}>🏠 Offline</span>
          </div>
        </div>

        {/* Why join — 3 horizontal mini-cards */}
        <div style={{ flexShrink:0 }}>
          <span style={{ display:"block", fontSize:10, fontWeight:700, color:SG, letterSpacing:"0.18em", textTransform:"uppercase" as const, marginBottom:10 }}>Why Feel &amp; Heal?</span>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { emoji:"🌿", title:"Small Batches",   desc:"Personal attention" },
              { emoji:"🌐", title:"Online + Offline", desc:"Flexible access"    },
              { emoji:"👁️", title:"1-on-1 Guidance",  desc:"Your pace, your way" },
            ].map(r=>(
              <div key={r.title} style={{
                flex:1, background:WHITE, borderRadius:14,
                padding:"12px 10px", textAlign:"center" as const,
                boxShadow:"0 2px 10px rgba(0,0,0,0.055)",
              }}>
                <span style={{ fontSize:20 }}>{r.emoji}</span>
                <p style={{ fontWeight:700, fontSize:11, color:TD, margin:"6px 0 2px", lineHeight:1.2 }}>{r.title}</p>
                <p style={{ color:TM, fontSize:10, margin:0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex:1, minHeight:0 }} />

        {/* CTA */}
        <div style={{ flexShrink:0, paddingBottom:8 }}>
          <button onClick={openTrial} className="tap" style={{
            width:"100%", padding:"14px 0", borderRadius:99,
            background:`linear-gradient(135deg,hsl(145,42%,38%),hsl(145,44%,20%))`,
            color:WHITE, fontWeight:700, fontSize:14, border:"none", cursor:"pointer",
            fontFamily:"'Inter',sans-serif", boxShadow:"0 4px 18px rgba(40,100,60,0.28)",
            transition:"transform 0.15s", WebkitTapHighlightColor:"transparent",
          } as any}>🌿 Book Free Trial</button>
        </div>

      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   GALLERY TAB — zero scroll, grid + lightbox
   ═══════════════════════════════════════ */
const GalleryTab = ({ setMenu }: { setMenu:(v:boolean)=>void }) => {
  const [filter, setFilter]   = useState<"all"|"solo"|"group">("all");
  const [lightbox, setLightbox] = useState<number|null>(null);
  const [vidSheet, setVidSheet] = useState(false);

  const filtered =
    filter==="solo"  ? soloImages
    : filter==="group" ? groupImages
    : allGalleryImages;

  const grid6 = filtered.slice(0, 6);

  const closeLb = () => setLightbox(null);
  const prev    = () => setLightbox(i => i!==null ? (i-1+filtered.length)%filtered.length : null);
  const next    = () => setLightbox(i => i!==null ? (i+1)%filtered.length : null);

  return (
    <div className="m-in" style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", background:CREAM }}>

      {/* Header */}
      <div style={{
        flexShrink:0, padding:"max(14px,env(safe-area-inset-top)) 20px 14px",
        background:WHITE, borderBottom:"1px solid hsl(40,18%,93%)",
        display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      }}>
        <div>
          <span style={{ display:"block", fontSize:10, fontWeight:700, color:SG, letterSpacing:"0.20em", textTransform:"uppercase" as const, marginBottom:4 }}>Our Studio &amp; Classes</span>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:800, color:DG, margin:0 }}>Gallery</h1>
        </div>
        <HamburgerBtn onOpen={()=>setMenu(true)} />
      </div>

      {/* Filter pills */}
      <div style={{ flexShrink:0, padding:"12px 20px 10px", background:WHITE, display:"flex", gap:8 }}>
        {(["all","solo","group"] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"7px 14px", borderRadius:99, border:"none",
            background: filter===f ? DG : "hsl(145,20%,94%)",
            color: filter===f ? WHITE : TM,
            fontWeight:600, fontSize:11, cursor:"pointer",
            fontFamily:"'Inter',sans-serif", transition:"all 0.2s",
            WebkitTapHighlightColor:"transparent",
          } as any}>
            {f==="all"?"All":""}
            {f==="solo"?"🧘 Individual":""}
            {f==="group"?"👥 Group":""}
            {" "}({f==="all"?allGalleryImages.length:f==="solo"?soloImages.length:groupImages.length})
          </button>
        ))}
      </div>

      {/* Photo grid — fills remaining space */}
      <div style={{ flex:1, minHeight:0, padding:"10px 16px 0" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(3,1fr)",
          gridTemplateRows:"repeat(2,1fr)",
          gap:8, height:"100%",
        }}>
          {grid6.map((img,i)=>(
            <div
              key={i}
              onClick={()=>setLightbox(i)}
              style={{ borderRadius:12, overflow:"hidden", cursor:"pointer", background:LG, position:"relative" }}
            >
              <img
                src={`/assets/images/${encodeURIComponent(img)}`}
                alt={`Photo ${i+1}`} loading="lazy"
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }}
              />
              {/* "more" overlay on last visible if there are more */}
              {i===5 && filtered.length>6 && (
                <div style={{
                  position:"absolute", inset:0,
                  background:"rgba(5,14,8,0.68)",
                  display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
                }}>
                  <span style={{ color:WHITE, fontWeight:800, fontSize:20 }}>+{filtered.length-5}</span>
                  <span style={{ color:"rgba(255,255,255,0.75)", fontSize:10, marginTop:2 }}>more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action row */}
      <div style={{ flexShrink:0, padding:"10px 16px 8px", display:"flex", gap:8 }}>
        <button onClick={()=>setLightbox(0)} className="tap" style={{
          flex:1, padding:"11px 0", borderRadius:99,
          background:DG, color:WHITE, fontWeight:700, fontSize:12, border:"none",
          cursor:"pointer", fontFamily:"'Inter',sans-serif",
          WebkitTapHighlightColor:"transparent", transition:"transform 0.15s",
        } as any}>View All {filtered.length} Photos →</button>
        <button onClick={()=>setVidSheet(true)} className="tap" style={{
          flex:1, padding:"11px 0", borderRadius:99,
          background:WHITE, color:DG, fontWeight:700, fontSize:12,
          border:`1.5px solid ${LG}`, cursor:"pointer", fontFamily:"'Inter',sans-serif",
          WebkitTapHighlightColor:"transparent", transition:"transform 0.15s",
        } as any}>🎬 Yoga Videos</button>
      </div>

      {/* ── Lightbox ── */}
      {lightbox!==null && (
        <div
          onClick={closeLb}
          style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.94)", display:"flex", alignItems:"center", justifyContent:"center" }}
        >
          <button onClick={closeLb} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.14)", border:"none", borderRadius:"50%", width:42, height:42, color:WHITE, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" } as any}>✕</button>
          <button onClick={e=>{e.stopPropagation();prev();}} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.14)", border:"none", borderRadius:"50%", width:42, height:42, color:WHITE, fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" } as any}>‹</button>
          <img
            src={`/assets/images/${encodeURIComponent(filtered[lightbox])}`}
            alt={`Photo ${lightbox+1}`}
            onClick={e=>e.stopPropagation()}
            style={{ maxWidth:"92vw", maxHeight:"88vh", objectFit:"contain", borderRadius:8 }}
            onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }}
          />
          <button onClick={e=>{e.stopPropagation();next();}} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.14)", border:"none", borderRadius:"50%", width:42, height:42, color:WHITE, fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" } as any}>›</button>
          <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.55)", color:WHITE, padding:"5px 16px", borderRadius:99, fontSize:12, fontFamily:"'Inter',sans-serif" }}>
            {lightbox+1} / {filtered.length}
          </div>
        </div>
      )}

      {/* ── Video sheet ── */}
      {vidSheet && (
        <>
          <div onClick={()=>setVidSheet(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.52)", zIndex:9000, backdropFilter:"blur(4px)" }} />
          <div style={{
            position:"fixed", bottom:0, left:0, right:0, zIndex:9001,
            background:WHITE, borderRadius:"22px 22px 0 0",
            boxShadow:"0 -8px 40px rgba(0,0,0,0.18)",
            maxHeight:"75vh", overflowY:"auto",
            paddingBottom:"max(24px,env(safe-area-inset-bottom))",
          }}>
            <div style={{ width:36, height:4, background:"hsl(40,18%,86%)", borderRadius:99, margin:"14px auto 4px" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 20px 14px" }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:800, color:DG, margin:0 }}>Yoga Videos</h2>
              <button onClick={()=>setVidSheet(false)} style={{ background:LG, border:"none", borderRadius:"50%", width:32, height:32, color:DG, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" } as any}>✕</button>
            </div>
            <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:10 }}>
              {youtubeIds.map((id,i)=>(
                <div key={i} style={{ borderRadius:14, overflow:"hidden", background:"#000" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${id}?autoplay=0&mute=1&rel=0&modestbranding=1`}
                    title={`Yoga video ${i+1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen loading="lazy"
                    style={{ width:"100%", aspectRatio:"16/9", border:"none", display:"block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   ABOUT TAB — zero scroll, single screen
   ═══════════════════════════════════════ */
const AboutTab = ({ setMenu }: { setMenu:(v:boolean)=>void }) => (
  <div className="m-in" style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", background:CREAM }}>

    {/* Profile header */}
    <div style={{
      flexShrink:0,
      background:WHITE,
      padding:"max(14px,env(safe-area-inset-top)) 20px 16px",
      borderBottom:"1px solid hsl(40,18%,93%)",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {/* Circular photo */}
          <div style={{
            width:72, height:72, borderRadius:"50%",
            border:`2.5px solid ${SG}`,
            overflow:"hidden", flexShrink:0,
            boxShadow:`0 3px 16px rgba(40,100,60,0.22)`,
          }}>
            <img src="/assets/instructor-priyanka.jpg" alt="Priyanka Sahu"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 15%" }} />
          </div>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:DG, margin:"0 0 3px" }}>Priyanka Sahu</h1>
            <p style={{ color:TM, fontSize:12, margin:0 }}>Yoga Teacher &nbsp;·&nbsp; Wellness Expert</p>
          </div>
        </div>
        <HamburgerBtn onOpen={()=>setMenu(true)} />
      </div>

      {/* Credential chips */}
      <div className="hide-scroll" style={{
        display:"flex", gap:7, overflowX:"scroll" as const,
        marginTop:14, paddingBottom:2,
      } as any}>
        {CREDENTIALS.map((c,i)=>(
          <span key={i} style={{
            flexShrink:0, background:LG, color:DG,
            padding:"6px 12px", borderRadius:99, fontSize:10, fontWeight:700, whiteSpace:"nowrap" as const,
          }}>{c}</span>
        ))}
      </div>
    </div>

    {/* Bio (compact) */}
    <div style={{ flexShrink:0, padding:"14px 20px 12px" }}>
      <p style={{ color:TM, fontSize:13, lineHeight:1.55, margin:0, textAlign:"center" as const }}>
        5+ years guiding students through Hatha, Vinyasa, Pranayama &amp; therapeutic yoga with patience and genuine care.
      </p>
    </div>

    <div style={{ height:1, background:"hsl(40,18%,91%)", flexShrink:0, margin:"0 20px" }} />

    {/* Contact actions — fills remaining space */}
    <div style={{ flex:1, minHeight:0, padding:"14px 20px 0", display:"flex", flexDirection:"column", gap:8 }}>

      <a href={WA_BOOK} target="_blank" rel="noopener noreferrer" className="tap" style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        padding:"13px 0", borderRadius:99,
        background:"#25D366", color:WHITE,
        fontWeight:700, fontSize:14, textDecoration:"none",
        fontFamily:"'Inter',sans-serif", transition:"transform 0.15s",
        WebkitTapHighlightColor:"transparent",
      } as any}>💬 Chat on WhatsApp</a>

      <a href="tel:+919920155875" className="tap" style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        padding:"12px 0", borderRadius:99,
        background:LG, color:DG,
        fontWeight:700, fontSize:14, textDecoration:"none",
        fontFamily:"'Inter',sans-serif", transition:"transform 0.15s",
        WebkitTapHighlightColor:"transparent",
      } as any}>📞 +91 99201 55875</a>

      <div style={{ display:"flex", gap:8 }}>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="tap" style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
          padding:"11px 0", borderRadius:14,
          background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
          color:WHITE, fontWeight:600, fontSize:12, textDecoration:"none",
          fontFamily:"'Inter',sans-serif", transition:"transform 0.15s",
          WebkitTapHighlightColor:"transparent",
        } as any}>📸 Instagram</a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="tap" style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
          padding:"11px 0", borderRadius:14,
          background:"#0077B5", color:WHITE,
          fontWeight:600, fontSize:12, textDecoration:"none",
          fontFamily:"'Inter',sans-serif", transition:"transform 0.15s",
          WebkitTapHighlightColor:"transparent",
        } as any}>💼 LinkedIn</a>
      </div>

      {/* Location + links */}
      <div style={{ display:"flex", gap:8, flex:1, minHeight:0 }}>
        <div style={{ flex:2, background:WHITE, borderRadius:14, padding:"12px", display:"flex", alignItems:"flex-start", gap:8, overflow:"hidden" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>📍</span>
          <div style={{ minWidth:0 }}>
            <p style={{ fontWeight:700, fontSize:12, color:TD, margin:"0 0 2px" }}>Location</p>
            <p style={{ color:TM, fontSize:11, margin:0, lineHeight:1.45 }}>Adhiraj Garden, Sector 5, Kharghar</p>
          </div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
          <a href="/bring-yoga-to-your-society" style={{
            flex:1, display:"flex", flexDirection:"column", gap:2,
            padding:"10px 12px", borderRadius:14, background:LG, textDecoration:"none",
            justifyContent:"center",
          } as any}>
            <span style={{ fontSize:16 }}>🏘️</span>
            <span style={{ fontWeight:700, fontSize:10, color:DG, lineHeight:1.3 }}>Society Yoga</span>
          </a>
          <a href="/franchise-with-us" style={{
            flex:1, display:"flex", flexDirection:"column", gap:2,
            padding:"10px 12px", borderRadius:14, background:LG, textDecoration:"none",
            justifyContent:"center",
          } as any}>
            <span style={{ fontSize:16 }}>🤝</span>
            <span style={{ fontWeight:700, fontSize:10, color:DG, lineHeight:1.3 }}>Franchise</span>
          </a>
        </div>
      </div>

    </div>

  </div>
);

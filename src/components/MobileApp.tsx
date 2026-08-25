import { useState, useEffect } from "react";

type Tab = "home" | "schedule" | "about" | "gallery";

const WA_BOOK    = "https://wa.me/919920155875?text=Namaste!%20%F0%9F%99%8F%20I%27d%20like%20to%20book%20a%20FREE%20trial%20yoga%20class%20at%20Feel%20%26%20Heal%20Yoga.%20Could%20you%20please%20help%20me%20set%20up%20a%20slot%3F";
const WA_GENERAL = "https://wa.me/919920155875";
const INSTAGRAM  = "https://www.instagram.com/feelandhealyoga/";
const LINKEDIN   = "https://www.linkedin.com/company/feel-heal-yoga/";

const openTrialYogi = () => window.dispatchEvent(new CustomEvent("open-yogi-trial"));

const galleryPhotos = [
  // Named studio photos (confirmed exist)
  "/assets/hero-yoga.jpg",
  "/assets/studio.jpg",
  "/assets/meditation.jpg",
  "/assets/nature-zen.jpg",
  "/assets/instructor-priyanka.jpg",
  "/assets/instructor-meditation.jpg",
  "/assets/hero-yoga1.jpg",
  // WhatsApp yoga class photos (URL-encoded)
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.08.35.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.08.38.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.43.59.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.44.21.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20%281%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20%282%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20%283%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20%284%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.02%20%285%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03%20%281%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03%20%282%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03%20%283%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03%20%284%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03%20%285%29.jpeg",
  "/assets/images/WhatsApp%20Image%202026-01-22%20at%2022.46.03%20%286%29.jpeg",
];

const SCHEDULE = [
  { time:"6:00 – 7:00 AM",  batch:"Adults",       days:"Mon–Fri", type:"Online & Offline",  accent:"hsl(145,44%,28%)", badgeBg:"hsl(145,35%,91%)", badgeColor:"hsl(145,44%,26%)" },
  { time:"8:00 – 9:00 AM",  batch:"Adults",       days:"Mon–Fri", type:"Online & Offline",  accent:"hsl(38,78%,46%)",  badgeBg:"hsl(38,70%,92%)",  badgeColor:"hsl(38,60%,34%)"  },
  { time:"7:30 – 8:30 PM",  batch:"Adults",       days:"Mon–Fri", type:"Online & Offline",  accent:"hsl(220,40%,34%)", badgeBg:"hsl(220,35%,92%)", badgeColor:"hsl(220,40%,28%)" },
];

const REVIEWS = [
  { name:"Priya M.",  stars:5, text:"Best yoga studio in Navi Mumbai! The personal attention is incredible." },
  { name:"Rahul S.",  stars:5, text:"Lost 8kg in 3 months. The instructor truly cares about every student."  },
  { name:"Sneha K.",  stars:5, text:"The Women's batch is so warm and welcoming. I love every session!"      },
];

const REASONS = [
  { icon:"🌿", title:"Small Intimate Batches",  desc:"Not a crowd — every student gets real personal attention."      },
  { icon:"⭐", title:"5.0 Google Rating",       desc:"Consistently rated 5 stars by our growing student community."    },
  { icon:"🏠", title:"Online & Offline",        desc:"Attend from home or visit us in Kharghar, Navi Mumbai."          },
  { icon:"💪", title:"All Fitness Levels",      desc:"Beginner-friendly — no experience needed, just an open mind."    },
  { icon:"🌸", title:"Holistic Wellness",       desc:"Yoga, pranayama & mindfulness for body, mind and soul."          },
  { icon:"🕐", title:"Flexible Timings",        desc:"Morning and evening batches — choose what fits your schedule."    },
];

const green = "hsl(145,44%,26%)";
const cream = "hsl(42,30%,97%)";

const ghStyle = (topPad = 52): React.CSSProperties => ({
  paddingTop: `max(${topPad}px, env(safe-area-inset-top))`,
  paddingLeft:20, paddingRight:20, paddingBottom:20,
  background: "linear-gradient(135deg, hsl(145,44%,22%), hsl(155,42%,32%))",
});

const sectionLabel = (text: string): React.CSSProperties => ({
  fontSize:11, fontWeight:700, color:green,
  letterSpacing:"0.18em", textTransform:"uppercase" as const,
  margin:"0 0 10px",
});

/* ══════════════════════════════════════
   MOBILE APP SHELL
   ══════════════════════════════════════ */
export const MobileApp = () => {
  const [tab,  setTab]  = useState<Tab>("home");
  const [menu, setMenu] = useState(false);

  const openYogi = () => window.dispatchEvent(new CustomEvent("open-yogi-chat"));

  // When arriving from a sub-page (society/franchise), switch to the target tab
  useEffect(() => {
    const target = sessionStorage.getItem("mobileTargetTab");
    if (target) {
      sessionStorage.removeItem("mobileTargetTab");
      const validTabs: Tab[] = ["home", "schedule", "about", "gallery"];
      if (validTabs.includes(target as Tab)) setTab(target as Tab);
    }
  }, []);

  const navItems = [
    { id:"home"     as Tab, emoji:"🏠", label:"Home"     },
    { id:"schedule" as Tab, emoji:"📅", label:"Classes"  },
    { id:"about"    as Tab, emoji:"🌿", label:"About"    },
    { id:"gallery"  as Tab, emoji:"🖼️", label:"Gallery"  },
    { id:"chat"     as Tab, emoji:"🧘", label:"Chat"     },
  ];

  return (
    <div className="fixed inset-0 md:hidden flex flex-col"
      style={{ zIndex:60, background:cream, fontFamily:"'Inter',sans-serif" }}>

      {/* ── Always-visible hamburger button (top-right, all tabs) ── */}
      <button
        onClick={() => setMenu(true)}
        aria-label="Open menu"
        style={{
          position:"fixed",
          top:"max(14px, env(safe-area-inset-top))",
          right:16,
          zIndex:80,
          display:"flex", flexDirection:"column", gap:5,
          padding:10, border:"none",
          background: tab === "home" ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.92)",
          borderRadius:12, cursor:"pointer",
          backdropFilter:"blur(8px)",
          boxShadow: tab === "home" ? "none" : "0 2px 12px rgba(0,0,0,0.10)",
          WebkitTapHighlightColor:"transparent",
        } as any}
      >
        {[0,1,2].map(i => <span key={i} style={{
          display:"block", width:20, height:2,
          background: tab === "home" ? "white" : green,
          borderRadius:99,
        }} />)}
      </button>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ WebkitOverflowScrolling:"touch" } as any}>
        {tab==="home"     && <HomeTab     setTab={setTab} openYogi={openYogi} />}
        {tab==="schedule" && <ScheduleTab />}
        {tab==="about"    && <AboutTab    />}
        {tab==="gallery"  && <GalleryTab  />}
      </div>

      {/* Bottom Nav — 5 tabs */}
      <nav className="flex-shrink-0" style={{
        display:"grid", gridTemplateColumns:"repeat(5,1fr)",
        background:"white", borderTop:"1px solid hsl(40,18%,91%)",
        paddingBottom:"env(safe-area-inset-bottom)", minHeight:58,
      }}>
        {navItems.map(({ id, emoji, label }) => {
          const isChat   = id === "chat";
          const isActive = id === tab && !isChat;
          return (
            <button key={id}
              onClick={() => { if (isChat) { openYogi(); return; } setTab(id); }}
              style={{
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", gap:1, padding:"7px 0",
                border:"none", background:"none", cursor:"pointer",
                color: isActive ? green : "hsl(220,8%,58%)",
                position:"relative", WebkitTapHighlightColor:"transparent",
                transition:"color .15s",
              } as any}>
              <span style={{ fontSize:18, lineHeight:1 }}>{emoji}</span>
              <span style={{ fontSize:9, fontWeight: isActive ? 700 : 400, letterSpacing:"0.02em" }}>{label}</span>
              {isActive && (
                <span style={{ position:"absolute", bottom:0, width:20, height:2.5, background:green, borderRadius:99 }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Hamburger Sheet */}
      {menu && (
        <>
          <div onClick={() => setMenu(false)}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, backdropFilter:"blur(3px)" }} />
          <div style={{
            position:"fixed", bottom:0, left:0, right:0, zIndex:201,
            background:"white", borderRadius:"24px 24px 0 0",
            boxShadow:"0 -8px 40px rgba(0,0,0,0.18)", paddingBottom:32,
          }}>
            <div style={{ width:40, height:4, background:"hsl(40,18%,88%)", borderRadius:99, margin:"12px auto 16px" }} />
            {[
              { label:"Home",              emoji:"🏠", fn:() => { setMenu(false); setTab("home");                             } },
              { label:"Class Schedule",    emoji:"📅", fn:() => { setMenu(false); setTab("schedule");                        } },
              { label:"Meet Our Teacher",  emoji:"🧘", fn:() => { setMenu(false); setTab("about");                           } },
              { label:"Gallery",           emoji:"🖼️", fn:() => { setMenu(false); setTab("gallery");                         } },
              { label:"Society & Franchise",emoji:"🏘️", fn:() => { setMenu(false); window.location.href = "/bring-yoga-to-your-society"; } },
              { label:"Let's Connect",     emoji:"📞", fn:() => { setMenu(false); window.open(WA_GENERAL, "_blank");         } },
            ].map(item => (
              <button key={item.label} onClick={item.fn} style={{
                display:"flex", alignItems:"center", gap:14,
                width:"100%", padding:"13px 24px",
                border:"none", borderBottom:"1px solid hsl(40,18%,94%)",
                background:"none", cursor:"pointer", textAlign:"left",
                color:"hsl(220,18%,18%)", fontSize:15, fontWeight:600,
                WebkitTapHighlightColor:"transparent",
              } as any}>
                <span style={{ fontSize:20 }}>{item.emoji}</span>
                {item.label}
              </button>
            ))}
            <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer" style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              margin:"16px 24px 0", padding:12, borderRadius:99,
              background:green, color:"white", fontWeight:700, fontSize:13, textDecoration:"none",
            }}>💬 WhatsApp Us</a>
          </div>
        </>
      )}
    </div>
  );
};


/* ══════════════════════════════════════
   HOME TAB
   ══════════════════════════════════════ */
interface HomeTabProps { setTab:(t:Tab)=>void; openYogi:()=>void; }
const HomeTab = ({ setTab, openYogi }: HomeTabProps) => (
  <div style={{ minHeight:"calc(100dvh - 58px)" }}>
    {/* Hero */}
    <div style={{
      height:"58vh", position:"relative",
      backgroundImage:"url(/assets/hero-yoga.jpg)",
      backgroundSize:"cover", backgroundPosition:"center 80%",
    }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(5,16,9,.2) 0%,rgba(4,12,8,.65) 100%)" }} />

      {/* Hamburger is now in MobileApp shell - no local hamburger here */}

      {/* Centre emblem — dark green glass */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span className="yogi-ring-1" style={{ position:"absolute", width:220, height:220, borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.18)", background:"transparent" }} />
        <span className="yogi-ring-2" style={{ position:"absolute", width:192, height:192, borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.26)", background:"transparent" }} />
        <div style={{
          width:170, height:170, borderRadius:"50%",
          border:"2px solid rgba(255,255,255,0.28)",
          background:"rgba(8,36,18,0.55)",
          backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 8px 48px rgba(0,0,0,0.40), 0 0 60px rgba(40,120,60,0.28)",
          position:"relative", zIndex:2,
        }}>
          <img src="/assets/feel-and-heal-yoga-logo.svg" alt="Feel & Heal Yoga"
            style={{ width:108, height:108, filter:"brightness(0) invert(1)" }} />
        </div>
      </div>
    </div>

    {/* White panel */}
    <div style={{ background:"white", borderRadius:"22px 22px 0 0", marginTop:-20, position:"relative", zIndex:1, padding:"20px 16px 36px", boxShadow:"0 -4px 20px rgba(0,0,0,.05)" }}>
      {/* Stats */}
      <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:14, flexWrap:"wrap" }}>
        {["⭐ 5.0 Google","🌿 5+ Years","👥 Small Batches"].map(s=>(
          <span key={s} style={{ fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:99, background:"hsl(38,35%,95%)", color:"hsl(20,15%,40%)", border:"1px solid hsl(38,22%,88%)", whiteSpace:"nowrap" }}>{s}</span>
        ))}
      </div>

      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontStyle:"italic", color:"hsl(220,18%,18%)", textAlign:"center", marginBottom:14, lineHeight:1.5 }}>
        Re-energize yourself through Yoga
      </p>

      <button onClick={openTrialYogi} className="mobile-ripple-btn"
        style={{ display:"block", width:"100%", padding:13, borderRadius:99, textAlign:"center", background:"linear-gradient(135deg,hsl(38,92%,52%),hsl(28,88%,46%))", color:"hsl(20,20%,12%)", fontWeight:800, fontSize:13, textDecoration:"none", marginBottom:16, boxShadow:"0 4px 18px hsla(38,90%,52%,.38)", letterSpacing:"0.03em", position:"relative", overflow:"hidden", border:"none", cursor:"pointer", WebkitTapHighlightColor:"transparent" } as any}>
        🌿 Book Free Trial
      </button>

      {/* 2×2 grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[
          { emoji:"📅", label:"Classes",   sub:"View schedule",   bg:"hsl(145,30%,93%)", ibg:green,               fn:()=>setTab("schedule") },
          { emoji:"🌿", label:"About Us",  sub:"Why join & team", bg:"hsl(145,22%,92%)", ibg:"hsl(145,44%,30%)",  fn:()=>setTab("about") },
          { emoji:"📍", label:"Location",  sub:"Find our studio", bg:"hsl(38,65%,93%)",  ibg:"hsl(38,78%,46%)",   fn:()=>window.open("https://maps.google.com/?q=Adhiraj+Garden+Sector+5+Kharghar+Navi+Mumbai","_blank") },
          { emoji:"💬", label:"Chat Yogi", sub:"Ask anything",    bg:"hsl(220,38%,94%)", ibg:"hsl(220,40%,36%)",  fn:openYogi },
        ].map(({ emoji,label,sub,bg,ibg,fn }) => (
          <button key={label} onClick={fn} style={{ display:"flex", alignItems:"center", gap:10, padding:12, borderRadius:16, background:bg, border:"none", cursor:"pointer", textAlign:"left", WebkitTapHighlightColor:"transparent" } as any}>
            <span style={{ width:34, height:34, borderRadius:10, background:ibg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{emoji}</span>
            <div>
              <p style={{ fontWeight:700, fontSize:12, color:"hsl(220,18%,16%)", margin:0, lineHeight:1.3 }}>{label}</p>
              <p style={{ fontSize:10, color:"hsl(220,10%,54%)", margin:0, lineHeight:1.3 }}>{sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Society Yoga card */}
      <a href="/bring-yoga-to-your-society"
        style={{
          display:"flex", alignItems:"center", gap:12,
          padding:"13px 16px", borderRadius:16, marginTop:2,
          background:"linear-gradient(135deg,hsl(175,28%,22%),hsl(175,32%,32%))",
          textDecoration:"none",
        }}>
        <span style={{ fontSize:22, flexShrink:0 }}>🏘️</span>
        <div style={{ flex:1 }}>
          <p style={{ fontWeight:700, fontSize:13, color:"white", margin:0, lineHeight:1.3 }}>Bring Yoga to Your Society</p>
          <p style={{ fontSize:11, color:"rgba(255,255,255,.65)", margin:0, lineHeight:1.3 }}>Start Feel & Heal classes at your location</p>
        </div>
        <span style={{ color:"rgba(255,255,255,.55)", fontSize:18 }}>→</span>
      </a>
    </div>
  </div>
);

/* ══════════════════════════════════════
   SCHEDULE TAB — with full pricing
   ══════════════════════════════════════ */
const MOBILE_PRICING = {
  offline: {
    one:   2499,
    three: 2000,
    six:   1850,
  },
  online: {
    one:   1999,
    three: 1500,
    six:   1350,
  },
};

const ScheduleTab = () => {
  const [mode, setMode] = useState<"offline"|"online">("offline");
  const p = MOBILE_PRICING[mode];
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
  <div style={{ minHeight:"calc(100dvh - 58px)" }}>
    <div style={{ ...ghStyle(), display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <p style={{ color:"hsla(38,80%,80%,.85)", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:4 }}>Mon – Fri</p>
        <h1 style={{ color:"white", fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, margin:"0 0 2px" }}>Class Schedule</h1>
        <p style={{ color:"rgba(255,255,255,.65)", fontSize:12, margin:0 }}>Online & Offline · Kharghar</p>
      </div>
    </div>
    <div style={{ padding:"16px 16px 96px", background:cream, display:"flex", flexDirection:"column", gap:10 }}>

      {/* Timings */}
      {SCHEDULE.map((s,i) => (
        <div key={i} style={{ background:"white", borderRadius:16, padding:14, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 10px rgba(0,0,0,.05)", borderLeft:`3px solid ${s.accent}` }}>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontWeight:700, fontSize:15, color:"hsl(220,18%,14%)", margin:"0 0 2px" }}>{s.time}</p>
            <p style={{ fontSize:11, color:"hsl(220,10%,54%)", margin:"0 0 6px" }}>{s.batch} · {s.days}</p>
            <span style={{ display:"inline-block", fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:99, background:s.badgeBg, color:s.badgeColor }}>{s.type}</span>
          </div>
        </div>
      ))}

      {/* Pricing toggle */}
      <div style={{ background:"white", borderRadius:18, padding:16, boxShadow:"0 1px 10px rgba(0,0,0,.05)", marginTop:6 }}>
        <p style={{ fontSize:11, fontWeight:700, color:green, letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 12px" }}>💰 Membership Pricing</p>

        {/* Online/Offline toggle */}
        <div style={{ display:"flex", background:"hsl(38,30%,95%)", borderRadius:99, padding:3, marginBottom:14 }}>
          {(["offline", "online"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                flex:1, padding:"7px 0", borderRadius:99, border:"none", cursor:"pointer",
                fontWeight:700, fontSize:12, letterSpacing:"0.03em",
                background: mode === m ? green : "transparent",
                color: mode === m ? "white" : "hsl(20,14%,48%)",
                transition:"all .2s", WebkitTapHighlightColor:"transparent",
              } as any}>
              {m === "offline" ? "🏠 Offline" : "🌐 Online"}
            </button>
          ))}
        </div>

        {/* Plans */}
        {[
          { months:1, label:"1 Month", price:p.one, featured:false, badge:null, save:null },
          { months:3, label:"3 Months", price:p.three, featured:true, badge:"⭐ MOST POPULAR", save:p.one - p.three },
          { months:6, label:"6 Months", price:p.six, featured:false, badge:null, save:p.one - p.six },
        ].map(({ months, label, price, featured, badge, save }) => (
          <div key={months} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 14px", borderRadius:14, marginBottom:8,
            background: featured ? "hsl(145,28%,94%)" : "hsl(38,30%,97%)",
            border: featured ? "1.5px solid hsl(145,38%,62%)" : "1px solid hsl(38,22%,90%)",
          }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                <p style={{ fontWeight:700, fontSize:14, color:"hsl(220,18%,14%)", margin:0 }}>{label}</p>
                {badge && <span style={{ fontSize:9, fontWeight:800, padding:"2px 7px", borderRadius:99, background:"hsl(38,88%,50%)", color:"white" }}>{badge}</span>}
              </div>
              {save && save > 0 && <p style={{ fontSize:11, color:"hsl(145,44%,34%)", fontWeight:600, margin:0 }}>Save {fmt(save)}/month</p>}
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontWeight:800, fontSize:featured ? 18 : 16, color: featured ? green : "hsl(20,20%,18%)", margin:0, lineHeight:1.1 }}>{fmt(price)}</p>
              <p style={{ fontSize:10, color:"hsl(20,12%,52%)", margin:0 }}>/month</p>
            </div>
          </div>
        ))}

        <p style={{ fontSize:11, color:"hsl(20,12%,54%)", textAlign:"center", margin:"4px 0 0" }}>Couple & Family plans also available — ask Yogi! 🌿</p>
      </div>

      {/* CTA */}
      <button onClick={openTrialYogi} className="mobile-ripple-btn"
        style={{ display:"block", width:"100%", padding:13, borderRadius:99, background:"linear-gradient(135deg,hsl(38,92%,52%),hsl(28,88%,46%))", color:"hsl(20,20%,12%)", fontWeight:800, fontSize:13, textAlign:"center", textDecoration:"none", letterSpacing:"0.025em", boxShadow:"0 4px 18px hsla(38,90%,52%,.32)", position:"relative", overflow:"hidden", border:"none", cursor:"pointer", WebkitTapHighlightColor:"transparent" } as any}>
        🌿 Book a Free Trial Class
      </button>
    </div>
  </div>
  );
};

/* ══════════════════════════════════════
   ABOUT TAB — Teacher + Reasons + Contact + Social
   ══════════════════════════════════════ */
const AboutTab = () => (
  <div style={{ minHeight:"calc(100dvh - 58px)" }}>
    <div style={ghStyle()}>
      <h1 style={{ color:"white", fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, margin:"0 0 2px" }}>About Us</h1>
      <p style={{ color:"rgba(255,255,255,.65)", fontSize:12, margin:0 }}>Teacher · Why Join · Contact · Social</p>
    </div>

    <div style={{ padding:"20px 16px 96px", background:cream, display:"flex", flexDirection:"column", gap:24 }}>

      {/* ─ Meet Our Teacher ─ */}
      <section>
        <p style={sectionLabel("🧘 Meet Our Teacher")}>🧘 Meet Our Teacher</p>
        <div style={{ background:"white", borderRadius:18, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
          <img src="/assets/instructor-priyanka.jpg" alt="Priyanka" loading="eager"
            style={{ width:"100%", height:200, objectFit:"cover", objectPosition:"center top", display:"block" }}
            onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }} />
          <div style={{ padding:"16px 16px 20px" }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:800, color:"hsl(220,18%,14%)", margin:"0 0 2px" }}>Priyanka</p>
            <p style={{ fontSize:13, color:"hsl(220,10%,42%)", lineHeight:1.7, margin:"0 0 14px" }}>
              Priyanka brings warmth, expertise, and genuine care to every session. Trained in Hatha, Vinyasa, and therapeutic yoga — she tailors each class to your unique needs.
            </p>
            {["🌿 Hatha & Vinyasa Yoga","🧘 Pranayama & Meditation","🌸 PCOD / Thyroid Wellness","💪 Weight Management Yoga"].map(s=>(
              <div key={s} style={{ fontSize:12, color:"hsl(220,18%,22%)", padding:"7px 12px", background:"hsl(145,30%,93%)", borderRadius:10, marginBottom:6 }}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ─ Why Join Us ─ */}
      <section>
        <p style={sectionLabel("🌿 Why Join Us")}>🌿 Why Join Us</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {REASONS.map((r,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background:"white", borderRadius:14, boxShadow:"0 1px 8px rgba(0,0,0,.05)" }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{r.icon}</span>
              <div>
                <p style={{ fontWeight:700, fontSize:13, color:"hsl(220,18%,16%)", margin:"0 0 2px" }}>{r.title}</p>
                <p style={{ fontSize:12, color:"hsl(220,10%,52%)", margin:0, lineHeight:1.55 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={openTrialYogi} className="mobile-ripple-btn"
          style={{ display:"block", width:"100%", marginTop:14, padding:13, borderRadius:99, background:"linear-gradient(135deg,hsl(38,92%,52%),hsl(28,88%,46%))", color:"hsl(20,20%,12%)", fontWeight:800, fontSize:13, textAlign:"center", textDecoration:"none", boxShadow:"0 4px 16px hsla(38,90%,52%,.32)", position:"relative", overflow:"hidden", border:"none", cursor:"pointer", WebkitTapHighlightColor:"transparent" } as any}>
          🌿 Book Free Trial Class
        </button>
      </section>

      {/* ─ Student Stories ─ */}
      <section>
        <p style={sectionLabel("✨ Student Stories")}>✨ Student Stories</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {REVIEWS.map((r,i) => (
            <div key={i} style={{ background:"white", borderRadius:14, padding:14, boxShadow:"0 1px 8px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:13, color:"hsl(220,18%,16%)" }}>{r.name}</span>
                <span style={{ fontSize:13, color:"hsl(38,90%,52%)" }}>{"★".repeat(r.stars)}</span>
              </div>
              <p style={{ fontSize:12, color:"hsl(220,10%,50%)", lineHeight:1.6, margin:0 }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─ Let's Connect ─ */}
      <section>
        <p style={sectionLabel("📞 Let's Connect")}>📞 Let's Connect</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
          {[
            { emoji:"📍", label:"Address",  val:"Club House, Adhiraj Garden, Sector 5, Kharghar, Navi Mumbai – 410210", href:"https://maps.google.com/?q=Adhiraj+Garden+Sector+5+Kharghar+Navi+Mumbai" },
            { emoji:"📞", label:"Phone",    val:"+91 99201 55875",             href:"tel:+919920155875"                    },
            { emoji:"✉️", label:"Email",    val:"feelandhealyoga@gmail.com",   href:"mailto:feelandhealyoga@gmail.com"     },
            { emoji:"🕐", label:"Timings",  val:"Mon – Sat: 6 AM – 9 PM",     href:null                                   },
          ].map(item => (
            <div key={item.label} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background:"white", borderRadius:14, boxShadow:"0 1px 8px rgba(0,0,0,.05)" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{item.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:10, fontWeight:700, color:green, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 2px" }}>{item.label}</p>
                {item.href
                  ? <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontSize:13, color:"hsl(220,18%,18%)", fontWeight:600, textDecoration:"none", lineHeight:1.5 }}>{item.val}</a>
                  : <p style={{ fontSize:13, color:"hsl(220,18%,28%)", margin:0, lineHeight:1.5 }}>{item.val}</p>}
              </div>
            </div>
          ))}
        </div>
        <a href="tel:+919920155875"
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:12, borderRadius:99, background:"hsl(38,65%,93%)", color:"hsl(38,60%,28%)", fontWeight:700, fontSize:13, textDecoration:"none" }}>
          📞 Call Us
        </a>
      </section>

      {/* ─ Social Media ─ */}
      <section>
        <p style={sectionLabel("📲 Follow Us")}>📲 Follow Us</p>
        <div style={{ display:"flex", gap:10 }}>
          {[
            { label:"Instagram", emoji:"📸", href:INSTAGRAM, bg:"hsl(330,60%,94%)", color:"hsl(330,55%,45%)" },
            { label:"LinkedIn",  emoji:"💼", href:LINKEDIN,  bg:"hsl(210,60%,94%)", color:"hsl(210,55%,38%)" },
            { label:"WhatsApp",  emoji:"💬", href:WA_GENERAL,bg:"hsl(145,40%,92%)", color:green              },
          ].map(s=>(
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"14px 8px", borderRadius:16, background:s.bg, textDecoration:"none" }}>
              <span style={{ fontSize:24 }}>{s.emoji}</span>
              <span style={{ fontSize:11, fontWeight:700, color:s.color }}>{s.label}</span>
            </a>
          ))}
        </div>
      </section>

    </div>
  </div>
);

/* ══════════════════════════════════════
   GALLERY TAB
   ══════════════════════════════════════ */
const GalleryTab = () => (
  <div style={{ minHeight:"calc(100dvh - 58px)" }}>
    <div style={{ ...ghStyle(), display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
      <div>
        <h1 style={{ color:"white", fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, margin:"0 0 2px" }}>Gallery</h1>
        <p style={{ color:"rgba(255,255,255,.65)", fontSize:12, margin:0 }}>Our Studio & Classes · Kharghar</p>
      </div>
      {/* hamburger now in shell */}
    </div>
    <div style={{ padding:"16px 16px 96px", background:cream }}>
      <p style={sectionLabel("📸 Photos")}>📸 Photos</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
        {galleryPhotos.map((src,i) => (
          <div key={i} style={{ aspectRatio:"1", borderRadius:14, overflow:"hidden", background:"hsl(145,22%,84%)" }}>
            <img src={src} alt={`Photo ${i+1}`} loading="eager" decoding="async"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
              onError={e=>{ (e.target as HTMLImageElement).src="/assets/hero-yoga.jpg"; }} />
          </div>
        ))}
      </div>
      <p style={sectionLabel("✨ Student Stories")}>✨ Student Stories</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {REVIEWS.map((r,i) => (
          <div key={i} style={{ background:"white", borderRadius:14, padding:14, boxShadow:"0 1px 8px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontWeight:700, fontSize:13, color:"hsl(220,18%,16%)" }}>{r.name}</span>
              <span style={{ fontSize:13, color:"hsl(38,90%,52%)" }}>{"★".repeat(r.stars)}</span>
            </div>
            <p style={{ fontSize:12, color:"hsl(220,10%,50%)", lineHeight:1.6, margin:0 }}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── Shared small hamburger for tab headers ── */
const MenuBtn = ({ onMenu }: { onMenu:()=>void }) => (
  <button onClick={onMenu} style={{
    display:"flex", flexDirection:"column", gap:5,
    padding:10, border:"none", background:"rgba(255,255,255,0.12)",
    borderRadius:12, cursor:"pointer", backdropFilter:"blur(6px)",
    WebkitTapHighlightColor:"transparent", flexShrink:0,
  } as any}>
    {[0,1,2].map(i=><span key={i} style={{ display:"block", width:20, height:2, background:"white", borderRadius:99 }} />)}
  </button>
);

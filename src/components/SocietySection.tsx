import { useEffect, useRef, useState } from "react";

const teal   = "hsl(175,32%,38%)";
const gold   = "hsl(38,90%,52%)";
const cream  = "hsl(42,30%,97%)";
const sand   = "hsl(38,30%,91%)";
const slate  = "hsl(220,20%,18%)";
const muted  = "hsl(220,12%,52%)";

const benefits = [
  { icon:"🏘️", text:"Convenient classes within your society"           },
  { icon:"🎓", text:"Certified and experienced yoga teachers"           },
  { icon:"📋", text:"Customized schedules and programs"                 },
  { icon:"👨‍👩‍👧‍👦", text:"Yoga for all age groups"                         },
  { icon:"🌐", text:"Online and offline support"                        },
  { icon:"🌸", text:"Special wellness workshops"                        },
  { icon:"👩", text:"Women's wellness programs"                         },
  { icon:"👶", text:"Kids and senior citizen yoga"                      },
  { icon:"🧘", text:"Meditation and stress management"                  },
  { icon:"📦", text:"Flexible monthly packages"                         },
];

export const SocietySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="society"
      ref={sectionRef}
      style={{ background: cream, padding: "80px 24px" }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all .6s ease" }}>
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: teal, marginBottom: 14,
          }}>
            Community Wellness
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
            fontWeight: 700, color: slate,
            lineHeight: 1.2, marginBottom: 18,
          }}>
            Bring Wellness Closer to Home
          </h2>
          <p style={{ fontSize: "1.02rem", color: muted, lineHeight: 1.75, maxWidth: 640, margin: "0 auto 28px" }}>
            Transform your society into a healthier and happier community with professionally guided yoga sessions by Feel &amp; Heal Yoga. Customized programs for children, adults, senior citizens, women, beginners, and working professionals.
          </p>

          {/* Divider */}
          <div style={{ width: 56, height: 2, background: `linear-gradient(90deg, transparent, ${teal}, transparent)`, margin: "0 auto 40px" }} />
        </div>

        {/* Benefits grid — 2 col mobile, 5 col desktop */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginBottom: 48,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all .7s ease .15s",
        }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              background: "white",
              borderRadius: 16,
              padding: "18px 14px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              border: "1px solid hsl(38,22%,92%)",
              transition: "box-shadow .2s, transform .2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.10)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
            >
              <span style={{ fontSize: 26, display: "block", marginBottom: 8 }}>{b.icon}</span>
              <p style={{ fontSize: 12, fontWeight: 600, color: slate, lineHeight: 1.45, margin: 0 }}>{b.text}</p>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          border: "1px solid hsl(38,22%,91%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "all .7s ease .3s",
        }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 600, color: slate, textAlign: "center", margin: 0 }}>
            Ready to bring yoga to your residential society, office, or school?
          </p>
          <p style={{ fontSize: "0.93rem", color: muted, textAlign: "center", margin: 0, maxWidth: 520 }}>
            Start professional yoga and wellness sessions right at your location. Request a free consultation — no commitment required.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
            <a
              href="/bring-yoga-to-your-society"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 26px", borderRadius: 99,
                background: `linear-gradient(135deg, ${gold}, hsl(30,86%,46%))`,
                color: "hsl(20,20%,12%)", fontWeight: 700, fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: `0 4px 18px hsla(38,90%,52%,.40)`,
              }}
            >
              🏘️ Bring Yoga to My Society
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-yogi-chat"))}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 99,
                background: "transparent",
                border: `2px solid ${teal}`,
                color: teal, fontWeight: 700, fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              🧘 Talk to Yogi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

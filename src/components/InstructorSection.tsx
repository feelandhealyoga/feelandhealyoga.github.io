const instructorImage = "/assets/instructor-priyanka.jpg";

const CREDENTIALS = [
  {
    icon: "🌍",
    title: "Internationally Certified",
    sub: "Yoga Teacher",
  },
  {
    icon: "🌿",
    title: "Diploma in Naturopathy",
    sub: "Natural Living & Yogic Therapy",
  },
  {
    icon: "👶",
    title: "Pre & Post Natal Yoga",
    sub: "Certified Coach & Specialist",
  },
  {
    icon: "🧘",
    title: "Hatha & Vinyasa Flow",
    sub: "Traditional & modern fusion",
  },
  {
    icon: "🫁",
    title: "Breathwork & Pranayama",
    sub: "Advanced alignment training",
  },
  {
    icon: "💫",
    title: "Holistic Wellness",
    sub: "Mind, body & breath integration",
  },
];

export const InstructorSection = () => {
  return (
    <section
      id="instructor"
      style={{
        padding: "100px 24px",
        background: "linear-gradient(170deg, hsl(145,14%,96%) 0%, hsl(40,28%,97%) 60%, hsl(145,12%,95%) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle decorative orb — top right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(145,38%,70%,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Subtle decorative orb — bottom left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(42,68%,62%,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Section header — matches site-wide pattern ── */}
        <div className="text-center mb-14">
          <div className="yogic-label mb-3 instructor-label">Meet Your Teacher</div>
          <h2 className="yogic-section-heading section-title-decor instructor-heading mb-3">
            Priyanka Sahu
          </h2>
          <p className="yogic-section-subheading instructor-sub mt-6">
            Internationally Certified Yoga Teacher &middot; Holistic Wellness Expert
          </p>
        </div>

        {/* ── Main grid: photo | bio ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
          alignItems: "start",
        }}
          className="instructor-grid"
        >
          {/* ── LEFT: Photo column ── */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            {/* Decorative frame bracket — top left */}
            <div aria-hidden="true" style={{
              position: "absolute",
              top: -16,
              left: "calc(50% - 180px - 16px)",
              width: 48,
              height: 48,
              borderTop: "2.5px solid hsl(145,38%,52%)",
              borderLeft: "2.5px solid hsl(145,38%,52%)",
              borderRadius: "6px 0 0 0",
              opacity: 0.55,
            }} />
            {/* Decorative frame bracket — bottom right */}
            <div aria-hidden="true" style={{
              position: "absolute",
              bottom: -16,
              right: "calc(50% - 180px - 16px)",
              width: 48,
              height: 48,
              borderBottom: "2.5px solid hsl(42,68%,52%)",
              borderRight: "2.5px solid hsl(42,68%,52%)",
              borderRadius: "0 0 6px 0",
              opacity: 0.55,
            }} />

            {/* Photo */}
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: 360,
            }}>
              {/* Elegant outer glow frame */}
              <div aria-hidden="true" style={{
                position: "absolute",
                inset: -3,
                borderRadius: 23,
                background: "linear-gradient(145deg, hsl(145,38%,58%), hsl(42,68%,58%), hsl(145,38%,48%))",
                opacity: 0.22,
                filter: "blur(1px)",
                zIndex: 0,
              }} />

              <img
                src={instructorImage}
                alt="Priyanka Sahu — Certified Yoga Instructor, Feel & Heal Yoga"
                width={370}
                height={460}
                loading="lazy"
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  aspectRatio: "4/5",
                  objectFit: "cover",
                  objectPosition: "top",
                  borderRadius: 22,
                  boxShadow: [
                    "0 32px 80px hsla(145,30%,6%,0.70)",
                    "0 8px 28px rgba(0,0,0,0.40)",
                    "0 0 0 1px hsla(145,40%,40%,0.18)",
                  ].join(", "),
                  display: "block",
                }}
              />

              {/* Bottom vignette for elegance */}
              <div aria-hidden="true" style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "38%",
                borderRadius: "0 0 20px 20px",
                background: "linear-gradient(to top, hsla(145,22%,12%,0.35) 0%, transparent 100%)",
                zIndex: 2,
                pointerEvents: "none",
              }} />

              {/* Floating name badge on photo */}
              <div style={{
                position: "absolute",
                bottom: 18,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 3,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 12,
                padding: "9px 20px",
                textAlign: "center",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                border: "1px solid rgba(255,255,255,0.7)",
              }}>
                <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14.5, color: "hsl(220,18%,14%)", letterSpacing: "0.02em" }}>Priyanka Sahu</p>
                <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: "hsl(145,44%,36%)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>Yoga Instructor</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Bio column ── */}
          <div>
            {/* Pull quote — opening line */}
            <div style={{
              position: "relative",
              padding: "18px 20px 18px 28px",
              borderLeft: "3px solid hsl(145,44%,40%)",
              background: "linear-gradient(135deg, hsl(145,22%,95%), hsl(40,30%,97%))",
              borderRadius: "0 14px 14px 0",
              marginBottom: 28,
            }}>
              <span style={{
                position: "absolute",
                top: -8,
                left: 16,
                fontSize: 52,
                lineHeight: 1,
                color: "hsl(145,38%,68%)",
                fontFamily: "'Playfair Display', serif",
                opacity: 0.6,
              }}>"</span>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
                fontStyle: "italic",
                color: "hsl(220,18%,20%)",
                lineHeight: 1.65,
                margin: 0,
                paddingTop: 10,
              }}>
                Yoga is more than movement — it's a journey toward balance, strength, and inner peace.
              </p>
            </div>

            {/* Bio paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 36 }}>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15.5,
                lineHeight: 1.80,
                color: "hsl(220,12%,32%)",
                margin: 0,
              }}>
                With a deep passion for holistic wellness, Priyanka Sahu believes yoga is more than movement — it's a journey toward balance, strength, and inner peace. Every session is thoughtfully designed to help you move better, breathe deeper, and reconnect with yourself, regardless of your age or fitness level.
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15.5,
                lineHeight: 1.80,
                color: "hsl(220,12%,32%)",
                margin: 0,
              }}>
                Blending traditional yogic wisdom with modern understanding of body mechanics, she creates a safe and supportive space where every student feels seen, encouraged, and empowered to grow at their own pace.
              </p>
            </div>


            {/* Thin gold divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, hsl(145,30%,78%), hsl(42,60%,72%), transparent)",
              marginBottom: 28,
              borderRadius: 99,
            }} />

            {/* Credentials label */}
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "hsl(42,68%,46%)", marginBottom: 16, margin: "0 0 16px" }}>
              Qualifications &amp; Expertise
            </p>

            {/* ── Credentials grid — 3 columns, minimal elegant cards ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 32,
            }}
              className="cred-grid"
            >
              {CREDENTIALS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "14px 12px",
                    background: "white",
                    borderRadius: 14,
                    border: "1px solid hsl(145,22%,90%)",
                    borderTop: "3px solid hsl(145,42%,62%)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    transition: "transform 0.22s ease, box-shadow 0.22s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px hsla(145,38%,40%,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                  }}
                >
                  <span style={{
                    fontSize: 18,
                    width: 34, height: 34,
                    background: "hsl(145,22%,94%)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {c.icon}
                  </span>
                  <div>
                    <p style={{ margin: 0, marginBottom: 3, fontWeight: 700, fontSize: 12, color: "hsl(220,16%,16%)", fontFamily: "'Inter', sans-serif", lineHeight: 1.3 }}>
                      {c.title}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: "hsl(220,8%,58%)", fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
                      {c.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Social links ── */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a
                href="https://www.instagram.com/feelandhealyoga/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "1.5px solid hsl(145,30%,70%)",
                  background: "white",
                  color: "hsl(145,44%,28%)",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(145,44%,28%)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 14px hsla(145,44%,28%,0.24)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "hsl(145,44%,28%)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Follow on Instagram
              </a>

              <a
                href="https://www.linkedin.com/company/feel-heal-yoga/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "1.5px solid hsl(210,28%,72%)",
                  background: "white",
                  color: "hsl(210,70%,38%)",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(210,70%,38%)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 14px hsla(210,70%,38%,0.24)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "hsl(210,70%,38%)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Connect on LinkedIn
              </a>

              <a
                href="https://www.youtube.com/@Feelandhealyoga"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 18px", borderRadius: 999,
                  border: "1.5px solid hsla(0,80%,55%,0.30)",
                  background: "hsla(0,80%,55%,0.08)",
                  color: "hsl(0,75%,55%)",
                  textDecoration: "none", fontSize: 13, fontWeight: 600,
                  fontFamily: "'Inter', sans-serif", transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(0,75%,50%)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px hsla(0,75%,50%,0.30)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "hsla(0,80%,55%,0.08)";
                  e.currentTarget.style.color = "hsl(0,75%,55%)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch on YouTube
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive grid CSS ── */}
      <style>{`
        @media (min-width: 768px) {
          .instructor-grid {
            grid-template-columns: 5fr 7fr !important;
            gap: 64px !important;
          }
        }
        @media (max-width: 700px) {
          .cred-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 440px) {
          .cred-grid { grid-template-columns: 1fr !important; }
        }
        /* Dark-background overrides for shared yogic heading classes */
        .instructor-label {
          color: hsl(42, 68%, 52%) !important;
        }
        .instructor-label::before,
        .instructor-label::after {
          background: hsla(42, 68%, 52%, 0.40) !important;
        }
      `}</style>
    </section>
  );
};

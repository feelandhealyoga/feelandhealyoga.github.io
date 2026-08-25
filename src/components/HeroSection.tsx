import { useState } from "react";
import { Blurhash } from "react-blurhash";
import { ChevronDown } from "lucide-react";

const heroImage  = "/assets/hero-yoga.jpg";
const logoImage  = "/assets/feel-and-heal-yoga-logo.svg";

export const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Blurhash placeholder */}
      <Blurhash
        hash="q4Bgnq.000x]a7tQ?@W901I2w9nzx?o{RPje9BxV?$r_9aM{s=RQ.D%boiDkVgeoR}o]mx4qIB.5bpbXRmt3Ed%I?sxbt8N1M~V["
        width="100%"
        height="100%"
        resolutionX={32}
        resolutionY={32}
        punch={1}
        className={`absolute inset-0 absolute-important transition-opacity duration-1000 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Background image — shifted to show lower portion */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "center 88%",
          transform: "scale(1.03)",
        }}
      />

      {/* Single elegant overlay — warm tint, image stays visible */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(8,20,12,0.18) 0%, rgba(8,20,12,0.32) 45%, rgba(4,12,8,0.68) 100%)",
            "linear-gradient(to right, rgba(30,60,30,0.12) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Preload trigger — high priority for LCP */}
      <img src={heroImage} onLoad={() => setLoaded(true)} className="hidden" alt="" fetchPriority="high" decoding="async" />

      {/* ── Content ── */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto w-full flex flex-col items-center">

        {/* Sanskrit label */}
        <p
          className="animate-fade-in-up"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(220,185,100,0.90)",
            marginBottom: 28,
            animationDelay: "0s",
            animationFillMode: "both",
          }}
        >
          ॐ &nbsp; Namaste &nbsp; ॐ
        </p>

        {/* Logo */}
        <img
          src={logoImage}
          alt="Feel & Heal Yoga"
          width="180"
          height="180"
          loading="eager"
          fetchPriority="high"
          className="w-44 h-44 md:w-60 md:h-60 mx-auto drop-shadow-2xl animate-float"
          style={{
            filter: "brightness(0) invert(1)",
            marginBottom: 24,
            animationDelay: "0.1s",
            animationFillMode: "both",
          }}
        />

        {/* Hidden h1 for SEO */}
        <h1 className="sr-only">Feel &amp; Heal Yoga — Yoga Classes in Kharghar, Navi Mumbai</h1>

        {/* Thin gold rule */}
        <div
          className="animate-fade-in-up"
          style={{
            width: 64,
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,92,0.8), transparent)",
            marginBottom: 22,
            animationDelay: "0.24s",
            animationFillMode: "both",
          }}
        />

        {/* Tagline */}
        <p
          className="animate-fade-in-up"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
            fontWeight: 500,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.97)",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            marginBottom: 20,
            textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)",
            animationDelay: "0.30s",
            animationFillMode: "both",
          }}
        >
          Re-energize yourself<br />through Yoga
        </p>

        {/* Body copy */}
        <p
          className="animate-fade-in-up font-light leading-relaxed mx-auto text-center"
          style={{
            color: "rgba(255,255,255,0.80)",
            fontSize: "0.97rem",
            marginBottom: 40,
            textShadow: "0 1px 8px rgba(0,0,0,0.45)",
            animationDelay: "0.38s",
            animationFillMode: "both",
          }}
        >
          If you're thinking about starting yoga, this is the perfect time to begin
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.46s", animationFillMode: "both" }}
        >
          {/* Primary — orange/gold */}
          <button
            id="hero-book-trial-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("open-yogi-trial"))}
            className="hero-trial-btn inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full cursor-pointer border-0 transition-all"
            style={{
              background: "linear-gradient(135deg, hsl(38,92%,52%), hsl(30,86%,46%))",
              color: "hsl(220,18%,12%)",
              fontSize: "0.94rem",
              letterSpacing: "0.02em",
              boxShadow: "0 6px 28px hsla(38,92%,52%,0.55), inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
          >
            🌿 Book Free Trial
          </button>

          {/* Secondary — ghost */}
          <a
            href="#schedule"
            className="inline-flex items-center gap-2 font-medium px-7 py-3.5 rounded-full no-underline transition-all"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.30)",
              color: "rgba(255,255,255,0.88)",
              fontSize: "0.9rem",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            📅 View Schedule
          </a>
        </div>

        {/* Society CTA */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.56s", animationFillMode: "both", marginTop: 12 }}
        >
          <a
            href="/bring-yoga-to-your-society"
            className="inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-full no-underline transition-all"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "rgba(255,255,255,0.78)",
              fontSize: "0.85rem",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            🏘️ Bring Yoga to Your Society
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity hover:opacity-100 animate-bounce-slow"
        aria-label="Scroll to About"
        style={{ color: "rgba(255,255,255,0.50)" }}
      >
        <ChevronDown className="w-7 h-7" />
      </a>
    </section>
  );
};

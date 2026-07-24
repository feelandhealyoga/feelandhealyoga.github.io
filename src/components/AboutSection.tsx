import { useEffect, useRef } from "react";

const stats = [
  { value: "5 ★", label: "Google Rating", icon: "⭐" },
  { value: "5+", label: "Years of Healing", icon: "🌿" },
];

const benefits = [
  { icon: "🌱", title: "Perfect for Beginners", desc: "No experience needed. Everyone starts somewhere — our instructors guide you step by step at your own pace." },
  { icon: "🔥", title: "Weight Loss & Stamina", desc: "Helps with weight loss, inch loss, and building lasting physical stamina through consistent practice." },
  { icon: "🧘", title: "Meditation, Mindfulness & Stress Relief", desc: "Guided meditation and pranayama to quiet the mind, reduce stress, anxiety and cultivate lasting inner calm." },
  { icon: "🦴", title: "Pain Relief", desc: "Relieves chronic back pain, joint stiffness and body heaviness through therapeutic postures." },
  { icon: "🌸", title: "Emotional Balance", desc: "Cultivates inner discipline, calmness and emotional resilience for a balanced life." },
  { icon: "🏡", title: "Family-Friendly", desc: "A safe, welcoming and inclusive environment where the whole family can grow together." },
];

export const AboutSection = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    [...cardRefs.current, ...statRefs.current].forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 px-6 yogic-pattern section-cream">
      <div className="max-w-5xl mx-auto text-center">

        {/* Yogic label */}
        <div className="yogic-label mb-3">About Us</div>

        <h2 className="yogic-section-heading section-title-decor mb-3">
          Yoga Sessions Offline &amp; Online
        </h2>
        <p className="yogic-section-subheading mt-6">
          Welcome to <strong>Feel &amp; Heal Yoga</strong> — a nurturing space where every breath is a step toward a healthier, calmer, more vibrant you.
        </p>

        {/* Intro paragraph */}
        <div className="max-w-2xl mx-auto mb-16 text-[hsl(20,18%,38%)] leading-relaxed text-base">
          <p>
            Whether you're a complete beginner or an experienced practitioner, our online and offline classes
            are thoughtfully designed to meet you exactly where you are — helping you build strength,
            flexibility, and inner peace one breath at a time.
          </p>
        </div>

        {/* Stats Strip — 2 cards */}
        <div className="grid grid-cols-2 gap-4 mb-20 max-w-sm mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              ref={(el) => { statRefs.current[i] = el; }}
              className={`scroll-reveal scroll-reveal-delay-${i + 1} bg-[hsl(145,20%,94%)] rounded-2xl py-6 px-4 border border-[hsl(145,25%,85%)] hover:bg-[hsl(145,25%,91%)] transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-3xl font-bold text-[hsl(145,38%,35%)] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(30,15%,45%)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Lotus divider */}
        <div className="lotus-divider">
          <span className="text-2xl animate-pulse-soft">🪷</span>
        </div>

        {/* Benefit Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {benefits.map((b, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`scroll-reveal scroll-reveal-delay-${i + 1} card-yogic p-6 rounded-2xl group cursor-default`}
              style={{ borderLeft: "4px solid hsl(38,90%,52%)" }}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                {b.icon}
              </div>
              <h3 className="text-base font-bold text-[hsl(20,20%,18%)] mb-2">{b.title}</h3>
              <p className="text-sm text-[hsl(20,15%,42%)] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

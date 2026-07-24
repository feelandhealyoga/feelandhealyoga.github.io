import { useEffect, useRef } from "react";

const reasons = [
  {
    icon: "🌍",
    title: "Online & Offline Both",
    desc: "Join from the comfort of your home or attend in-person at our Kharghar studio. You decide what works best for you.",
    gradient: "from-[hsl(200,55%,96%)] to-[hsl(210,45%,94%)]",
    accent: "hsl(200,60%,48%)",
    border: "border-blue-200",
  },
  {
    icon: "🎯",
    title: "Personalised Attention",
    desc: "Small batch sizes mean our instructors know your name, your goals, and your progress — not just your yoga mat number.",
    gradient: "from-[hsl(145,40%,95%)] to-[hsl(155,35%,93%)]",
    accent: "hsl(145,42%,40%)",
    border: "border-emerald-200",
  },
  {
    icon: "💪",
    title: "Results You Can See",
    desc: "From weight loss to pain relief, hormonal balance to stress reduction — our students see real, lasting transformation.",
    gradient: "from-[hsl(25,60%,96%)] to-[hsl(30,50%,94%)]",
    accent: "hsl(25,80%,48%)",
    border: "border-orange-200",
  },
  {
    icon: "👩",
    title: "Women's Only Batch",
    desc: "An exclusive 10–11 AM batch for women, creating a safe, supportive space to practice freely and comfortably.",
    gradient: "from-[hsl(340,55%,96%)] to-[hsl(350,45%,94%)]",
    accent: "hsl(340,55%,52%)",
    border: "border-rose-200",
  },
  {
    icon: "⭐",
    title: "5-Star Rated on Google",
    desc: "Consistently rated 5 stars by our students. When people love what they experience, they come back — and they do.",
    gradient: "from-[hsl(48,80%,96%)] to-[hsl(38,70%,94%)]",
    accent: "hsl(38,82%,46%)",
    border: "border-yellow-200",
  },
  {
    icon: "🎁",
    title: "Start with a Free Trial",
    desc: "Your first class is absolutely free — come experience the Feel & Heal difference for yourself. Just show up and we'll handle the rest.",
    gradient: "from-[hsl(270,40%,96%)] to-[hsl(260,35%,94%)]",
    accent: "hsl(265,45%,52%)",
    border: "border-purple-200",
  },
  {
    icon: "🤖",
    title: "AI Wellness Assistant 24/7",
    desc: "Meet Yogi — our intelligent AI guide available round the clock to answer questions, help you book, and personalise your yoga journey instantly.",
    gradient: "from-[hsl(220,50%,96%)] to-[hsl(230,42%,94%)]",
    accent: "hsl(225,65%,52%)",
    border: "border-indigo-200",
  },
  {
    icon: "🩺",
    title: "Therapeutic Yoga Programs",
    desc: "Specialised sessions for back pain, PCOS, thyroid, diabetes, and posture correction — yoga designed around your health needs, not just fitness.",
    gradient: "from-[hsl(175,42%,95%)] to-[hsl(165,35%,93%)]",
    accent: "hsl(170,55%,38%)",
    border: "border-teal-200",
  },
  {
    icon: "🎓",
    title: "Structured Learning Path",
    desc: "From absolute beginner to advanced practitioner — our curriculum grows with you, with clear milestones at every stage of your journey.",
    gradient: "from-[hsl(45,70%,96%)] to-[hsl(50,60%,94%)]",
    accent: "hsl(45,80%,46%)",
    border: "border-amber-200",
  },
];

export const ReasonsSection = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      { threshold: 0.1 }
    );
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="reasons" className="py-24 px-6 section-sage yogic-pattern">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="yogic-label mb-3">Why Choose Us</div>
          <h2 className="yogic-section-heading section-title-decor mb-3">
            9 Reasons to Join Feel &amp; Heal Yoga
          </h2>
          <p className="yogic-section-subheading mt-6">
            Thousands of students have transformed their lives here. Here's what makes us different.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {reasons.map((r, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`scroll-reveal scroll-reveal-delay-${(i % 6) + 1} group bg-gradient-to-br ${r.gradient} border ${r.border} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default relative overflow-hidden`}
            >
              {/* Accent glow top-left */}
              <div
                className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ background: r.accent }}
              />

              <div className="relative z-10">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300 inline-block mb-4">
                  {r.icon}
                </span>
                <h3
                  className="text-lg font-bold text-[hsl(20,20%,18%)] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {r.title}
                </h3>
                <p className="text-sm text-[hsl(20,14%,40%)] leading-relaxed">{r.desc}</p>
              </div>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: r.accent }}
              />
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className="rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(145,38%,30%), hsl(160,42%,38%))",
            boxShadow: "0 12px 40px hsla(145,38%,30%,0.30)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: "rgba(255,255,255,0.3)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: "rgba(255,255,255,0.3)", transform: "translate(-30%, 30%)" }} />

          <div className="relative z-10">
            <p
              className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3"
              style={{ letterSpacing: "0.3em" }}
            >
              ✨ Limited Free Trial Slots
            </p>
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Begin Your Journey?
            </h3>
            <p className="text-white/80 text-sm mb-7 max-w-md mx-auto leading-relaxed">
              Your first class is completely free. Just come with an open heart and Yogi AI will guide you every step of the way. 🌿
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-yogi-trial"))}
              className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full cursor-pointer border-0 transition-all hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, hsl(38,92%,52%), hsl(30,86%,46%))",
                color: "hsl(220,18%,12%)",
                fontSize: "0.95rem",
                boxShadow: "0 6px 24px hsla(38,92%,52%,0.55)",
              }}
            >
              🌿 Book Your Free Trial
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

import { useEffect, useRef } from "react";

const experiences = [
  { number: "01", icon: "🌊", title: "Flow Sessions", description: "Seamlessly transition between poses in a meditative flow — breathing and movement united as one.", gradient: "from-[hsl(200,50%,96%)] to-[hsl(210,40%,94%)]", border: "border-blue-200" },
  { number: "02", icon: "🌬️", title: "Pranayama (Breathwork)", description: "Master ancient breathing techniques for enhanced energy, lung capacity, and profound calm.", gradient: "from-[hsl(160,40%,95%)] to-[hsl(145,30%,93%)]", border: "border-emerald-200" },
  { number: "03", icon: "🎯", title: "Correct Alignment", description: "Learn proper form and body mechanics to prevent injury and maximize the healing benefits of every posture.", gradient: "from-[hsl(145,35%,95%)] to-[hsl(160,30%,94%)]", border: "border-green-200" },
  { number: "04", icon: "🧘", title: "Mindfulness & Dhyana", description: "Cultivate deep awareness and presence — on and off the mat — through guided meditation and inner focus.", gradient: "from-[hsl(270,35%,96%)] to-[hsl(260,30%,95%)]", border: "border-purple-200" },
  { number: "05", icon: "🌈", title: "Chakra Healing", description: "Balance and awaken your seven energy centres through targeted asanas, breathwork, and sound — restoring harmony across body, mind, and spirit.", gradient: "from-[hsl(30,55%,96%)] to-[hsl(20,45%,94%)]", border: "border-orange-200" },
];

export const ExperienceSection = () => {
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

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="py-24 px-6 section-sage yogic-pattern">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="yogic-label mb-3">The Journey Within</div>
          <h2 className="yogic-section-heading section-title-decor mb-3">
            What You'll Experience
          </h2>
          <p className="yogic-section-subheading mt-6">
            Every session is a sacred space — thoughtfully crafted to nurture your mind, body, and spirit through authentic yogic practice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              className={`scroll-reveal scroll-reveal-delay-${index + 1} group bg-gradient-to-br ${exp.gradient} border ${exp.border} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-default`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">
                  {exp.icon}
                </span>
                <span
                  className="text-5xl font-bold text-[hsl(20,15%,85%)] leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {exp.number}
                </span>
              </div>
              <h3
                className="text-lg font-bold text-[hsl(20,20%,18%)] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {exp.title}
              </h3>
              <p className="text-sm text-[hsl(20,12%,40%)] leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

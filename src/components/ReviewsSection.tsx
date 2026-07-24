import { useEffect, useRef, useState, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Nidhi Shree",
    initials: "NS",
    text: "I absolutely love attending this yoga class every day! The instructors are incredibly knowledgeable, supportive, and passionate. The atmosphere is always calming and welcoming — the perfect place to find peace.",
    rating: 5,
    color: "#2d8a5f",
    bg: "hsl(145,38%,96%)",
  },
  {
    name: "Vinu NS",
    initials: "VN",
    text: "Best Yoga Class — A True Mind-Body-Spirit Experience. Feel and Heal Yoga is hands down the best yoga class. Each session is truly transformative and leaves me feeling renewed.",
    rating: 5,
    color: "#d4810e",
    bg: "hsl(38,80%,96%)",
  },
  {
    name: "Bharti Paunikar",
    initials: "BP",
    text: "Thank you for an incredible class Priyanka! Your classes always nourish me in the most amazing ways. It's HEALING. I really loved the meditation and found it so helpful for my daily life.",
    rating: 5,
    color: "#b5395e",
    bg: "hsl(340,45%,96%)",
  },
  {
    name: "Nilam Shinde",
    initials: "NS",
    text: "Ye yoga class bahoot hi accha hai. Priyanka individual attention deti hai. Advance level ke aasnas bhi sikhate hain. Priyanka mam bahoot acchi teacher hai, bahut kind aur patient hai.",
    rating: 5,
    color: "#6c4eb8",
    bg: "hsl(270,40%,96%)",
  },
  {
    name: "Priyanka 😊",
    initials: "PR",
    text: "Highly recommend. Best yoga class I have ever attended in my life. The energy is wonderful and every class leaves me feeling deeply at peace — something I couldn't find anywhere else.",
    rating: 5,
    color: "#1a6fa8",
    bg: "hsl(205,55%,96%)",
  },
];

const INTERVAL = 4800;

export const ReviewsSection = () => {
  const total = reviews.length;
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [slideDir, setSlideDir] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const STEP = 100 / (INTERVAL / 80); // progress increments per 80ms

  const goTo = useCallback((idx: number, dir: "next" | "prev") => {
    if (sliding) return;
    setSlideDir(dir);
    setSliding(true);
    setProgress(0);
    setTimeout(() => {
      setCurrent(idx);
      setSliding(false);
    }, 450);
  }, [sliding]);

  const goNext = useCallback(() => goTo((current + 1) % total, "next"), [current, goTo, total]);
  const goPrev = useCallback(() => goTo((current - 1 + total) % total, "prev"), [current, goTo, total]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(goNext, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, goNext]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    if (paused) return;
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + STEP, 100));
    }, 80);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [paused, current]);

  const r = reviews[current];

  // Slide animation values
  const enterFrom = slideDir === "next" ? "60px" : "-60px";
  const exitTo   = slideDir === "next" ? "-60px" : "60px";

  return (
    <section id="reviews" className="py-24 px-6 section-lotus yogic-pattern overflow-hidden">
      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <div className="yogic-label mb-3">Testimonials</div>
          <h2 className="yogic-section-heading section-title-decor mb-3">
            Words from Our Students
          </h2>
          <p className="yogic-section-subheading mt-5">
            Real experiences from the beautiful community at Feel &amp; Heal Yoga.
          </p>
        </div>

        {/* Slider wrapper */}
        <div
          className="relative select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Card */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: r.bg,
              border: `1px solid ${r.color}22`,
              boxShadow: `0 20px 56px ${r.color}18, 0 4px 16px rgba(0,0,0,0.05)`,
              transition: "background 0.5s ease, box-shadow 0.5s ease",
            }}
          >
            {/* Progress bar */}
            <div className="h-[3px] w-full bg-black/5 overflow-hidden">
              <div
                className="h-full transition-none"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${r.color}88, ${r.color})`,
                  transition: paused ? "none" : undefined,
                }}
              />
            </div>

            {/* Inner content with slide animation */}
            <div
              className="px-8 py-10 md:px-14 md:py-12"
              style={{
                animation: sliding
                  ? `slideOut 0.22s ease-in forwards`
                  : `slideIn 0.38s cubic-bezier(0.16,1,0.3,1) forwards`,
              }}
            >
              {/* Giant quote */}
              <div
                className="text-[7rem] leading-none font-serif select-none -mt-4 mb-1"
                style={{ color: r.color, opacity: 0.15, fontFamily: "'Playfair Display', serif" }}
              >
                "
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ fill: r.color, color: r.color }} />
                ))}
              </div>

              {/* Quote text */}
              <p
                className="text-lg md:text-xl leading-[1.75] mb-8 text-[hsl(20,18%,22%)]"
                style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
              >
                {r.text}
              </p>

              {/* Reviewer row */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)` }}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[hsl(20,20%,18%)] text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {r.name}
                    </p>
                    <p className="text-xs text-[hsl(30,12%,52%)] flex items-center gap-1">
                      <svg viewBox="0 0 48 48" className="w-3 h-3 flex-shrink-0" fill="none">
                        <path fill="#4285F4" d="M47.532 24.552c0-1.636-.132-3.21-.378-4.72H24.48v8.932h12.964c-.558 3.008-2.254 5.558-4.806 7.268v6.042h7.776c4.55-4.19 7.118-10.36 7.118-17.522z"/>
                        <path fill="#34A853" d="M24.48 48c6.516 0 11.98-2.158 15.974-5.838l-7.776-6.042c-2.158 1.448-4.912 2.302-8.198 2.302-6.31 0-11.654-4.26-13.57-9.988H2.908v6.24C6.884 42.814 15.15 48 24.48 48z"/>
                        <path fill="#FBBC05" d="M10.91 28.434A14.51 14.51 0 0 1 10.15 24c0-1.54.264-3.04.76-4.434v-6.24H2.908A23.98 23.98 0 0 0 .48 24c0 3.88.926 7.55 2.428 10.674l8.002-6.24z"/>
                        <path fill="#EA4335" d="M24.48 9.578c3.556 0 6.74 1.222 9.25 3.624l6.938-6.938C36.454 2.378 30.994.002 24.48.002 15.15.002 6.884 5.188 2.908 13.326l8.002 6.24c1.916-5.728 7.26-9.988 13.57-9.988z"/>
                      </svg>
                      Verified Google Review
                    </p>
                  </div>
                </div>

                {/* Counter */}
                <span
                  className="text-xs font-bold tabular-nums px-3 py-1 rounded-full"
                  style={{ background: `${r.color}14`, color: r.color }}
                >
                  {current + 1} / {total}
                </span>
              </div>
            </div>
          </div>

          {/* Arrow buttons */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:-translate-x-7"
            style={{ background: "hsl(36,50%,99%)", border: "1px solid hsl(38,18%,88%)" }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-[hsl(20,20%,38%)]" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:translate-x-7"
            style={{ background: "hsl(36,50%,99%)", border: "1px solid hsl(38,18%,88%)" }}
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-[hsl(20,20%,38%)]" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-7">
          {reviews.map((rv, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              aria-label={`Review ${i + 1}`}
              className="rounded-full transition-all duration-400"
              style={{
                height: "6px",
                width: i === current ? "28px" : "6px",
                background: i === current ? reviews[i].color : "hsl(38,20%,80%)",
              }}
            />
          ))}
        </div>

        {/* Google CTA */}
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/search/Feel+and+Heal+Yoga+Kharghar+Navi+Mumbai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
            style={{ color: "hsl(38,80%,45%)" }}
          >
            ⭐⭐⭐⭐⭐ 5.0 on Google · See all reviews
          </a>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(${enterFrom}); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(${exitTo}); }
        }
      `}</style>
    </section>
  );
};

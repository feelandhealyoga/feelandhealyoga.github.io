import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   CENTRALISED PRICING CONFIG — single source of truth.
   Change any value here and every displayed price, saving, total, and CTA
   across the entire section will update automatically.
───────────────────────────────────────────────────────────────────────────── */
const PC = {
  offline: {
    individual: {
      one:   { monthly: 2499 },
      three: { monthly: 2000, regularTotal: 7500  },  // Save ₹1,500 · 20%
      six:   { monthly: 1850, regularTotal: 15000 },  // Save ₹3,900
    },
    couple: {
      three: { monthly: 1850, regularTotal: 12000 },  // vs individual 3-month
      six:   { monthly: 1750, regularTotal: 21000 },
    },
    family: {
      three: { monthly: 1800, regularTotal: null },
      six:   { monthly: 1700, regularTotal: null },
    },
  },
  online: {
    individual: {
      one:   { monthly: 1999 },
      three: { monthly: 1500, regularTotal: 5997  },  // Save ₹1,497 ≈ ₹1,499
      six:   { monthly: 1350, regularTotal: 11994 },  // Save ₹2,894 ≈ ₹2,899
    },
    couple: {
      three: { monthly: 1350, regularTotal: 9000  },
      six:   { monthly: 1250, regularTotal: 15000 },
    },
    family: {
      three: { monthly: 1250, regularTotal: null },
      six:   { monthly: 1200, regularTotal: null },
    },
  },
} as const;

/* ── derived helpers ── */
const total  = (monthly: number, months: number) => monthly * months;
const saveFromTotals = (regularTotal: number, monthly: number, months: number) =>
  regularTotal - total(monthly, months);
const savePctFromTotals = (regularTotal: number, monthly: number, months: number) =>
  Math.round((saveFromTotals(regularTotal, monthly, months) / regularTotal) * 100);
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const waLink = (text: string) =>
  `https://wa.me/919920155875?text=${encodeURIComponent(text)}`;

type Mode   = "offline" | "online";
type PType  = "individual" | "couple" | "family";
type FamCount = 3 | 4 | 5;

/* ── analytics helper ── */
const track = (event: string, params?: Record<string, string>) => {
  try {
    (window as any).gtag?.("event", event, { event_category: "pricing", ...params });
  } catch {}
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export const ScheduleSection = () => {
  const [mode,      setMode]      = useState<Mode>("offline");
  const [ptype,     setPtype]     = useState<PType>("individual");
  const [famCount,  setFamCount]  = useState<FamCount>(3);
  const [mainTab,   setMainTab]   = useState<"group" | "oneone">("group");
  const [highlight, setHighlight] = useState<"one" | "three" | "six">("three");
  const [stickyVis, setStickyVis] = useState(false);
  const sectionRef  = useRef<HTMLElement>(null);

  /* Sticky CTA visibility */
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setStickyVis(e.isIntersecting),
      { rootMargin: "-60px 0px -60px 0px" }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  /* Track section view once */
  useEffect(() => { track("pricing_section_viewed"); }, []);

  const openModal = () => window.dispatchEvent(new CustomEvent("open-yogi-trial"));

  const p = PC[mode];

  /* ── Sticky 3-month price for bottom bar ── */
  const stickyPrice = ptype === "individual"
    ? p.individual.three.monthly
    : ptype === "couple"
      ? p.couple.three.monthly
      : p.family.three.monthly;

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="py-24 px-4 section-saffron yogic-pattern"
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <div className="yogic-label mb-3">Class Schedule &amp; Pricing</div>
          <h2 className="yogic-section-heading section-title-decor mb-3">
            Find Your Perfect Batch
          </h2>
          <p className="yogic-section-subheading mt-4">
            Choose the format that suits your lifestyle — personalised one-on-one sessions or vibrant group classes.
          </p>
        </div>

        {/* ── Main Tab: Group | 1-on-1 ── */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {[
            { id: "group"  as const, label: "👥 Group Classes" },
            { id: "oneone" as const, label: "🧘 1-on-1"        },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-250 border flex-shrink-0",
                mainTab === t.id
                  ? "border-transparent shadow-lg text-white"
                  : "bg-white/70 border-[hsl(38,25%,82%)] text-[hsl(20,18%,38%)] hover:bg-white"
              )}
              style={mainTab === t.id ? {
                background: "linear-gradient(135deg,hsl(145,38%,35%),hsl(160,40%,44%))",
                boxShadow: "0 4px 16px hsla(145,38%,35%,0.35)",
              } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            ONE-ON-ONE TAB
        ══════════════════════════════════════════════════════════════ */}
        {mainTab === "oneone" && <OneOnOneSection />}

        {/* ══════════════════════════════════════════════════════════════
            GROUP TAB — Pricing
        ══════════════════════════════════════════════════════════════ */}
        {mainTab === "group" && (
          <>
            {/* ── Schedule strips ── */}
            <GroupScheduleStrips openModal={openModal} />

            {/* ═══ PRICING ═══ */}
            <div className="mt-16">

              {/* Pricing section header */}
              <div className="text-center mb-8">
                <div className="yogic-label mb-2">Membership Plans</div>
                <h3 className="text-2xl font-bold text-[hsl(20,20%,14%)] mb-2"
                  style={{ fontFamily: "'Playfair Display',serif" }}>
                  Choose the Commitment That Works for You
                </h3>
                <p className="text-sm text-[hsl(20,14%,44%)] max-w-md mx-auto leading-relaxed">
                  Not sure where to start? We recommend{" "}
                  <span className="font-bold text-[hsl(145,38%,38%)]">3 months</span>{" "}
                  to give yourself enough time to build consistency.
                </p>
              </div>

              {/* ── Mode toggle: Online | Offline ── */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-full border border-[hsl(38,25%,84%)] p-1 bg-white shadow-sm">
                  {(["offline","online"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); track("mode_selected", { mode: m }); }}
                      className={cn(
                        "px-5 py-2 rounded-full text-sm font-bold transition-all duration-200",
                        mode === m ? "text-white shadow" : "text-[hsl(20,18%,48%)] hover:text-[hsl(20,18%,22%)]"
                      )}
                      style={mode === m ? {
                        background: "linear-gradient(135deg,hsl(145,40%,32%),hsl(160,42%,42%))",
                        boxShadow: "0 3px 12px hsla(145,40%,32%,0.30)",
                      } : {}}
                    >
                      {m === "offline" ? "🏠 Offline" : "🌐 Online"}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Plan type: Individual | Couple | Family ── */}
              <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {(["individual","couple","family"] as PType[]).map((pt) => (
                  <button
                    key={pt}
                    onClick={() => { setPtype(pt); track("plan_type_selected", { plan_type: pt }); }}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border",
                      ptype === pt
                        ? "border-transparent text-white shadow"
                        : "bg-white border-[hsl(38,22%,86%)] text-[hsl(20,18%,44%)] hover:bg-[hsl(38,30%,96%)]"
                    )}
                    style={ptype === pt ? {
                      background: "linear-gradient(135deg,hsl(38,88%,50%),hsl(30,85%,44%))",
                      boxShadow: "0 3px 12px hsla(38,88%,50%,0.32)",
                    } : {}}
                  >
                    {pt === "individual" ? "👤 Individual" : pt === "couple" ? "👫 Couple" : "👨‍👩‍👧 Family"}
                  </button>
                ))}
              </div>

              {/* ── Family member selector ── */}
              {ptype === "family" && (
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  <span className="text-xs text-[hsl(20,14%,50%)] self-center font-medium">Family members:</span>
                  {([3,4,5] as FamCount[]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setFamCount(n)}
                      className={cn(
                        "w-9 h-9 rounded-full text-sm font-bold border transition-all",
                        famCount === n
                          ? "border-transparent text-white bg-[hsl(145,38%,38%)]"
                          : "bg-white border-[hsl(38,22%,86%)] text-[hsl(20,18%,44%)]"
                      )}
                    >
                      {n}{n===5 ? "+" : ""}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Recommendation box ── */}
              <RecommendationBox mode={mode} ptype={ptype} onSelect={() => setHighlight("three")} />

              {/* ── Pricing Cards ── */}
              {ptype === "individual" && (
                <IndividualCards
                  mode={mode}
                  highlight={highlight}
                  setHighlight={setHighlight}
                  openModal={openModal}
                />
              )}
              {ptype === "couple" && (
                <CoupleCards mode={mode} openModal={openModal} />
              )}
              {ptype === "family" && (
                <FamilyCards mode={mode} famCount={famCount} openModal={openModal} />
              )}

              {/* ── Why 3 Months ── */}
              {ptype === "individual" && <WhyThreeMonths />}

              {/* ── Free Trial CTA ── */}
              <FreeTrial openModal={openModal} />

            </div>
          </>
        )}
      </div>

      {/* ── Sticky Mobile Bottom Bar ── */}
      <StickyBar visible={stickyVis} mode={mode} price={stickyPrice} ptype={ptype} openModal={openModal} />
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   GROUP SCHEDULE STRIPS
───────────────────────────────────────────────────────────────────────────── */
const GROUP_SLOTS = [
  { time: "6:00 – 7:00 AM",  days: "Mon – Fri", womenOnly: false },
  { time: "8:00 – 9:00 AM",  days: "Mon – Fri", womenOnly: false },
  { time: "7:30 – 8:30 PM",  days: "Mon – Fri", womenOnly: false },
];

const GroupScheduleStrips = ({ openModal }: { openModal: () => void }) => (
  <div>
    <p className="text-center text-sm text-[hsl(20,15%,44%)] italic mb-6">
      Group sessions available Online &amp; Offline in Kharghar. Suitable for all levels.
    </p>
    <div className="flex items-center gap-3 mb-3 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "hsl(38,70%,93%)", color: "hsl(30,50%,38%)" }}>🌅 Adults</span>
      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "hsl(340,60%,94%)", color: "hsl(340,50%,42%)" }}>👩 Women's Only (10–11 AM)</span>
    </div>
    <div className="space-y-3">
      {GROUP_SLOTS.map((slot, i) => (
        <div key={i}
          className="bg-[hsl(36,50%,99%)] border rounded-2xl px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250"
          style={{ borderColor: "hsl(38,25%,90%)" }}
        >
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2.5 rounded-xl flex-shrink-0" style={{ background: "linear-gradient(135deg,hsl(38,90%,52%),hsl(30,85%,48%))", minWidth: 110 }}>
              <p className="text-white font-bold text-xs leading-tight">{slot.time}</p>
            </div>
            <div>
              <p className="font-bold text-[hsl(20,20%,18%)] text-sm mb-1">{slot.days}</p>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-[hsl(145,38%,40%)] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(145,38%,45%)] inline-block" />Online
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[hsl(200,60%,40%)] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(200,60%,45%)] inline-block" />Offline
                </span>
              </div>
            </div>
          </div>
          <button onClick={openModal}
            className="w-full sm:w-auto flex-shrink-0 text-center text-sm font-bold px-6 py-2.5 rounded-full border-0 cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 text-white"
            style={{ background: "linear-gradient(135deg,hsl(145,38%,35%),hsl(160,40%,44%))", boxShadow: "0 4px 12px hsla(145,38%,35%,0.3)" }}
          >
            📅 Book This Slot
          </button>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   INDIVIDUAL PRICING CARDS
───────────────────────────────────────────────────────────────────────────── */
const IndividualCards = ({
  mode, highlight, setHighlight, openModal
}: {
  mode: Mode;
  highlight: "one" | "three" | "six";
  setHighlight: (v: "one" | "three" | "six") => void;
  openModal: () => void;
}) => {
  const p = PC[mode].individual;
  const waSuffix = mode === "offline" ? "Offline" : "Online";

  const cards = [
    {
      key: "one" as const,
      label: "Flexible Start",
      months: 1,
      monthly: p.one.monthly,
      regularTotal: null as number | null,
      badge: null as string | null,
      description: "Try yoga for a month with complete flexibility.",
      cta: "Start for 1 Month",
      featured: false,
    },
    {
      key: "three" as const,
      label: "Most Popular",
      months: 3,
      monthly: p.three.monthly,
      regularTotal: p.three.regularTotal,
      badge: "⭐ MOST POPULAR",
      description: "Give your body enough time to build a real routine.",
      subtext: "3 months gives you time to learn, stay consistent and experience meaningful progress.",
      cta: "Start My 3-Month Journey",
      featured: true,
    },
    {
      key: "six" as const,
      label: "Best for Long-Term Practice",
      months: 6,
      monthly: p.six.monthly,
      regularTotal: p.six.regularTotal,
      badge: null,
      description: "The deepest commitment to your long-term wellness.",
      cta: "Commit for 6 Months",
      featured: false,
    },
  ];

  // Reorder for mobile: 3-month first
  const mobileOrder = ["three", "one", "six"];

  // 3-month saves (monthly rate difference)
  const threeMonthSave = p.one.monthly - p.three.monthly;

  return (
    <>
      {/* Comparison hint */}
      <div className="mb-5 text-center text-xs text-[hsl(20,14%,52%)]">
        <span className="font-semibold text-[hsl(145,38%,38%)]">
          Save {fmt(threeMonthSave)}/month
        </span>{" "}
        by choosing 3 months instead of 1 month
      </div>

      {/* Desktop: 3-col grid, mobile: single col ordered 3→1→6 */}
      <div className="hidden md:grid md:grid-cols-3 gap-5 items-end">
        {cards.map((card) => (
          <IndCard key={card.key} card={card} highlight={highlight} setHighlight={setHighlight} mode={mode} openModal={openModal} />
        ))}
      </div>
      <div className="md:hidden flex flex-col gap-4">
        {mobileOrder.map((key) => {
          const card = cards.find(c => c.key === key)!;
          return <IndCard key={card.key} card={card} highlight={highlight} setHighlight={setHighlight} mode={mode} openModal={openModal} />;
        })}
      </div>
    </>
  );
};

const IndCard = ({
  card, highlight, setHighlight, mode, openModal
}: {
  card: any;
  highlight: string;
  setHighlight: (v: any) => void;
  mode: Mode;
  openModal: () => void;
}) => {
  const isFeatured = card.featured;
  const isActive = highlight === card.key;
  const savings = card.regularTotal ? saveFromTotals(card.regularTotal, card.monthly, card.months) : 0;
  const pct     = card.regularTotal ? savePctFromTotals(card.regularTotal, card.monthly, card.months) : 0;
  const waSuffix = mode === "offline" ? "Offline" : "Online";

  return (
    <div
      onClick={() => { setHighlight(card.key); track(`plan_${card.key}_selected`, { mode }); }}
      className={cn(
        "relative rounded-2xl flex flex-col cursor-pointer transition-all duration-300",
        isFeatured
          ? "pt-6 pb-0 px-0 shadow-2xl ring-2 ring-[hsl(145,38%,52%)] scale-[1.06] md:scale-[1.07]"
          : "pb-0 shadow-md ring-1 ring-[hsl(38,22%,88%)]",
        isActive && !isFeatured && "ring-[hsl(145,38%,52%)] ring-2"
      )}
      style={{
        background: isFeatured
          ? "linear-gradient(160deg,hsl(145,22%,98%),hsl(40,30%,99%))"
          : "hsl(36,50%,99%)",
      }}
    >
      {/* Most Popular badge */}
      {card.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
          <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white"
            style={{ background: "linear-gradient(135deg,hsl(38,88%,50%),hsl(28,85%,44%))", boxShadow: "0 3px 12px hsla(38,88%,50%,0.5)" }}>
            {card.badge}
          </span>
        </div>
      )}

      <div className={cn("p-6 flex flex-col gap-3 flex-1", isFeatured && "pt-4")}>
        {/* Label row */}
        <div className="flex items-start justify-between gap-2">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            isFeatured ? "text-[hsl(145,44%,34%)]" : "text-[hsl(20,14%,50%)]"
          )}>
            {card.label}
          </span>
          {isFeatured && (
            <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
              style={{ background: "hsl(145,30%,92%)", color: "hsl(145,44%,34%)" }}>
              Recommended
            </span>
          )}
        </div>

        {/* Price */}
        <div>
          <div className="flex items-end gap-1">
            <span className={cn("font-black leading-none",
              isFeatured ? "text-4xl text-[hsl(20,20%,12%)]" : "text-3xl text-[hsl(20,20%,18%)]")}>
              {fmt(card.monthly)}
            </span>
            <span className="text-xs text-[hsl(20,12%,52%)] mb-1.5 font-medium">/month</span>
          </div>
          <p className="text-xs text-[hsl(20,12%,52%)] mt-1">
            Total: <span className="font-semibold text-[hsl(20,18%,30%)]">{fmt(total(card.monthly, card.months))}</span>
            {" "}for {card.months} month{card.months > 1 ? "s" : ""}
          </p>
          {card.regularTotal && (
            <p className="text-xs mt-0.5">
              <span className="line-through text-[hsl(20,12%,62%)]">{fmt(card.regularTotal)}</span>
              {" "}
              <span className="font-bold text-[hsl(145,44%,38%)]">
                Save {fmt(savings)} ({pct}% off)
              </span>
            </p>
          )}
        </div>

        {/* Description */}
        <p className={cn("text-sm leading-relaxed", isFeatured ? "text-[hsl(20,18%,28%)] font-medium" : "text-[hsl(20,14%,44%)]")}>
          {card.description}
        </p>
        {card.subtext && (
          <p className="text-xs text-[hsl(20,12%,54%)] italic leading-relaxed">{card.subtext}</p>
        )}
      </div>

      {/* CTA */}
      <div className={cn("px-6 pb-6", isFeatured && "px-6 pb-6")}>
        <a
          href={waLink(`Hi Team Feel & Heal Yoga! 🙏 I'd like to enroll in the ${card.months}-Month ${waSuffix} plan (${fmt(card.monthly)}/month, Total: ${fmt(total(card.monthly, card.months))}). Can you help me get started?`)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => { track(`cta_${card.key}_clicked`, { mode }); }}
          className={cn(
            "block w-full text-center text-sm font-bold py-3 rounded-xl no-underline transition-all hover:opacity-90 hover:-translate-y-0.5",
            isFeatured ? "text-white" : "border text-[hsl(145,38%,38%)] hover:bg-[hsl(145,20%,95%)]"
          )}
          style={isFeatured ? {
            background: "linear-gradient(135deg,hsl(145,44%,34%),hsl(160,42%,44%))",
            boxShadow: "0 4px 18px hsla(145,44%,34%,0.38)",
          } : {
            borderColor: "hsl(145,28%,76%)",
            background: "transparent",
          }}
        >
          {card.cta}
        </a>
      </div>

      {/* Top accent bar for featured */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: "linear-gradient(90deg,hsl(145,44%,38%),hsl(160,42%,52%))" }} />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   COUPLE PRICING CARDS
───────────────────────────────────────────────────────────────────────────── */
const CoupleCards = ({ mode, openModal }: { mode: Mode; openModal: () => void }) => {
  const p = PC[mode].couple;
  const waSuffix = mode === "offline" ? "Offline" : "Online";
  const individualRef = PC[mode].individual;

  return (
    <div>
      <div className="text-center mb-6 p-4 rounded-2xl" style={{ background: "hsl(145,22%,95%)" }}>
        <p className="text-sm font-bold text-[hsl(145,38%,30%)] mb-1">💕 Better Together</p>
        <p className="text-xs text-[hsl(20,14%,48%)] leading-relaxed max-w-sm mx-auto">
          Join with your partner and save more while keeping each other consistent.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {([
          { months: 3 as const, label: "⭐ Recommended — 3 Months", featured: true, data: p.three, indRef: individualRef.three },
          { months: 6 as const, label: "Best for Long-Term Practice — 6 Months", featured: false, data: p.six, indRef: individualRef.six },
        ]).map(({ months, label, featured, data, indRef }) => {
          const coupleTotal = total(data.monthly, months) * 2;
          const perPersonSave = (indRef.monthly - data.monthly) * months;

          return (
            <div key={months}
              className={cn(
                "rounded-2xl p-6 flex flex-col gap-4 transition-all",
                featured
                  ? "shadow-xl ring-2 ring-[hsl(145,38%,52%)]"
                  : "shadow-md ring-1 ring-[hsl(38,22%,88%)]"
              )}
              style={{ background: featured ? "hsl(145,22%,98%)" : "hsl(36,50%,99%)" }}
            >
              {featured && (
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg,hsl(38,88%,50%),hsl(28,85%,44%))" }}>
                    ⭐ RECOMMENDED
                  </span>
                </div>
              )}
              <p className="text-xs font-bold uppercase tracking-wide text-[hsl(20,14%,44%)]">{label}</p>
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-[hsl(20,20%,14%)]">{fmt(data.monthly)}</span>
                  <span className="text-xs text-[hsl(20,12%,52%)] mb-1.5">/person/month</span>
                </div>
                <p className="text-xs text-[hsl(20,12%,52%)] mt-1">
                  {fmt(total(data.monthly, months))} per person · <span className="font-bold text-[hsl(20,18%,22%)]">Couple total: {fmt(coupleTotal)}</span>
                </p>
                {perPersonSave > 0 && (
                  <p className="text-xs mt-0.5 font-semibold text-[hsl(145,44%,38%)]">
                    Save {fmt(perPersonSave)} per person vs individual plan ✓
                  </p>
                )}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-[hsl(38,68%,40%)] flex items-center gap-1.5">
                <span>✦ Extra Couple Savings</span>
              </div>
              <a
                href={waLink(`Hi Team Feel & Heal Yoga! 🙏 We're a couple interested in the ${months}-Month ${waSuffix} Couple plan (${fmt(data.monthly)}/person/month, Total: ${fmt(coupleTotal)} for both). Can you help us get started?`)}
                target="_blank" rel="noopener noreferrer"
                onClick={() => track("couple_cta_clicked", { mode, months: String(months) })}
                className={cn(
                  "block text-center text-sm font-bold py-3 rounded-xl no-underline transition-all hover:opacity-90",
                  featured ? "text-white" : "text-[hsl(145,38%,38%)] border border-[hsl(145,28%,76%)]"
                )}
                style={featured ? { background: "linear-gradient(135deg,hsl(145,44%,34%),hsl(160,42%,44%))", boxShadow: "0 4px 16px hsla(145,44%,34%,0.35)" } : {}}
              >
                {featured ? "Start Our 3-Month Journey 💕" : "Commit for 6 Months"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FAMILY PRICING CARDS
───────────────────────────────────────────────────────────────────────────── */
const FamilyCards = ({ mode, famCount, openModal }: { mode: Mode; famCount: FamCount; openModal: () => void }) => {
  const p = PC[mode].family;
  const waSuffix = mode === "offline" ? "Offline" : "Online";

  return (
    <div>
      <div className="text-center mb-6 p-4 rounded-2xl" style={{ background: "hsl(38,65%,95%)" }}>
        <p className="text-sm font-bold text-[hsl(38,60%,30%)] mb-1">🏡 Family Wellness Plan</p>
        <p className="text-xs text-[hsl(20,14%,48%)] leading-relaxed max-w-sm mx-auto">
          Practice together, stay accountable together and make wellness part of your family's routine.
        </p>
        <p className="text-[10px] text-[hsl(20,12%,56%)] mt-2">Price shown per person · Total calculated for {famCount} members</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {([
          { months: 3 as const, label: "⭐ Recommended — 3 Months", featured: true, data: p.three },
          { months: 6 as const, label: "Best for Long-Term Practice — 6 Months", featured: false, data: p.six },
        ]).map(({ months, label, featured, data }) => {
          const famTotal = total(data.monthly, months) * famCount;

          return (
            <div key={months}
              className={cn(
                "rounded-2xl p-6 flex flex-col gap-4 transition-all",
                featured
                  ? "shadow-xl ring-2 ring-[hsl(145,38%,52%)]"
                  : "shadow-md ring-1 ring-[hsl(38,22%,88%)]"
              )}
              style={{ background: featured ? "hsl(145,22%,98%)" : "hsl(36,50%,99%)" }}
            >
              {featured && (
                <div className="text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg,hsl(38,88%,50%),hsl(28,85%,44%))" }}>
                    ⭐ RECOMMENDED
                  </span>
                </div>
              )}
              <p className="text-xs font-bold uppercase tracking-wide text-[hsl(20,14%,44%)]">{label}</p>
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-[hsl(20,20%,14%)]">{fmt(data.monthly)}</span>
                  <span className="text-xs text-[hsl(20,12%,52%)] mb-1.5">/person/month</span>
                </div>
                <p className="text-xs text-[hsl(20,12%,52%)] mt-1">
                  {fmt(total(data.monthly, months))} per person ·{" "}
                  <span className="font-bold text-[hsl(20,18%,22%)]">
                    Family total ({famCount}{famCount===5 ? "+" : ""}): {fmt(famTotal)}
                  </span>
                </p>
              </div>
              <a
                href={waLink(`Hi Team Feel & Heal Yoga! 🙏 We're a family of ${famCount} interested in the ${months}-Month ${waSuffix} Family plan (${fmt(data.monthly)}/person/month, Total: ${fmt(famTotal)} for ${famCount} members). Can you help us?`)}
                target="_blank" rel="noopener noreferrer"
                onClick={() => track("family_cta_clicked", { mode, months: String(months), fam: String(famCount) })}
                className={cn(
                  "block text-center text-sm font-bold py-3 rounded-xl no-underline transition-all hover:opacity-90",
                  featured ? "text-white" : "text-[hsl(145,38%,38%)] border border-[hsl(145,28%,76%)]"
                )}
                style={featured ? { background: "linear-gradient(135deg,hsl(145,44%,34%),hsl(160,42%,44%))", boxShadow: "0 4px 16px hsla(145,44%,34%,0.35)" } : {}}
              >
                {featured ? "Start Our Family Plan 🏡" : "Commit for 6 Months"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   RECOMMENDATION BOX
───────────────────────────────────────────────────────────────────────────── */
const RecommendationBox = ({ mode, ptype, onSelect }: { mode: Mode; ptype: PType; onSelect: () => void }) => {
  const monthly = ptype === "individual"
    ? PC[mode].individual.three.monthly
    : ptype === "couple"
      ? PC[mode].couple.three.monthly
      : PC[mode].family.three.monthly;

  return (
    <div className="mb-8 rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center gap-4"
      style={{ background: "hsl(145,20%,97%)", borderColor: "hsl(145,28%,84%)" }}>
      <div className="flex-1">
        <p className="font-bold text-sm text-[hsl(145,44%,28%)] mb-1">🌿 Not sure which plan to choose?</p>
        <p className="text-xs text-[hsl(20,14%,44%)] leading-relaxed">
          <strong>Start with 3 Months.</strong> One month can be useful for trying the classes, while six months requires a bigger commitment. Three months provides a practical middle ground between{" "}
          <span className="font-semibold text-[hsl(145,38%,36%)]">flexibility, savings and consistency.</span>
        </p>
      </div>
      <button
        onClick={() => { onSelect(); track("recommendation_box_clicked", { mode }); }}
        className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90 hover:-translate-y-0.5 whitespace-nowrap"
        style={{ background: "linear-gradient(135deg,hsl(145,44%,34%),hsl(160,42%,44%))", boxShadow: "0 4px 14px hsla(145,44%,34%,0.30)" }}
      >
        Choose 3 Months →
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   WHY 3 MONTHS
───────────────────────────────────────────────────────────────────────────── */
const WhyThreeMonths = () => (
  <div className="mt-10 rounded-2xl p-6"
    style={{ background: "linear-gradient(135deg,hsl(145,22%,96%),hsl(40,30%,98%))", border: "1px solid hsl(145,24%,88%)" }}>
    <p className="font-bold text-sm text-[hsl(145,44%,28%)] mb-4">🌿 Why we recommend 3 months</p>
    <div className="grid sm:grid-cols-2 gap-2 mb-4">
      {[
        "Enough time to build a consistent yoga routine",
        "More economical than paying month-to-month",
        "Less commitment than a 6-month membership",
        "Better suited for tracking visible progress",
        "Helps turn practice into a sustainable habit",
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-[hsl(20,14%,40%)]">
          <span className="text-[hsl(145,44%,40%)] font-bold flex-shrink-0 mt-0.5">✓</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
    <p className="text-xs text-center italic text-[hsl(20,12%,50%)]">
      Start small enough to feel comfortable. Stay long enough to see progress.
    </p>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FREE TRIAL CTA
───────────────────────────────────────────────────────────────────────────── */
const FreeTrial = ({ openModal }: { openModal: () => void }) => (
  <div className="mt-10 rounded-2xl p-7 text-center"
    style={{ background: "linear-gradient(135deg,hsl(145,38%,30%),hsl(160,42%,40%))" }}>
    <p className="text-xs tracking-widest uppercase text-white/60 mb-2 font-bold">Still unsure?</p>
    <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
      Experience Feel &amp; Heal Yoga First
    </h4>
    <p className="text-sm text-white/70 mb-5 leading-relaxed">
      No pressure. Experience the class and then choose the plan that works for you.
    </p>
    <button
      onClick={() => { openModal(); track("free_trial_clicked"); }}
      className="inline-flex items-center gap-2 text-sm font-black px-8 py-3.5 rounded-full transition-all hover:opacity-90 hover:-translate-y-0.5 text-[hsl(20,20%,12%)]"
      style={{
        background: "linear-gradient(135deg,hsl(38,90%,54%),hsl(30,86%,48%))",
        boxShadow: "0 5px 22px hsla(38,90%,52%,0.55)",
      }}
    >
      🌿 Book a FREE Trial Class
    </button>
    <p className="text-[11px] text-white/45 mt-3">No commitment · No payment required</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   STICKY MOBILE BOTTOM BAR
───────────────────────────────────────────────────────────────────────────── */
const StickyBar = ({
  visible, mode, price, ptype, openModal
}: {
  visible: boolean; mode: Mode; price: number; ptype: PType; openModal: () => void;
}) => {
  const label = ptype === "family" ? "Family Plan" : ptype === "couple" ? "Couple Plan" : "3 Months";

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "linear-gradient(135deg,hsl(145,38%,28%),hsl(160,42%,38%))",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.22)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div>
          <p className="text-[10px] text-white/60 uppercase tracking-wide font-bold">{label}</p>
          <p className="text-white font-black text-base leading-tight">
            {fmt(price)}<span className="text-white/60 text-xs font-medium">/month</span>
          </p>
        </div>
        <button
          onClick={() => { track("sticky_cta_clicked", { mode }); openModal(); }}
          className="text-sm font-black px-5 py-2.5 rounded-full transition-all active:scale-95 text-[hsl(20,20%,12%)]"
          style={{ background: "linear-gradient(135deg,hsl(38,90%,54%),hsl(30,86%,48%))", boxShadow: "0 3px 14px hsla(38,90%,52%,0.45)" }}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ONE-ON-ONE SECTION
───────────────────────────────────────────────────────────────────────────── */
const ONE_ON_ONE_PROGRAMS = [
  {
    icon: "🤰", title: "Pregnancy Yoga", subtitle: "Pre & Post Natal",
    desc: "Gentle, safe yoga tailored for expectant and new mothers. Focuses on breathing, pelvic strength, and stress relief through every trimester.",
    tag: "Special Program", tagColor: "hsl(340,45%,55%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in Pregnancy Yoga. Can you share more details?",
  },
  {
    icon: "🔥", title: "Weight Loss Yoga", subtitle: "Fat Burn & Body Toning",
    desc: "Dynamic yoga sequences combined with breathing techniques designed to burn fat, tone the body, and build a healthy metabolism.",
    tag: "Weight Management", tagColor: "hsl(25,80%,48%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in Weight Loss Yoga. Can you share more details?",
  },
  {
    icon: "🌿", title: "Therapy Yoga", subtitle: "Any Health Concern",
    desc: "Personalised therapeutic yoga for PCOD, thyroid, diabetes, back pain, hormonal imbalance, or any chronic condition. Fully customised and safe.",
    tag: "Health & Healing", tagColor: "hsl(145,38%,38%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in Therapy Yoga. Can you share more details?",
  },
  {
    icon: "🏃‍♂️", title: "General Fitness Yoga", subtitle: "Strength & Flexibility",
    desc: "Build stamina, improve posture, enhance flexibility and core strength. Ideal for professionals, beginners, and anyone seeking an active lifestyle.",
    tag: "Fitness", tagColor: "hsl(200,55%,44%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in General Fitness Yoga. Can you share more details?",
  },
];

const OneOnOneSection = () => (
  <div>
    <p className="text-center text-sm text-[hsl(20,15%,44%)] italic mb-8">
      Completely personalised sessions with <strong>Team Feel &amp; Heal Yoga</strong> — timing is flexible &amp; set by mutual convenience.
    </p>
    <div className="grid sm:grid-cols-2 gap-5">
      {ONE_ON_ONE_PROGRAMS.map((prog, i) => (
        <div key={i}
          className="bg-[hsl(36,50%,99%)] rounded-2xl border border-[hsl(38,25%,90%)] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="h-1 flex-shrink-0" style={{ background: prog.tagColor }} />
          <div className="p-6 flex flex-col flex-1">
            <span className="inline-block self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
              style={{ background: `${prog.tagColor}1a`, color: prog.tagColor }}>
              {prog.tag}
            </span>
            <div className="text-4xl mb-3">{prog.icon}</div>
            <h3 className="text-lg font-bold text-[hsl(20,20%,18%)] mb-0.5" style={{ fontFamily: "'Playfair Display',serif" }}>
              {prog.title}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(30,15%,50%)] mb-3">{prog.subtitle}</p>
            <p className="text-sm text-[hsl(20,12%,42%)] leading-relaxed flex-1 mb-5">{prog.desc}</p>
            <a href={`https://wa.me/919920155875?text=${encodeURIComponent(prog.waMsg)}`}
              target="_blank" rel="noopener noreferrer"
              onClick={() => track("oneone_cta_clicked", { program: prog.title })}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold no-underline transition-all hover:opacity-90 text-white"
              style={{ background: prog.tagColor, boxShadow: `0 4px 14px ${prog.tagColor}40` }}>
              💬 Contact Teacher
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

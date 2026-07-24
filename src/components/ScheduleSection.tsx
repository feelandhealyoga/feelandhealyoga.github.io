import { useState } from "react";
import { cn } from "@/lib/utils";

const WA = "919920155875";
const waLink = (text: string) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

/* ── One-on-One programs — 4 separate cards ── */
const oneOnOnePrograms = [
  {
    icon: "🤰",
    title: "Pregnancy Yoga",
    subtitle: "Pre & Post Natal",
    desc: "Gentle, safe yoga tailored for expectant and new mothers. Focuses on breathing, pelvic strength, and stress relief through every trimester.",
    tag: "Special Program",
    tagColor: "hsl(340,45%,55%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in Pregnancy Yoga. Can you share more details?",
  },
  {
    icon: "🔥",
    title: "Weight Loss Yoga",
    subtitle: "Fat Burn & Body Toning",
    desc: "Dynamic yoga sequences combined with breathing techniques specifically designed to burn fat, tone the body, reduce bloating and build a healthy metabolism.",
    tag: "Weight Management",
    tagColor: "hsl(25,80%,48%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in the Weight Loss Yoga program. Can you share more details?",
  },
  {
    icon: "🌿",
    title: "Therapy Yoga",
    subtitle: "Any Health Concern",
    desc: "Personalised therapeutic yoga for PCOD, thyroid, diabetes, back pain, hormonal imbalance, or any chronic health condition. Fully customised and safe.",
    tag: "Health & Healing",
    tagColor: "hsl(145,38%,38%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in Therapy Yoga for a health concern. Can you share more details?",
  },
  {
    icon: "🏃‍♂️",
    title: "General Fitness Yoga",
    subtitle: "Strength & Flexibility",
    desc: "Build stamina, improve posture, enhance flexibility and core strength. Ideal for professionals, beginners, and anyone seeking an active balanced lifestyle.",
    tag: "Fitness",
    tagColor: "hsl(200,55%,44%)",
    waMsg: "Hi Team Feel & Heal Yoga! 🙏 I'm interested in General Fitness Yoga. Can you share more details?",
  },
];

/* ── Group slots — Adults + Kids in one list ── */
interface Slot { time: string; days: string; group: "adult" | "kids"; womenOnly?: boolean; }

const groupSlots: Slot[] = [
  { time: "6:00 – 7:00 AM",   days: "Mon – Fri", group: "adult" },
  { time: "8:00 – 9:00 AM",   days: "Mon – Fri", group: "adult" },
  { time: "10:00 – 11:00 AM", days: "Mon – Fri", group: "adult", womenOnly: true },
  { time: "7:30 – 8:30 PM",   days: "Mon – Fri", group: "adult" },
];

export const ScheduleSection = () => {
  const [mainTab, setMainTab] = useState<"oneone" | "group">("group");
  const openModal = () => window.dispatchEvent(new Event("open-trial-modal"));

  return (
    <section id="schedule" className="py-24 px-6 section-saffron yogic-pattern">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="yogic-label mb-3">Class Schedule</div>
          <h2 className="yogic-section-heading section-title-decor mb-3">
            Find Your Perfect Batch
          </h2>
          <p className="yogic-section-subheading mt-6">
            Choose the format that suits your lifestyle — personalised one-on-one sessions or vibrant group classes.
          </p>
        </div>

        {/* ── Main tabs ── */}
        <div className="flex justify-center gap-3 mb-10">
          {[
            { id: "group",  label: "👥 Group Classes" },
            { id: "oneone", label: "🧘 1 on 1" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id as "oneone" | "group")}
              className={cn(
                "px-7 py-3 rounded-full text-sm font-bold transition-all duration-250 border",
                mainTab === t.id
                  ? "border-transparent shadow-lg"
                  : "bg-white/70 border-[hsl(38,25%,82%)] text-[hsl(20,18%,38%)] hover:bg-white"
              )}
              style={
                mainTab === t.id
                  ? {
                      background: "linear-gradient(135deg, hsl(145,38%,35%), hsl(160,40%,44%))",
                      color: "white",
                      boxShadow: "0 4px 16px hsla(145,38%,35%,0.35)",
                    }
                  : {}
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════
            ONE ON ONE
            ══════════════════════════════ */}
        {mainTab === "oneone" && (
          <div>
            <p className="text-center text-sm text-[hsl(20,15%,44%)] italic mb-8">
              Completely personalised sessions with <strong>Team Feel &amp; Heal Yoga</strong> — timing is flexible &amp; set by mutual convenience.
            </p>

            {/* 2-col on md, 1-col on sm — 4 cards total */}
            <div className="grid sm:grid-cols-2 gap-5">
              {oneOnOnePrograms.map((prog, i) => (
                <div
                  key={i}
                  className="bg-[hsl(36,50%,99%)] rounded-2xl border border-[hsl(38,25%,90%)] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Accent bar */}
                  <div className="h-1 flex-shrink-0" style={{ background: prog.tagColor }} />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Tag badge */}
                    <span
                      className="inline-block self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
                      style={{ background: `${prog.tagColor}1a`, color: prog.tagColor }}
                    >
                      {prog.tag}
                    </span>

                    {/* Icon + heading */}
                    <div className="text-4xl mb-3">{prog.icon}</div>
                    <h3
                      className="text-lg font-bold text-[hsl(20,20%,18%)] mb-0.5"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {prog.title}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(30,15%,50%)] mb-3">
                      {prog.subtitle}
                    </p>
                    <p className="text-sm text-[hsl(20,12%,42%)] leading-relaxed flex-1 mb-5">
                      {prog.desc}
                    </p>

                    {/* Contact Teacher */}
                    <a
                      href={waLink(prog.waMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold no-underline transition-all hover:opacity-90 hover:-translate-y-0.5"
                      style={{
                        background: prog.tagColor,
                        color: "white",
                        boxShadow: `0 4px 14px ${prog.tagColor}40`,
                      }}
                    >
                      💬 Contact Teacher
                    </a>
                  </div>
                </div>
              ))}
            </div>


          </div>
        )}

        {/* ══════════════════════════════
            GROUP
            ══════════════════════════════ */}
        {mainTab === "group" && (
          <div>
            <p className="text-center text-sm text-[hsl(20,15%,44%)] italic mb-8">
              Group sessions are available Online &amp; Offline in Kharghar. Suitable for all levels.
            </p>

            <div className="space-y-3">
              {/* Single heading: Adults & Kids */}
              <div className="flex items-center gap-3 mb-1">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: "hsl(38,70%,93%)", color: "hsl(30,50%,38%)" }}
                >
                  🌅 Adults
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: "hsl(340,60%,94%)", color: "hsl(340,50%,42%)" }}
                >
                  👩 Women’s Only (10–11 AM)
                </span>
                <div className="flex-1 h-px bg-[hsl(38,25%,88%)]" />
              </div>

              {groupSlots.map((slot, i) => (
                <div
                  key={i}
                  className="bg-[hsl(36,50%,99%)] border rounded-2xl px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250"
                  style={{
                    borderColor: slot.womenOnly ? "hsl(340,45%,82%)" : "hsl(38,25%,90%)",
                    background: slot.womenOnly ? "hsl(340,55%,99%)" : "hsl(36,50%,99%)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="text-center px-4 py-2.5 rounded-xl flex-shrink-0"
                      style={{
                        background: slot.womenOnly
                          ? "linear-gradient(135deg, hsl(340,75%,68%), hsl(340,65%,58%))"
                          : "linear-gradient(135deg, hsl(38,90%,52%), hsl(30,85%,48%))",
                        minWidth: "110px",
                      }}
                    >
                      <p className="text-white font-bold text-xs leading-tight">{slot.time}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-[hsl(20,20%,18%)] text-sm">{slot.days}</p>
                        {slot.womenOnly && (
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                            style={{ background: "hsl(340,60%,94%)", color: "hsl(340,50%,42%)" }}
                          >
                            👩 Women’s Only
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-xs text-[hsl(145,38%,40%)] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(145,38%,45%)] inline-block" />
                          Online
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-[hsl(200,60%,40%)] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(200,60%,45%)] inline-block" />
                          Offline
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={openModal}
                    className="flex-shrink-0 text-center text-sm font-bold px-6 py-2.5 rounded-full border-0 cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                    style={{
                      background: slot.womenOnly
                        ? "linear-gradient(135deg, hsl(340,65%,55%), hsl(340,55%,48%))"
                        : "linear-gradient(135deg, hsl(145,38%,35%), hsl(160,40%,44%))",
                      color: "white",
                      boxShadow: slot.womenOnly
                        ? "0 4px 12px hsla(340,65%,55%,0.3)"
                        : "0 4px 12px hsla(145,38%,35%,0.3)",
                    }}
                  >
                    📅 Book This Slot
                  </button>
                </div>
              ))}
            </div>



          </div>
        )}

      </div>
    </section>
  );
};

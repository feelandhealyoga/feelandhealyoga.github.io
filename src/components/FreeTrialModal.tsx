import { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Fixed schedule (no separate kids/weight-loss batch) ── */
const BATCHES = [
  "Morning — 6:00–7:00 AM (Online / Offline)",
  "Morning — 8:00–9:00 AM (Online / Offline)",
  "Evening — 7:30–8:30 PM (Online / Offline)",
];

const TERMS = [
  "The complimentary free trial is available only once per person.",
  "A free trial can only be booked using valid personal details.",
  "Participants are requested to arrive on time for their scheduled session.",
  "If a participant does not attend the booked session, the free trial will be considered used and automatically cancelled.",
  "Rescheduling is subject to availability and must be requested in advance.",
  "Feel & Heal Yoga reserves the right to refuse or cancel duplicate or fraudulent registrations.",
  "By booking the free trial, you agree to these Terms & Conditions.",
];

const STORAGE_KEY = "fah_trial_bookings";
const WA_NUM = "919920155875";

interface Booking {
  name: string; phone: string; email: string;
  batch: string; mode: string; date: string;
  status: "booked" | "cancelled_noshow";
}

const getBookings = (): Booking[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};

const saveBooking = (b: Omit<Booking, "date" | "status">) => {
  const prev = getBookings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([
    ...prev,
    { ...b, date: new Date().toISOString(), status: "booked" },
  ]));
};

const isDuplicate = (phone: string, email: string): boolean => {
  const bookings = getBookings();
  const cp = phone.replace(/\s/g, "");
  const ce = email.trim().toLowerCase();
  return bookings.some(
    (b) => b.status !== "cancelled_noshow" &&
      (b.phone.replace(/\s/g, "") === cp || (ce && b.email.trim().toLowerCase() === ce))
  );
};

/* ── WhatsApp SVG ── */
const WAIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const FreeTrialModal = ({ isOpen, onClose }: FreeTrialModalProps) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", batch: "", mode: "Online" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", phone: "", email: "", batch: "", mode: "Online" });
      setErrors({});
      setAgreed(false);
      setSubmitted(false);
      setDuplicate(false);
      // Trigger entry animation
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit mobile number";
    if (!form.batch) e.batch = "Please select a preferred batch";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (isDuplicate(form.phone, form.email)) { setDuplicate(true); return; }

    saveBooking({ name: form.name, phone: form.phone, email: form.email, batch: form.batch, mode: form.mode });
    const msg = `Namaste Team Feel & Heal Yoga! 🙏 I'd like to book a FREE trial class.\n\nName: ${form.name}\nMobile: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ""}\nBatch: ${form.batch}\nMode: ${form.mode}\n\nI have read and agreed to the Free Trial Terms & Conditions. 🌿`;
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => { const n = { ...er }; delete n[field]; return n; });
    if (duplicate) setDuplicate(false);
  };

  const canSubmit = agreed && !duplicate;
  const firstName = form.name.trim().split(" ")[0];

  /* ── Shared input style ── */
  const inputBase: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid hsl(40,18%,86%)",
    borderRadius: "14px",
    padding: "11px 16px",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    background: "white",
    color: "hsl(220,16%,16%)",
    transition: "border-color 0.22s ease, box-shadow 0.22s ease",
  };

  return (
    /* ── Backdrop ── */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0",
        background: "rgba(8, 14, 10, 0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* ── Modal Card ── */}
      <div
        ref={dialogRef}
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "94vh",
          overflowY: "auto",
          background: "hsl(40, 28%, 97%)",
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.28), 0 -4px 16px rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
          transform: visible ? "translateY(0)" : "translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.44s cubic-bezier(0.16,1,0.3,1), opacity 0.36s ease",
          scrollbarWidth: "thin",
        }}
      >
        {/* ── Header — matches Yogi header exactly ── */}
        <div
          style={{
            background: "linear-gradient(148deg, hsl(145,48%,20%), hsl(155,44%,30%) 60%, hsl(145,38%,26%))",
            color: "white",
            padding: "20px 22px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "sticky",
            top: 0,
            zIndex: 10,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Om watermark */}
          <span style={{
            position: "absolute", right: 68, top: "50%",
            transform: "translateY(-50%)",
            fontSize: 72, opacity: 0.07, fontFamily: "serif",
            color: "white", pointerEvents: "none", lineHeight: 1,
          }}>ॐ</span>
          {/* Shimmer line at bottom */}
          <span style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 70%, transparent)",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "10px", letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(212,175,92,0.88)",
              marginBottom: 8,
            }}>
              ॐ &nbsp; Feel &amp; Heal Yoga
            </p>
            <h2
              id="trial-modal-title"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.25rem, 4vw, 1.55rem)",
                fontWeight: 800, color: "white",
                lineHeight: 1.18, margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Book Your Free Trial
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 12.5, marginTop: 5 }}>
              No commitment. Experience the vibe first. 🌿
            </p>
          </div>

          {/* Close button — rotates on hover like Yogi */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.88)",
              width: 36, height: 36,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              position: "relative", zIndex: 1,
              transition: "background 0.2s ease, transform 0.28s ease",
              marginTop: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(90deg)"; e.currentTarget.style.background = "rgba(255,255,255,0.24)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Gold shimmer strip — matches Yogi subheader ── */}
        <div style={{
          background: "linear-gradient(90deg, hsl(42,82%,50%), hsl(38,78%,46%))",
          padding: "7px 20px",
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "hsl(20,30%,14%)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          fontFamily: "'Inter', sans-serif",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}>
          <style>{`
            @keyframes trialShimmer {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes trialSlideField {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .trial-field { animation: trialSlideField 0.38s cubic-bezier(0.4,0,0.2,1) forwards; }
            .trial-field:nth-child(1) { animation-delay: 0.05s; opacity: 0; }
            .trial-field:nth-child(2) { animation-delay: 0.10s; opacity: 0; }
            .trial-field:nth-child(3) { animation-delay: 0.15s; opacity: 0; }
            .trial-field:nth-child(4) { animation-delay: 0.20s; opacity: 0; }
            .trial-field:nth-child(5) { animation-delay: 0.25s; opacity: 0; }
            .trial-field:nth-child(6) { animation-delay: 0.30s; opacity: 0; }
            .trial-input:focus {
              border-color: hsl(145,38%,52%) !important;
              box-shadow: 0 0 0 3.5px hsla(145,38%,52%,0.15) !important;
            }
            .trial-chip {
              flex: 1;
              padding: 10px 14px;
              border-radius: 999px;
              font-size: 13px;
              font-weight: 600;
              font-family: 'Inter', sans-serif;
              border: 1.5px solid hsl(40,18%,82%);
              background: white;
              color: hsl(220,16%,38%);
              cursor: pointer;
              transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
              text-align: center;
            }
            .trial-chip.selected {
              background: hsl(145,44%,28%);
              border-color: hsl(145,44%,28%);
              color: white;
              box-shadow: 0 3px 12px hsla(145,44%,28%,0.28);
            }
            .trial-chip:hover:not(.selected) {
              border-color: hsl(145,38%,60%);
              color: hsl(145,44%,28%);
            }
            .trial-batch-chip {
              display: block;
              width: 100%;
              text-align: left;
              padding: 11px 16px;
              border-radius: 14px;
              font-size: 13.5px;
              font-family: 'Inter', sans-serif;
              font-weight: 500;
              border: 1.5px solid hsl(40,18%,84%);
              background: white;
              color: hsl(220,16%,22%);
              cursor: pointer;
              margin-bottom: 7px;
              transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
            }
            .trial-batch-chip.selected {
              background: hsl(145,32%,93%);
              border-color: hsl(145,44%,44%);
              color: hsl(145,44%,24%);
              font-weight: 700;
              box-shadow: 0 2px 10px hsla(145,44%,28%,0.14);
            }
            .trial-batch-chip:hover:not(.selected) {
              border-color: hsl(145,32%,68%);
              background: hsl(145,20%,97%);
            }
            .trial-submit {
              transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s ease, opacity 0.18s ease;
            }
            .trial-submit:not(:disabled):hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 28px rgba(37,211,102,0.48) !important;
            }
          `}</style>
          <span style={{ position: "relative", zIndex: 1 }}>
            🎉 100% Free · No Payment Required · Just Show Up!
          </span>
          <span style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            animation: "trialShimmer 3s ease-in-out infinite",
          }} />
        </div>

        {/* ── DUPLICATE STATE ── */}
        {duplicate && !submitted && (
          <div style={{ padding: "40px 28px", textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "hsl(38,90%,94%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
              boxShadow: "0 4px 20px hsla(38,90%,52%,0.22)",
            }}>
              <AlertCircle style={{ width: 30, height: 30, color: "hsl(30,80%,50%)" }} />
            </div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem", fontWeight: 800,
              color: "hsl(220,16%,16%)", marginBottom: 10,
            }}>
              Trial Already Claimed
            </h3>
            <p style={{ fontSize: 13.5, color: "hsl(220,10%,46%)", lineHeight: 1.7, marginBottom: 28 }}>
              Our records show you've already claimed your complimentary free trial. If you believe this is an error, please contact us.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Hi Team Feel & Heal Yoga! I believe there may be an error with my free trial status. Could you please help me? 🙏")}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px 20px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "white", textDecoration: "none",
                  fontWeight: 700, fontSize: 14, fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 4px 18px rgba(37,211,102,0.32)",
                }}
              >
                <WAIcon /> Contact Team Feel &amp; Heal Yoga
              </a>
              <button
                onClick={onClose}
                style={{
                  padding: "12px 20px", borderRadius: "14px",
                  border: "1.5px solid hsl(40,18%,82%)",
                  background: "transparent", color: "hsl(220,10%,46%)",
                  fontWeight: 600, fontSize: 14, fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ── SUCCESS STATE ── */}
        {submitted && (
          <div style={{ padding: "48px 28px", textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(145deg, hsl(145,44%,28%), hsl(155,40%,40%))",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 6px 24px hsla(145,44%,28%,0.38)",
              animation: "trialSlideField 0.5s ease forwards",
            }}>
              <CheckCircle2 style={{ width: 34, height: 34, color: "white" }} />
            </div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem", fontWeight: 800,
              color: "hsl(145,44%,26%)", marginBottom: 10,
            }}>
              You're all set{firstName ? `, ${firstName}` : ""}! 🌸
            </h3>
            <p style={{
              fontSize: 14, color: "hsl(220,10%,46%)",
              lineHeight: 1.75, marginBottom: 10,
            }}>
              WhatsApp has opened with your details pre-filled.
            </p>
            <p style={{
              fontSize: 14, color: "hsl(220,10%,46%)",
              lineHeight: 1.75, marginBottom: 32,
            }}>
              Our team will confirm your <strong>free trial slot</strong> shortly. See you on the mat! 🧘
            </p>
            <button
              onClick={onClose}
              style={{
                padding: "13px 36px", borderRadius: "999px",
                background: "linear-gradient(145deg, hsl(145,44%,28%), hsl(155,40%,40%))",
                color: "white", fontWeight: 700, fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                border: "none", cursor: "pointer",
                boxShadow: "0 4px 18px hsla(145,44%,28%,0.32)",
                transition: "transform 0.22s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              Close
            </button>
          </div>
        )}

        {/* ── FORM ── */}
        {!duplicate && !submitted && (
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              padding: "24px 22px 28px",
              display: "flex", flexDirection: "column", gap: 18,
            }}
          >
            {/* Name */}
            <div className="trial-field">
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "hsl(220,10%,46%)", marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
              }}>
                Your Name *
              </label>
              <input
                className="trial-input"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Priya Sharma"
                style={{
                  ...inputBase,
                  borderColor: errors.name ? "#ef4444" : "hsl(40,18%,86%)",
                }}
              />
              {errors.name && (
                <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, fontFamily: "'Inter', sans-serif" }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="trial-field">
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "hsl(220,10%,46%)", marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
              }}>
                Mobile Number *
              </label>
              <input
                className="trial-input"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                style={{
                  ...inputBase,
                  borderColor: errors.phone ? "#ef4444" : "hsl(40,18%,86%)",
                }}
              />
              {errors.phone && (
                <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 5, fontFamily: "'Inter', sans-serif" }}>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email (optional) */}
            <div className="trial-field">
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "hsl(220,10%,46%)", marginBottom: 8,
                fontFamily: "'Inter', sans-serif",
              }}>
                Email{" "}
                <span style={{ fontWeight: 400, color: "hsl(220,8%,60%)", textTransform: "none" }}>
                  (optional)
                </span>
              </label>
              <input
                className="trial-input"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="your@email.com"
                style={inputBase}
              />
            </div>

            {/* Batch — chip-style selection */}
            <div className="trial-field">
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "hsl(220,10%,46%)", marginBottom: 10,
                fontFamily: "'Inter', sans-serif",
              }}>
                Preferred Batch *
              </label>
              <div>
                {BATCHES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => update("batch", b)}
                    className={`trial-batch-chip${form.batch === b ? " selected" : ""}`}
                  >
                    <span style={{ marginRight: 10 }}>
                      {b.startsWith("Morning") ? "🌅" : "🌇"}
                    </span>
                    {b}
                    {form.batch === b && (
                      <span style={{ float: "right", fontSize: 13 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
              {errors.batch && (
                <p style={{ fontSize: 11.5, color: "#ef4444", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                  {errors.batch}
                </p>
              )}
            </div>

            {/* Mode — pill chips like Yogi */}
            <div className="trial-field">
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
                color: "hsl(220,10%,46%)", marginBottom: 10,
                fontFamily: "'Inter', sans-serif",
              }}>
                Preferred Mode
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {["Online", "Offline (Kharghar)"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => update("mode", m)}
                    className={`trial-chip${form.mode === m ? " selected" : ""}`}
                  >
                    {m === "Online" ? "🌐 " : "📍 "}{m}
                  </button>
                ))}
              </div>
            </div>

            {/* T&C Card — styled like a chat card */}
            <div
              className="trial-field"
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1.5px solid hsl(40,22%,88%)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              {/* T&C header */}
              <div style={{
                padding: "11px 16px",
                background: "linear-gradient(135deg, hsl(145,24%,93%), hsl(40,32%,94%))",
                display: "flex", alignItems: "center", gap: 9,
                borderBottom: "1px solid hsl(40,22%,88%)",
              }}>
                <ShieldCheck style={{ width: 16, height: 16, color: "hsl(145,44%,34%)", flexShrink: 0 }} />
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  color: "hsl(145,44%,28%)", fontFamily: "'Inter', sans-serif",
                }}>
                  Free Trial Terms &amp; Conditions
                </span>
              </div>

              {/* Scrollable terms */}
              <div style={{
                maxHeight: 150,
                overflowY: "auto",
                padding: "12px 16px",
                background: "hsl(38,28%,99%)",
                scrollbarWidth: "thin",
              }}>
                <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {TERMS.map((term, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex", gap: 10,
                        marginBottom: i < TERMS.length - 1 ? 10 : 0,
                        fontSize: 12.5, lineHeight: 1.65,
                        color: "hsl(220,12%,36%)", fontFamily: "'Inter', sans-serif",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{
                        flexShrink: 0, width: 18, height: 18,
                        borderRadius: "50%",
                        background: "hsl(145,30%,88%)",
                        color: "hsl(145,44%,28%)",
                        fontSize: 9.5, fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginTop: 1, fontFamily: "'Inter', sans-serif",
                      }}>
                        {i + 1}
                      </span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Agree checkbox */}
              <div style={{
                padding: "12px 16px",
                background: "hsl(40,30%,98%)",
                borderTop: "1px solid hsl(40,22%,90%)",
              }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  {/* Custom checkbox */}
                  <div
                    onClick={() => setAgreed(!agreed)}
                    style={{
                      flexShrink: 0, width: 18, height: 18, borderRadius: 5,
                      border: `2px solid ${agreed ? "hsl(145,44%,40%)" : "hsl(40,22%,70%)"}`,
                      background: agreed ? "hsl(145,44%,40%)" : "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", marginTop: 1,
                      transition: "all 0.2s ease",
                      boxShadow: agreed ? "0 2px 8px hsla(145,44%,40%,0.30)" : "none",
                    }}
                  >
                    {agreed && (
                      <svg viewBox="0 0 12 10" style={{ width: 10, height: 10 }} fill="none">
                        <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 12.5, color: "hsl(220,12%,32%)",
                    lineHeight: 1.65, fontFamily: "'Inter', sans-serif",
                  }}>
                    I have read and agree to the{" "}
                    <strong style={{ color: "hsl(145,44%,28%)" }}>
                      Free Trial Terms &amp; Conditions
                    </strong>
                    . <span style={{ color: "#ef4444" }}>*</span>
                  </span>
                </label>
                {!agreed && (
                  <p style={{
                    fontSize: 11, color: "hsl(220,8%,58%)",
                    marginTop: 6, marginLeft: 30,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    You must agree to the terms before booking.
                  </p>
                )}
              </div>
            </div>

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="trial-submit"
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 14,
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                fontSize: 14.5, fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.01em",
                cursor: canSubmit ? "pointer" : "not-allowed",
                background: canSubmit
                  ? "linear-gradient(135deg, hsl(38,92%,52%), hsl(30,86%,46%))"
                  : "hsl(40,14%,84%)",
                color: canSubmit ? "hsl(220,18%,12%)" : "hsl(30,12%,54%)",
                boxShadow: canSubmit
                  ? "0 6px 24px hsla(38,92%,52%,0.45), inset 0 1px 0 rgba(255,255,255,0.22)"
                  : "none",
                transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {canSubmit ? (
                <>
                  <WAIcon />
                  🌿 Send via WhatsApp &amp; Book Trial
                </>
              ) : (
                <>🔒 Agree to Terms to Continue</>
              )}
            </button>

            <p style={{
              textAlign: "center", fontSize: 12,
              color: "hsl(220,8%,60%)", fontFamily: "'Inter', sans-serif",
              marginTop: -6,
            }}>
              Tapping above opens WhatsApp with your details pre-filled 🙏
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

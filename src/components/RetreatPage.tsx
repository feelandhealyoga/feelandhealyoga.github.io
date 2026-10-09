import { useState, useEffect } from "react";

const RETREAT_DATE = new Date("2026-10-24T06:00:00+05:30");
const WA_MSG = encodeURIComponent(
  "Namaste! I am interested in the Feel & Heal Yoga Karjat Mindfulness Retreat on 24–25 October 2026. Please share registration details and availability."
);
const WA_URL = `https://wa.me/919920155875?text=${WA_MSG}`;

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

/* ── Registration Form ──────────────────────────────────────────────────── */
const RegistrationForm = () => {
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "",
    participant_count: "1", preferred_contact: "whatsapp", notes: "", consent: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [waUrl, setWaUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("retreat_submitted_karjat2026")) setSubmitted(true);
  }, []);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) { setMsg("Please consent to sharing your details."); setStatus("error"); return; }
    if (submitted) { setMsg("You have already submitted an enquiry. Our team will reach out soon!"); setStatus("error"); return; }
    setStatus("submitting");
    try {
      const res = await fetch("/api/retreat-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, registration_source: "retreat_page_form" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("success");
      setMsg(data.message);
      setWaUrl(data.whatsapp_url || WA_URL);
      setSubmitted(true);
      localStorage.setItem("retreat_submitted_karjat2026", "1");
      try { (window as any).gtag?.("event", "retreat_form_submitted", { event_category: "retreat" }); } catch (_) {}
    } catch (err: any) {
      setStatus("error");
      setMsg(err.message || "Something went wrong. Please try WhatsApp instead.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid hsl(38,22%,84%)", background: "hsl(36,50%,99%)",
    fontSize: 14, color: "hsl(20,20%,18%)", outline: "none",
    fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "hsl(20,18%,38%)", marginBottom: 5, display: "block", letterSpacing: "0.04em" };

  if (status === "success") return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", color: "hsl(145,38%,30%)", fontSize: 22, marginBottom: 12 }}>
        Enquiry Received!
      </h3>
      <p style={{ color: "hsl(20,14%,40%)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{msg}</p>
      <a href={waUrl} target="_blank" rel="noopener noreferrer"
        onClick={() => { try { (window as any).gtag?.("event", "retreat_wa_clicked", { event_category: "retreat" }); } catch (_) {} }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "hsl(142,70%,35%)", color: "#fff", fontWeight: 700,
          padding: "12px 24px", borderRadius: 999, textDecoration: "none", fontSize: 14,
        }}>
        💬 Also reach us on WhatsApp
      </a>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div>
          <label style={labelStyle} htmlFor="rr-name">FULL NAME *</label>
          <input id="rr-name" style={inputStyle} required minLength={2} maxLength={100}
            value={form.full_name} onChange={e => set("full_name", e.target.value)}
            placeholder="Your full name" autoComplete="name" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="rr-phone">MOBILE NUMBER *</label>
          <input id="rr-phone" style={inputStyle} required type="tel" minLength={10} maxLength={15}
            value={form.phone} onChange={e => set("phone", e.target.value)}
            placeholder="10-digit mobile number" autoComplete="tel" />
        </div>
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <div>
          <label style={labelStyle} htmlFor="rr-email">EMAIL ADDRESS <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
          <input id="rr-email" style={inputStyle} type="email" maxLength={200}
            value={form.email} onChange={e => set("email", e.target.value)}
            placeholder="your@email.com" autoComplete="email" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="rr-count">NUMBER OF PARTICIPANTS *</label>
          <select id="rr-count" style={{ ...inputStyle, cursor: "pointer" }}
            value={form.participant_count} onChange={e => set("participant_count", e.target.value)}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="rr-contact">PREFERRED CONTACT METHOD *</label>
        <select id="rr-contact" style={{ ...inputStyle, cursor: "pointer" }}
          value={form.preferred_contact} onChange={e => set("preferred_contact", e.target.value)}>
          <option value="whatsapp">WhatsApp</option>
          <option value="call">Phone Call</option>
          <option value="email">Email</option>
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="rr-notes">ADDITIONAL QUESTIONS <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
        <textarea id="rr-notes" style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          maxLength={500} value={form.notes} onChange={e => set("notes", e.target.value)}
          placeholder="Any questions or special requirements?" />
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={form.consent} onChange={e => set("consent", e.target.checked)}
          style={{ marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "hsl(20,14%,44%)", lineHeight: 1.5 }}>
          I consent to Feel & Heal Yoga storing and using my details to respond to this retreat enquiry. My information will not be shared with third parties.
        </span>
      </label>

      {status === "error" && (
        <p style={{ color: "hsl(0,65%,50%)", fontSize: 13, background: "hsl(0,80%,97%)", padding: "10px 14px", borderRadius: 8, border: "1px solid hsl(0,60%,88%)" }}>
          ⚠️ {msg}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"}
        style={{
          padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, hsl(145,40%,32%), hsl(160,42%,42%))",
          color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em",
          opacity: status === "submitting" ? 0.7 : 1, transition: "opacity 0.2s",
        }}>
        {status === "submitting" ? "Submitting..." : "🌿 Reserve Your Retreat Spot"}
      </button>

      <p style={{ fontSize: 11, color: "hsl(20,14%,56%)", textAlign: "center", lineHeight: 1.5 }}>
        Submitting this form is an <strong>enquiry only</strong> — not a confirmed booking. Our team will contact you with availability and next steps.
      </p>
    </form>
  );
};

/* ── FAQ ────────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Who can attend the retreat?", a: "The retreat is open to anyone looking to take a mindful break — beginners, regular practitioners, and those new to yoga alike. All ages and fitness levels are welcome." },
  { q: "Is prior yoga experience required?", a: "Not at all! All activities are designed to be accessible and enjoyable regardless of experience level." },
  { q: "Can I bring a friend or family member?", a: "Absolutely! You can register for multiple participants. Just enter the number of people when you fill the enquiry form." },
  { q: "What should I bring?", a: "Comfortable, breathable clothing; a water bottle; a light jacket for evenings; and an open, curious mind. More details will be shared upon confirmation." },
  { q: "How will I know my spot is confirmed?", a: "After you submit your enquiry, our Feel & Heal Yoga team will personally contact you to share availability, details, and confirm your registration. Submitting the form is not a confirmation." },
  { q: "What activities are included?", a: "Yoga & meditation, breathwork & mindfulness, mindful tea, meaningful group connections, music, and fun games — all set amidst nature in Karjat." },
  { q: "I have more questions. Who do I contact?", a: "Reach us on WhatsApp or phone at +91 99201 55875 — we're available Mon–Sat, 6 AM – 9 PM and happy to help!" },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {FAQS.map((f, i) => (
        <div key={i} style={{ border: "1.5px solid hsl(38,22%,86%)", borderRadius: 12, overflow: "hidden" }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", textAlign: "left", padding: "14px 18px",
              background: open === i ? "hsl(145,20%,96%)" : "hsl(36,50%,99%)",
              border: "none", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontWeight: 600, fontSize: 14, color: "hsl(20,20%,18%)", gap: 12,
            }}>
            <span>{f.q}</span>
            <span style={{ fontSize: 18, color: "hsl(145,38%,42%)", flexShrink: 0, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
          </button>
          {open === i && (
            <div style={{ padding: "12px 18px 16px", background: "hsl(145,20%,97%)", fontSize: 14, color: "hsl(20,14%,40%)", lineHeight: 1.65 }}>
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────────────────────── */
export const RetreatPage = () => {
  const { days, hours, minutes, seconds } = useCountdown(RETREAT_DATE);

  const openYogiRetreat = () => {
    window.dispatchEvent(new CustomEvent("open-yogi-retreat"));
    try { (window as any).gtag?.("event", "retreat_yogi_opened", { event_category: "retreat" }); } catch (_) {}
  };

  const trackWa = () => { try { (window as any).gtag?.("event", "retreat_wa_clicked", { event_category: "retreat" }); } catch (_) {} };

  const sectionStyle: React.CSSProperties = { padding: "64px 24px", maxWidth: 860, margin: "0 auto" };
  const h2Style: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "hsl(20,20%,14%)", marginBottom: 12 };
  const yogicLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(145,38%,38%)", marginBottom: 8, display: "block" };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, hsl(80,18%,14%) 0%, hsl(145,30%,18%) 55%, hsl(25,35%,22%) 100%)",
        padding: "80px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(hsl(38,80%,75%) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", borderRadius: 999, padding: "5px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "hsl(38,90%,72%)", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "hsl(38,90%,62%)", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
            Feel & Heal Yoga · Karjat Retreat
          </span>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5.5vw,52px)", fontWeight: 800, lineHeight: 1.15, color: "hsl(38,60%,94%)", margin: "0 auto 16px", maxWidth: 720 }}>
            Your Phone Has Airplane Mode.<br />
            <em style={{ color: "hsl(145,50%,68%)" }}>Why Don't You?</em>
          </h1>
          <p style={{ color: "hsl(38,25%,72%)", fontSize: 18, margin: "0 auto 8px", maxWidth: 520 }}>
            Switch off the noise. Tune into yourself.
          </p>
          <p style={{ color: "hsl(38,70%,78%)", fontWeight: 600, fontSize: 15, margin: "0 0 32px" }}>
            📅 24 – 25 October 2026 &nbsp;·&nbsp; 📍 Karjat, Maharashtra
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            {[[days,"Days"],[hours,"Hours"],[minutes,"Mins"],[seconds,"Secs"]].map(([v,l]) => (
              <div key={l as string} style={{ textAlign: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "10px 16px", fontFamily: "'DM Mono',monospace", fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "hsl(38,85%,78%)", minWidth: 56, lineHeight: 1 }}>
                  {String(v).padStart(2,"0")}
                </div>
                <div style={{ fontSize: 10, color: "hsl(38,20%,55%)", marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,hsl(145,40%,36%),hsl(160,42%,44%))", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 999, textDecoration: "none", boxShadow: "0 4px 20px hsla(145,40%,36%,0.4)" }}>
              🌿 Reserve Your Spot
            </a>
            <button onClick={openYogiRetreat} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,hsl(25,70%,44%),hsl(15,72%,38%))", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 999, border: "none", cursor: "pointer", boxShadow: "0 4px 20px hsla(25,70%,44%,0.4)" }}>
              💬 Register with YOGI AI
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <span style={yogicLabel}>Why Take a Break?</span>
        <h2 style={h2Style}>Step Away from the Noise</h2>
        <p style={{ color: "hsl(20,14%,44%)", fontSize: 16, lineHeight: 1.75, maxWidth: 640, margin: "0 auto 40px" }}>
          Step away from the noise for one night. Breathe deeper, feel lighter, reconnect with yourself, and enjoy meaningful experiences surrounded by nature.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { icon: "🧠", title: "Mental Clarity", desc: "Quiet the mental chatter and reconnect with your thoughts" },
            { icon: "💚", title: "Inner Calm", desc: "Breathwork and meditation to ground and centre yourself" },
            { icon: "🌿", title: "Nature Immersion", desc: "Karjat's lush surroundings offer the perfect healing backdrop" },
            { icon: "🤝", title: "Meaningful Connections", desc: "Bond with like-minded people on a shared wellness journey" },
          ].map(c => (
            <div key={c.title} style={{ background: "hsl(36,50%,99%)", border: "1.5px solid hsl(38,22%,90%)", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, color: "hsl(20,20%,18%)", marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: "hsl(20,12%,50%)", lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACTIVITIES ── */}
      <section style={{ background: "hsl(145,15%,96%)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <span style={yogicLabel}>What's Included</span>
          <h2 style={h2Style}>Activities & Experiences</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 32 }}>
            {[
              { icon: "🧘", name: "Yoga & Meditation", desc: "Morning and evening sessions for all levels, guided by Feel & Heal Yoga's certified teachers." },
              { icon: "🌬️", name: "Breathwork & Mindfulness", desc: "Pranayama and mindfulness practices to calm the nervous system and centre your awareness." },
              { icon: "🍵", name: "Mindful Tea", desc: "A slow, intentional tea ceremony — a beautiful practice in presence and gratitude." },
              { icon: "🎵", name: "Music", desc: "Soothing, uplifting music woven through the retreat to elevate the experience." },
              { icon: "🤝", name: "Meaningful Connections", desc: "Guided group sharing and bonding activities with fellow retreat participants." },
              { icon: "🎲", name: "Fun Games", desc: "Light-hearted, joyful activities that bring energy, laughter, and community spirit." },
            ].map(a => (
              <div key={a.name} style={{ background: "#fff", border: "1.5px solid hsl(145,22%,88%)", borderRadius: 16, padding: "22px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontSize: 30, flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "hsl(20,20%,18%)", marginBottom: 6, fontSize: 15 }}>{a.name}</div>
                  <div style={{ fontSize: 13, color: "hsl(20,12%,48%)", lineHeight: 1.65 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DETAILS ── */}
      <section style={sectionStyle}>
        <span style={yogicLabel}>Date & Location</span>
        <h2 style={h2Style}>Retreat Details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 28 }}>
          {[
            { icon: "📅", label: "Dates", value: "Saturday, 24 October – Sunday, 25 October 2026" },
            { icon: "📍", label: "Location", value: "Karjat, Maharashtra, India" },
            { icon: "🏕️", label: "Format", value: "1-Night Residential Retreat" },
            { icon: "☎️", label: "Contact", value: "+91 99201 55875" },
          ].map(d => (
            <div key={d.label} style={{ background: "hsl(36,50%,99%)", border: "1.5px solid hsl(38,22%,90%)", borderRadius: 14, padding: "20px" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{d.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "hsl(145,38%,38%)", marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontWeight: 600, color: "hsl(20,20%,22%)", fontSize: 14, lineHeight: 1.5 }}>{d.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO ── */}
      <section style={{ background: "linear-gradient(135deg,hsl(25,45%,97%),hsl(38,45%,96%))", padding: "64px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <span style={yogicLabel}>Who Can Attend?</span>
          <h2 style={h2Style}>This Retreat Is For You If…</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", marginTop: 28 }}>
            {[
              "You feel overwhelmed, burnt out, or disconnected",
              "You want to deepen your yoga or meditation practice",
              "You're a complete beginner curious about mindfulness",
              "You want to step away from screens and digital noise",
              "You're looking for meaningful community and connection",
              "You want to experience nature, healing, and joy together",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1.5px solid hsl(38,22%,88%)", borderRadius: 12, padding: "14px 18px" }}>
                <span style={{ color: "hsl(145,38%,42%)", fontSize: 18, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: "hsl(20,14%,34%)", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTER ── */}
      <section id="register" style={{ ...sectionStyle, scrollMarginTop: 80 }}>
        <span style={yogicLabel}>Registration Enquiry</span>
        <h2 style={h2Style}>Reserve Your Retreat Spot</h2>
        <p style={{ color: "hsl(20,14%,44%)", fontSize: 14, lineHeight: 1.65, marginBottom: 32, maxWidth: 580 }}>
          Fill in the form below and our Feel & Heal Yoga team will personally reach out with details and confirm your spot. This is an enquiry — not an automatic booking.
        </p>
        <div style={{ background: "hsl(36,50%,99%)", border: "1.5px solid hsl(38,22%,88%)", borderRadius: 20, padding: "36px 32px" }}>
          <RegistrationForm />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "hsl(145,10%,97%)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <span style={yogicLabel}>Frequently Asked Questions</span>
          <h2 style={h2Style}>Got Questions?</h2>
          <div style={{ marginTop: 28 }}>
            <FAQ />
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <h2 style={h2Style}>Still Have Questions?</h2>
        <p style={{ color: "hsl(20,14%,44%)", fontSize: 15, marginBottom: 28 }}>
          Reach the Feel & Heal Yoga team directly — we're happy to help.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={trackWa}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "hsl(142,70%,35%)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 999, textDecoration: "none" }}>
            💬 WhatsApp Us
          </a>
          <button onClick={openYogiRetreat}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,hsl(25,70%,44%),hsl(15,72%,38%))", color: "#fff", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 999, border: "none", cursor: "pointer" }}>
            🤖 Ask YOGI AI
          </button>
        </div>
      </section>

      <style>{`
        @keyframes pulse-dot {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.5;transform:scale(1.4)}
        }
      `}</style>
    </div>
  );
};

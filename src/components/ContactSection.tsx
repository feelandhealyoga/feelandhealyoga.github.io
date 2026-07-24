import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, Users, ShieldCheck, AlertCircle } from "lucide-react";
import { useState } from "react";

const TERMS = [
  "The complimentary free trial is available only once per person.",
  "A free trial can only be booked using valid personal details.",
  "Participants are requested to arrive on time for their scheduled session.",
  "If a participant does not attend the booked session, the free trial will be considered used and will be automatically cancelled.",
  "Rescheduling is subject to availability and must be requested in advance.",
  "Feel & Heal Yoga reserves the right to refuse or cancel duplicate or fraudulent free trial registrations.",
  "By booking the free trial, you agree to these Terms & Conditions.",
];

const STORAGE_KEY = "fah_trial_bookings";

interface Booking { phone: string; email: string; status: string; }

const getBookings = (): Booking[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};
const saveBooking = (data: { name: string; phone: string; email?: string }) => {
  const prev = getBookings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([
    ...prev,
    { ...data, date: new Date().toISOString(), status: "booked" },
  ]));
};
const isDuplicate = (phone: string): boolean => {
  const bookings = getBookings();
  const clean = phone.replace(/\s/g, "");
  return bookings.some((b) => b.status !== "cancelled_noshow" && b.phone.replace(/\s/g, "") === clean);
};

export const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", goal: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const WA = import.meta.env.VITE_WHATSAPP_NUMBER || "919920155875";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit mobile number";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (isDuplicate(form.phone)) { setDuplicate(true); return; }

    saveBooking({ name: form.name, phone: form.phone });
    const text = `Hi Team Feel & Heal Yoga! 🙏 I'd like to book a FREE trial class.%0AName: ${form.name}%0AMobile: ${form.phone}${form.goal ? `%0AGoal: ${form.goal}` : ""}%0A%0AI have read and agreed to the Free Trial Terms & Conditions.`;
    window.open(`https://wa.me/${WA}?text=${text}`, "_blank");
    setSubmitted(true);
  };

  const update = (field: string, val: string) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => { const n = { ...er }; delete n[field]; return n; });
    setDuplicate(false);
  };

  return (
    <section id="contact" className="py-20 px-6 section-cream yogic-pattern">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="yogic-label mb-3">Connect</div>
          <h2
            className="yogic-section-heading section-title-decor"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Get In Touch
          </h2>
          <p className="yogic-section-subheading mt-5">
            Have questions or ready to begin your yoga journey? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* ── Contact Info ── */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[hsl(20,20%,18%)] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact Information
            </h3>

            {[
              {
                icon: <Phone className="w-5 h-5" style={{ color: "hsl(145,38%,40%)" }} />,
                label: "Phone",
                content: "+91 99201 55875",
                href: "tel:+919920155875",
              },
              {
                icon: <MessageCircle className="w-5 h-5" style={{ color: "hsl(145,38%,40%)" }} />,
                label: "WhatsApp",
                content: "Chat with us on WhatsApp",
                href: `https://wa.me/${WA}`,
                external: true,
              },
              {
                icon: <Mail className="w-5 h-5" style={{ color: "hsl(145,38%,40%)" }} />,
                label: "Email",
                content: import.meta.env.VITE_EMAIL || "feelandhealyoga@gmail.com",
                href: `mailto:${import.meta.env.VITE_EMAIL || "feelandhealyoga@gmail.com"}`,
              },
              {
                icon: <Users className="w-5 h-5" style={{ color: "hsl(145,38%,40%)" }} />,
                label: "WhatsApp Community",
                content: "Join for updates",
                href: "https://chat.whatsapp.com/IZPCK7lR9tG9xN58THbdXo",
                external: true,
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md no-underline group"
                style={{ background: "hsl(36,50%,99%)", borderColor: "hsl(38,25%,88%)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(145,25%,92%)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-sm text-[hsl(20,20%,20%)]">{item.label}</p>
                  <p className="text-xs text-[hsl(20,12%,48%)]">{item.content}</p>
                </div>
              </a>
            ))}
          </div>

          {/* ── Free Trial Form ── */}
          <div>
            <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
              <div
                className="px-6 py-5"
                style={{ background: "linear-gradient(135deg, hsl(145,38%,30%), hsl(160,42%,40%))" }}
              >
                <p className="text-xs tracking-[0.25em] uppercase text-white/60 mb-1" style={{ fontFamily: "'Cinzel',serif" }}>
                  ॐ Free Trial
                </p>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Book Your Free Trial Class
                </h3>
                <p className="text-white/65 text-xs mt-1">No commitment · No payment required 🌿</p>
              </div>

              <div className="bg-[hsl(38,90%,52%)] px-6 py-1.5 text-center text-xs font-bold text-[hsl(20,20%,14%)]">
                🎉 100% Free · Just Show Up!
              </div>

              <CardContent className="p-6 space-y-4" style={{ background: "hsl(38,35%,97%)" }}>

                {/* Duplicate state */}
                {duplicate && (
                  <div
                    className="rounded-2xl p-4 flex gap-3"
                    style={{ background: "hsl(30,80%,96%)", border: "1px solid hsl(30,60%,85%)" }}
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-[hsl(30,80%,50%)] mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[hsl(20,20%,18%)] mb-1">Free Trial Already Claimed</p>
                      <p className="text-xs text-[hsl(20,15%,40%)] leading-relaxed">
                        Our records show that you've already claimed your complimentary free trial. Please{" "}
                        <a
                          href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi Team Feel & Heal Yoga! I believe there may be an error with my free trial status. Could you help?")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline"
                          style={{ color: "#25D366" }}
                        >
                          contact us
                        </a>{" "}
                        if you believe this is an error.
                      </p>
                    </div>
                  </div>
                )}

                {/* Success state */}
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="text-4xl mb-3">🌸</div>
                    <h4 className="font-bold text-[hsl(145,38%,35%)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      You're all set, {form.name.split(" ")[0]}!
                    </h4>
                    <p className="text-sm text-[hsl(20,15%,42%)] leading-relaxed">
                      Our team will confirm your free trial slot shortly. See you on the mat! 🙏
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", goal: "" }); setAgreed(false); }}
                      className="mt-5 px-6 py-2.5 rounded-full text-sm font-bold text-white"
                      style={{ background: "linear-gradient(135deg, hsl(145,38%,35%), hsl(160,40%,44%))" }}
                    >
                      Book Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3" noValidate>

                    {/* Name */}
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
                        style={{ borderColor: errors.name ? "#ef4444" : "hsl(38,18%,82%)", fontFamily: "'Lato', sans-serif" }}
                        onFocus={(e) => (e.target.style.borderColor = "hsl(145,38%,50%)")}
                        onBlur={(e) => (e.target.style.borderColor = errors.name ? "#ef4444" : "hsl(38,18%,82%)")}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <input
                        type="tel"
                        placeholder="Mobile Number * (10 digits)"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
                        style={{ borderColor: errors.phone ? "#ef4444" : "hsl(38,18%,82%)", fontFamily: "'Lato', sans-serif" }}
                        onFocus={(e) => (e.target.style.borderColor = "hsl(145,38%,50%)")}
                        onBlur={(e) => (e.target.style.borderColor = errors.phone ? "#ef4444" : "hsl(38,18%,82%)")}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Goal (optional) */}
                    <div>
                      <textarea
                        placeholder="Your yoga goal or experience (optional)..."
                        value={form.goal}
                        onChange={(e) => update("goal", e.target.value)}
                        rows={3}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white resize-none transition-all"
                        style={{ borderColor: "hsl(38,18%,82%)", fontFamily: "'Lato', sans-serif" }}
                        onFocus={(e) => (e.target.style.borderColor = "hsl(145,38%,50%)")}
                        onBlur={(e) => (e.target.style.borderColor = "hsl(38,18%,82%)")}
                      />
                    </div>

                    {/* ── Terms & Conditions ── */}
                    <div
                      className="rounded-2xl overflow-hidden border"
                      style={{ borderColor: "hsl(38,25%,85%)" }}
                    >
                      {/* T&C Header */}
                      <div
                        className="px-4 py-2.5 flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg, hsl(145,25%,92%), hsl(38,40%,94%))" }}
                      >
                        <ShieldCheck className="w-4 h-4 flex-shrink-0 text-[hsl(145,38%,40%)]" />
                        <span className="text-xs font-bold uppercase tracking-wide text-[hsl(145,38%,35%)]">
                          Free Trial Terms &amp; Conditions
                        </span>
                      </div>

                      {/* Scrollable list */}
                      <div
                        className="px-4 py-3 overflow-y-auto"
                        style={{ maxHeight: "140px", background: "hsl(38,30%,98%)" }}
                      >
                        <ol className="space-y-2">
                          {TERMS.map((term, i) => (
                            <li key={i} className="flex gap-2.5 text-xs text-[hsl(20,15%,38%)] leading-relaxed">
                              <span
                                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                                style={{ background: "hsl(145,30%,88%)", color: "hsl(145,38%,35%)" }}
                              >
                                {i + 1}
                              </span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Checkbox */}
                      <div
                        className="px-4 py-3 border-t"
                        style={{ borderColor: "hsl(38,25%,88%)", background: "hsl(36,40%,97%)" }}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <div className="flex-shrink-0 mt-0.5">
                            <div
                              onClick={() => setAgreed(!agreed)}
                              className="w-4 h-4 rounded flex items-center justify-center border-2 transition-all cursor-pointer"
                              style={{
                                borderColor: agreed ? "hsl(145,38%,45%)" : "hsl(38,25%,72%)",
                                background: agreed ? "hsl(145,38%,45%)" : "white",
                              }}
                            >
                              {agreed && (
                                <svg viewBox="0 0 12 10" className="w-2.5 h-2.5" fill="none">
                                  <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-[hsl(20,15%,35%)] leading-relaxed">
                            I have read and agree to the{" "}
                            <span className="font-bold text-[hsl(145,38%,38%)]">
                              Free Trial Terms &amp; Conditions
                            </span>
                            . <span className="text-red-500">*</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!agreed}
                      className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: agreed ? "#25D366" : "hsl(38,15%,82%)",
                        color: agreed ? "white" : "hsl(30,12%,52%)",
                        cursor: agreed ? "pointer" : "not-allowed",
                        boxShadow: agreed ? "0 4px 16px rgba(37,211,102,0.35)" : "none",
                      }}
                    >
                      {agreed ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Book Free Trial on WhatsApp
                        </>
                      ) : "🔒 Agree to Terms to Continue"}
                    </button>

                    <p className="text-center text-xs text-[hsl(30,12%,55%)]">
                      Opens WhatsApp with your details pre-filled 🙏
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

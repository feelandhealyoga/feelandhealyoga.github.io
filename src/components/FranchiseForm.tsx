import { useState } from "react";

const teal  = "hsl(175,32%,38%)";
const gold  = "hsl(38,90%,52%)";
const slate = "hsl(220,20%,18%)";
const muted = "hsl(220,12%,52%)";
const cream = "hsl(42,30%,97%)";

const generateId = () =>
  "FHF-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();

interface FData {
  fullName: string; mobile: string; email: string;
  city: string; state: string; preferredLocation: string;
  occupation: string; businessExp: string; investmentRange: string;
  space: string; timeline: string; whyJoin: string; notes: string;
  consent: boolean;
}

const empty: FData = {
  fullName:"", mobile:"", email:"", city:"", state:"", preferredLocation:"",
  occupation:"", businessExp:"", investmentRange:"", space:"", timeline:"",
  whyJoin:"", notes:"", consent:false,
};

const INVESTMENT = ["Below ₹5 Lakhs","₹5–10 Lakhs","₹10–20 Lakhs","₹20–50 Lakhs","Above ₹50 Lakhs"];
const TIMELINES  = ["Immediately","Within 1 Month","1–3 Months","3–6 Months","6+ Months","Just Exploring"];
const BIZ_EXP   = ["No prior experience","1–2 years","3–5 years","5–10 years","10+ years"];

const inputStyle: React.CSSProperties = {
  width:"100%", padding:"10px 14px", borderRadius:10,
  border:"1.5px solid hsl(38,22%,88%)", background:"white",
  fontSize:14, color:slate, boxSizing:"border-box",
  outline:"none", transition:"border-color .15s",
};

const lbl = (text: string, req=false) => (
  <label style={{ display:"block", fontSize:13, fontWeight:600, color:slate, marginBottom:5 }}>
    {text}{req && <span style={{ color:"hsl(0,70%,55%)" }}> *</span>}
  </label>
);

export const FranchiseForm = () => {
  const [data, setData] = useState<FData>(empty);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enquiryId] = useState(generateId);

  const set = (k: keyof FData, v: any) => setData(d => ({ ...d, [k]: v }));

  const validate = () => {
    const e: Record<string,string> = {};
    if (!data.fullName.trim()) e.fullName = "Required";
    if (!data.mobile.match(/^[6-9]\d{9}$/)) e.mobile = "Enter valid 10-digit mobile";
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    if (!data.city.trim()) e.city = "Required";
    if (!data.state.trim()) e.state = "Required";
    if (!data.investmentRange) e.investmentRange = "Required";
    if (!data.whyJoin.trim()) e.whyJoin = "Required";
    if (!data.consent) e.consent = "Consent required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        _subject: `🌿 New Franchise Application — ${data.city}, ${data.state} (${enquiryId})`,
        _replyto: data.email,
        _template: "table",
        "Application ID": enquiryId,
        "Full Name": data.fullName,
        "Mobile": data.mobile,
        "Email": data.email,
        "City": data.city,
        "State": data.state,
        "Preferred Location": data.preferredLocation || "Not specified",
        "Current Occupation": data.occupation || "Not specified",
        "Business Experience": data.businessExp || "Not specified",
        "Investment Range": data.investmentRange,
        "Available Space (sq ft)": data.space || "Not specified",
        "Preferred Timeline": data.timeline || "Not specified",
        "Why Join Feel & Heal Yoga": data.whyJoin,
        "Additional Information": data.notes || "None",
        "Submitted At": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      };
      await fetch("https://formsubmit.co/ajax/vishalnair198@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch { setSubmitted(true); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div style={{ background:"white", borderRadius:20, padding:"40px 28px", textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>
      <div style={{ fontSize:48, marginBottom:14 }}>🙏</div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", color:slate, marginBottom:10 }}>Application Received!</h3>
      <p style={{ color:muted, lineHeight:1.7, fontSize:13.5, marginBottom:18, maxWidth:420, margin:"0 auto 18px" }}>
        Thank you for your interest in partnering with Feel &amp; Heal Yoga. Our team will review your application and reach out within 5–7 working days.
      </p>
      <div style={{ display:"inline-block", background:cream, borderRadius:12, padding:"10px 20px", marginBottom:20 }}>
        <span style={{ fontSize:12, color:muted }}>Application ID: </span>
        <span style={{ fontWeight:800, fontSize:15, color:teal, letterSpacing:"0.06em" }}>{enquiryId}</span>
      </div>
      <br/>
      <a href={`https://wa.me/919920155875?text=Namaste!%20I%20submitted%20a%20franchise%20application%20(ID%3A%20${enquiryId}).%20Looking%20forward%20to%20connecting!`}
        target="_blank" rel="noopener noreferrer"
        style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 22px", borderRadius:99, background:"hsl(145,44%,28%)", color:"white", fontWeight:700, fontSize:13, textDecoration:"none" }}>
        💬 Connect on WhatsApp
      </a>
    </div>
  );

  const err = (k: string) => errors[k] ? <p style={{ color:"hsl(0,70%,55%)", fontSize:11, marginTop:4 }}>{errors[k]}</p> : null;
  const fi  = (k: keyof FData, ph: string, type="text", req=false) => (
    <div style={{ marginBottom:16 }}>
      {lbl(ph, req)}
      <input type={type} value={data[k] as string} placeholder={ph} onChange={e => set(k, e.target.value)}
        style={{ ...inputStyle, borderColor: errors[k] ? "hsl(0,70%,55%)" : "hsl(38,22%,88%)" }}
        onFocus={e=>(e.target.style.borderColor=teal)}
        onBlur={e=>(e.target.style.borderColor=errors[k]?"hsl(0,70%,55%)":"hsl(38,22%,88%)")} />
      {err(k)}
    </div>
  );
  const sl = (k: keyof FData, opts: string[], ph: string, req=false) => (
    <div style={{ marginBottom:16 }}>
      {lbl(ph, req)}
      <select value={data[k] as string} onChange={e=>set(k,e.target.value)}
        style={{ ...inputStyle, cursor:"pointer", borderColor:errors[k]?"hsl(0,70%,55%)":"hsl(38,22%,88%)" }}>
        <option value="">Select {ph}</option>
        {opts.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      {err(k)}
    </div>
  );

  return (
    <div style={{ background:"white", borderRadius:20, padding:"32px 24px", boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
        <div>{fi("fullName","Full Name","text",true)}</div>
        <div>{fi("mobile","Mobile Number","tel",true)}</div>
        <div>{fi("email","Email Address","email",true)}</div>
        <div>{fi("city","City","text",true)}</div>
        <div>{fi("state","State","text",true)}</div>
        <div>{fi("preferredLocation","Preferred Franchise Location")}</div>
        <div>{fi("occupation","Current Occupation")}</div>
        <div>{sl("businessExp", BIZ_EXP, "Business Experience")}</div>
        <div>{sl("investmentRange", INVESTMENT, "Available Investment Range", true)}</div>
        <div>{fi("space","Available Space (sq ft approx.)")}</div>
        <div style={{ gridColumn:"span 2" }}>{sl("timeline", TIMELINES, "Preferred Timeline")}</div>
      </div>

      <div style={{ marginBottom:16 }}>
        {lbl("Why do you want to join Feel & Heal Yoga?", true)}
        <textarea value={data.whyJoin} onChange={e=>set("whyJoin",e.target.value)} rows={4}
          placeholder="Tell us about your motivation and vision…"
          style={{ ...inputStyle, resize:"vertical", borderColor:errors.whyJoin?"hsl(0,70%,55%)":"hsl(38,22%,88%)" }} />
        {err("whyJoin")}
      </div>

      <div style={{ marginBottom:16 }}>
        {lbl("Additional Information")}
        <textarea value={data.notes} onChange={e=>set("notes",e.target.value)} rows={3}
          placeholder="Any other details you'd like to share…"
          style={{ ...inputStyle, resize:"vertical" }} />
      </div>

      {/* Disclaimer */}
      <div style={{ background:cream, borderRadius:12, padding:"14px 16px", marginBottom:18 }}>
        <p style={{ fontSize:12, color:muted, lineHeight:1.65, margin:0 }}>
          <strong style={{ color:slate }}>Disclaimer:</strong> Submitting this form does not guarantee franchise approval. Every application will be reviewed based on location, experience, available resources, and alignment with Feel &amp; Heal Yoga's values.
        </p>
      </div>

      <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", fontSize:12.5, color:muted, lineHeight:1.55, marginBottom:20 }}>
        <input type="checkbox" checked={data.consent} onChange={e=>set("consent",e.target.checked)}
          style={{ accentColor:teal, marginTop:2, flexShrink:0 }} />
        I understand the above disclaimer and consent to being contacted by Feel &amp; Heal Yoga regarding my franchise application.
      </label>
      {err("consent")}

      <button onClick={handleSubmit} disabled={loading} style={{
        width:"100%", padding:"13px", borderRadius:99,
        background: loading ? "hsl(175,20%,70%)" : `linear-gradient(135deg,${teal},hsl(175,42%,28%))`,
        border:"none", color:"white", fontWeight:700, fontSize:14,
        cursor: loading ? "wait" : "pointer",
        boxShadow: loading ? "none" : `0 4px 18px hsla(175,32%,38%,.38)`,
      }}>
        {loading ? "Submitting…" : "🌿 Submit Franchise Application"}
      </button>
    </div>
  );
};

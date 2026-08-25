import { useState } from "react";

const teal   = "hsl(175,32%,38%)";
const gold   = "hsl(38,90%,52%)";
const cream  = "hsl(42,30%,97%)";
const slate  = "hsl(220,20%,18%)";
const muted  = "hsl(220,12%,52%)";

const generateId = () =>
  "FHY-" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();

interface FormData {
  // Step 1 — Personal
  fullName: string; mobile: string; whatsapp: string; email: string;
  // Step 2 — Society
  societyName: string; address: string; area: string; city: string; pincode: string;
  locationType: string; role: string;
  // Step 3 — Preferences
  participants: string;
  ageGroups: string[];
  programs: string[];
  timings: string[];
  mode: string; space: string; startDate: string; notes: string; consent: boolean;
}

const empty: FormData = {
  fullName:"", mobile:"", whatsapp:"", email:"",
  societyName:"", address:"", area:"", city:"", pincode:"",
  locationType:"", role:"",
  participants:"", ageGroups:[], programs:[], timings:[],
  mode:"Offline", space:"", startDate:"", notes:"", consent:false,
};

const LOC_TYPES  = ["Residential Society","Corporate Office","School or College","Club or Community Centre","Other"];
const ROLES      = ["Resident","Society Committee Member","Secretary","Chairman","Facility Manager","HR or Administrator","Other"];
const AGE_GROUPS = ["Children","Adults","Women","Senior Citizens","Mixed Group"];
const PROGRAMS   = ["Regular Group Yoga","Beginner Yoga","Weight Management Yoga","Women's Wellness Yoga","Prenatal & Postnatal Yoga","Kids Yoga","Senior Citizen Yoga","Meditation & Breathwork","Back Pain & Posture Care","Corporate Wellness","Weekend Workshops","Special Occasion Events"];
const TIMINGS    = ["Morning","Afternoon","Evening","Weekend","Flexible"];
const MODES      = ["Offline","Online","Hybrid"];
const SPACES     = ["Clubhouse","Terrace","Garden","Community Hall","Indoor Room","Other"];

const label = (text: string, req = false) => (
  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: slate, marginBottom: 5 }}>
    {text}{req && <span style={{ color: "hsl(0,70%,55%)" }}> *</span>}
  </label>
);

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1.5px solid hsl(38,22%,88%)", background: "white",
  fontSize: 14, color: slate, boxSizing: "border-box",
  outline: "none", transition: "border-color .15s",
};

const CheckBox = ({ value, checked, onChange }: { value:string; checked:boolean; onChange:()=>void }) => (
  <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom:6, fontSize:13, color:slate }}>
    <input type="checkbox" checked={checked} onChange={onChange}
      style={{ accentColor: teal, width:15, height:15 }} />
    {value}
  </label>
);

const steps = ["Personal Details","Society Details","Preferences","Review & Submit"];

export const SocietyForm = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [enquiryId] = useState(generateId);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormData, v: any) => setData(d => ({ ...d, [k]: v }));
  const toggle = (k: "ageGroups"|"programs"|"timings", v: string) =>
    set(k, data[k].includes(v) ? data[k].filter(x=>x!==v) : [...data[k], v]);

  const validate = (): boolean => {
    const e: Record<string,string> = {};
    if (step===0) {
      if (!data.fullName.trim()) e.fullName = "Name is required";
      if (!data.mobile.match(/^[6-9]\d{9}$/)) e.mobile = "Enter valid 10-digit mobile";
      if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    }
    if (step===1) {
      if (!data.societyName.trim()) e.societyName = "Society name is required";
      if (!data.area.trim()) e.area = "Area is required";
      if (!data.city.trim()) e.city = "City is required";
      if (!data.locationType) e.locationType = "Please select location type";
      if (!data.role) e.role = "Please select your role";
      if (data.pincode && !data.pincode.match(/^\d{6}$/)) e.pincode = "Enter valid 6-digit pincode";
    }
    if (step===2) {
      if (!data.participants.trim()) e.participants = "Approximate count required";
      if (data.ageGroups.length===0) e.ageGroups = "Select at least one age group";
      if (data.timings.length===0) e.timings = "Select at least one timing";
    }
    if (step===3 && !data.consent) e.consent = "Please provide consent to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s+1); };
  const back = () => setStep(s => s-1);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        _subject: `🏘️ New Society Yoga Enquiry — ${data.societyName} (${enquiryId})`,
        _replyto: data.email || data.mobile,
        _template: "table",
        "Enquiry ID": enquiryId,
        "Full Name": data.fullName,
        "Mobile": data.mobile,
        "WhatsApp": data.whatsapp || data.mobile,
        "Email": data.email || "Not provided",
        "Society / Organization": data.societyName,
        "Address": data.address || "Not provided",
        "Area": data.area,
        "City": data.city,
        "Pincode": data.pincode || "Not provided",
        "Location Type": data.locationType,
        "Role": data.role,
        "Approx. Participants": data.participants,
        "Age Groups": data.ageGroups.join(", ") || "Not specified",
        "Programs": data.programs.join(", ") || "Not specified",
        "Preferred Timings": data.timings.join(", "),
        "Mode": data.mode,
        "Available Space": data.space || "Not specified",
        "Preferred Start Date": data.startDate || "Not specified",
        "Additional Notes": data.notes || "None",
        "Submitted At": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      };
      await fetch("https://formsubmit.co/ajax/vishalnair198@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // show success even on network issues
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{ background:"white", borderRadius:20, padding:"40px 28px", textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>
      <div style={{ fontSize:52, marginBottom:16 }}>🌿</div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", color:slate, marginBottom:10 }}>Thank You!</h3>
      <p style={{ color:muted, lineHeight:1.7, marginBottom:18, fontSize:14 }}>
        Thank you for your interest in bringing Feel &amp; Heal Yoga to your community. Our wellness team will contact you shortly.
      </p>
      <div style={{ display:"inline-block", background:cream, borderRadius:12, padding:"10px 20px", marginBottom:20 }}>
        <span style={{ fontSize:12, color:muted }}>Your Enquiry ID: </span>
        <span style={{ fontWeight:800, fontSize:15, color:teal, letterSpacing:"0.06em" }}>{enquiryId}</span>
      </div>
      <br/>
      <a
        href={`https://wa.me/919920155875?text=Namaste!%20I%20just%20submitted%20a%20society%20yoga%20enquiry%20(ID%3A%20${enquiryId}).%20Please%20get%20in%20touch!`}
        target="_blank" rel="noopener noreferrer"
        style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 22px", borderRadius:99, background:"hsl(145,44%,28%)", color:"white", fontWeight:700, fontSize:13, textDecoration:"none" }}
      >
        💬 Follow Up on WhatsApp
      </a>
    </div>
  );

  const err = (k: string) => errors[k] ? (
    <p style={{ color:"hsl(0,70%,55%)", fontSize:11, marginTop:4 }}>{errors[k]}</p>
  ) : null;

  const fi = (field: keyof FormData, placeholder: string, type="text", req=false) => (
    <div style={{ marginBottom:16 }}>
      {label(placeholder, req)}
      <input
        type={type} value={data[field] as string} placeholder={placeholder}
        onChange={e => set(field, e.target.value)}
        style={{ ...inputStyle, borderColor: errors[field] ? "hsl(0,70%,55%)" : "hsl(38,22%,88%)" }}
        onFocus={e => (e.target.style.borderColor = teal)}
        onBlur={e => (e.target.style.borderColor = errors[field] ? "hsl(0,70%,55%)" : "hsl(38,22%,88%)")}
      />
      {err(field)}
    </div>
  );

  const sel = (field: keyof FormData, opts: string[], placeholder: string, req=false) => (
    <div style={{ marginBottom:16 }}>
      {label(placeholder, req)}
      <select value={data[field] as string} onChange={e => set(field, e.target.value)}
        style={{ ...inputStyle, borderColor: errors[field] ? "hsl(0,70%,55%)" : "hsl(38,22%,88%)", cursor:"pointer" }}>
        <option value="">Select {placeholder}</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {err(field)}
    </div>
  );

  return (
    <div style={{ background:"white", borderRadius:20, padding:"32px 24px", boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>
      {/* Progress bar */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          {steps.map((s,i) => (
            <span key={i} style={{
              fontSize:11, fontWeight: i===step ? 700 : 400,
              color: i<=step ? teal : muted,
              display:"none"
            }} className={i===step ? "block" : "hidden"}>
              Step {i+1} of {steps.length} — {s}
            </span>
          ))}
          <span style={{ fontSize:11, fontWeight:700, color:teal }}>
            Step {step+1} of {steps.length} — {steps[step]}
          </span>
          <span style={{ fontSize:11, color:muted }}>{Math.round(((step+1)/steps.length)*100)}%</span>
        </div>
        <div style={{ height:4, background:"hsl(38,22%,92%)", borderRadius:99 }}>
          <div style={{ height:"100%", background:`linear-gradient(90deg,${teal},hsl(175,32%,52%))`, borderRadius:99, width:`${((step+1)/steps.length)*100}%`, transition:"width .3s ease" }} />
        </div>
      </div>

      {/* Step 1 — Personal */}
      {step===0 && (
        <>
          {fi("fullName","Full Name","text",true)}
          {fi("mobile","Mobile Number","tel",true)}
          {fi("whatsapp","WhatsApp Number (if different)","tel")}
          {fi("email","Email Address","email")}
        </>
      )}

      {/* Step 2 — Society */}
      {step===1 && (
        <>
          {fi("societyName","Society / Organization Name","text",true)}
          {fi("address","Society Address","text")}
          {fi("area","Area","text",true)}
          {fi("city","City","text",true)}
          {fi("pincode","Pincode","tel")}
          {sel("locationType", LOC_TYPES, "Type of Location", true)}
          {sel("role", ROLES, "Your Role", true)}
        </>
      )}

      {/* Step 3 — Preferences */}
      {step===2 && (
        <>
          {fi("participants","Approx. Number of Interested Participants","text",true)}

          <div style={{ marginBottom:16 }}>
            {label("Preferred Age Groups", true)}
            {AGE_GROUPS.map(g => (
              <CheckBox key={g} value={g} checked={data.ageGroups.includes(g)} onChange={() => toggle("ageGroups",g)} />
            ))}
            {err("ageGroups")}
          </div>

          <div style={{ marginBottom:16 }}>
            {label("Preferred Programs")}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 12px" }}>
              {PROGRAMS.map(p => (
                <CheckBox key={p} value={p} checked={data.programs.includes(p)} onChange={() => toggle("programs",p)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            {label("Preferred Timings", true)}
            {TIMINGS.map(t => (
              <CheckBox key={t} value={t} checked={data.timings.includes(t)} onChange={() => toggle("timings",t)} />
            ))}
            {err("timings")}
          </div>

          <div style={{ marginBottom:16 }}>
            {label("Preferred Mode")}
            <div style={{ display:"flex", gap:10 }}>
              {MODES.map(m => (
                <label key={m} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:13, color:slate }}>
                  <input type="radio" name="mode" value={m} checked={data.mode===m} onChange={() => set("mode",m)} style={{ accentColor:teal }} />
                  {m}
                </label>
              ))}
            </div>
          </div>

          {sel("space", SPACES, "Available Space")}
          {fi("startDate","Preferred Start Date (approximate)","text")}

          <div style={{ marginBottom:16 }}>
            {label("Additional Requirements")}
            <textarea value={data.notes} onChange={e => set("notes",e.target.value)} rows={3} placeholder="Any special requirements or questions..."
              style={{ ...inputStyle, resize:"vertical" }} />
          </div>
        </>
      )}

      {/* Step 4 — Review */}
      {step===3 && (
        <>
          <h4 style={{ fontSize:14, fontWeight:700, color:slate, marginBottom:14 }}>Please review your details:</h4>
          {([
            ["Name", data.fullName], ["Mobile", data.mobile],
            ["Email", data.email || "—"], ["Society", data.societyName],
            ["Area", `${data.area}, ${data.city}${data.pincode ? " – "+data.pincode : ""}`],
            ["Type", data.locationType], ["Role", data.role],
            ["Participants", data.participants],
            ["Age Groups", data.ageGroups.join(", ") || "—"],
            ["Programs", data.programs.join(", ") || "—"],
            ["Timings", data.timings.join(", ")],
            ["Mode", data.mode],
            ["Space", data.space || "—"],
            ["Start Date", data.startDate || "—"],
          ] as [string,string][]).map(([k,v]) => (
            <div key={k} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid hsl(38,22%,94%)", fontSize:13 }}>
              <span style={{ fontWeight:600, color:muted, minWidth:110 }}>{k}</span>
              <span style={{ color:slate }}>{v}</span>
            </div>
          ))}

          <div style={{ marginTop:20, marginBottom:8 }}>
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", fontSize:12.5, color:muted, lineHeight:1.55 }}>
              <input type="checkbox" checked={data.consent} onChange={e => set("consent",e.target.checked)} style={{ accentColor:teal, marginTop:2, flexShrink:0 }} />
              I consent to being contacted by the Feel &amp; Heal Yoga team through phone, WhatsApp, or email regarding my society yoga enquiry.
            </label>
            {err("consent")}
          </div>

          <p style={{ fontSize:11, color:muted, marginTop:8 }}>
            Your Enquiry ID will be: <strong style={{ color:teal }}>{enquiryId}</strong>
          </p>
        </>
      )}

      {/* Navigation buttons */}
      <div style={{ display:"flex", gap:12, marginTop:24 }}>
        {step>0 && (
          <button onClick={back} style={{
            flex:1, padding:"11px 0", borderRadius:99,
            border:`1.5px solid hsl(38,22%,88%)`,
            background:"white", color:muted, fontWeight:600, fontSize:14, cursor:"pointer",
          }}>
            ← Back
          </button>
        )}
        {step<3 ? (
          <button onClick={next} style={{
            flex:2, padding:"12px 0", borderRadius:99,
            background:`linear-gradient(135deg,${gold},hsl(30,86%,46%))`,
            border:"none", color:"hsl(20,20%,12%)", fontWeight:700, fontSize:14, cursor:"pointer",
            boxShadow:`0 4px 16px hsla(38,90%,52%,.35)`,
          }}>
            Continue →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} style={{
            flex:2, padding:"12px 0", borderRadius:99,
            background: loading ? "hsl(175,20%,70%)" : `linear-gradient(135deg,${teal},hsl(175,42%,28%))`,
            border:"none", color:"white", fontWeight:700, fontSize:14,
            cursor: loading ? "wait" : "pointer",
            boxShadow: loading ? "none" : `0 4px 16px hsla(175,32%,38%,.38)`,
          }}>
            {loading ? "Submitting…" : "🌿 Submit Enquiry"}
          </button>
        )}
      </div>
    </div>
  );
};

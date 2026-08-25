import { useState } from "react";

const slate = "hsl(220,20%,18%)";
const muted = "hsl(220,12%,52%)";
const teal  = "hsl(175,32%,38%)";
const cream = "hsl(42,30%,97%)";

interface FAQItem { q: string; a: string; }

export const societyFAQs: FAQItem[] = [
  {
    q: "How many participants are required to start a society yoga program?",
    a: "We typically recommend a minimum of 8–10 interested participants to start a group session. However, this can vary based on the program and location. Contact us to discuss your specific situation.",
  },
  {
    q: "Can we arrange a trial session before committing?",
    a: "Absolutely! We offer an introductory session or free consultation to help you understand the program and experience our teaching style before making any commitment.",
  },
  {
    q: "Are the classes suitable for complete beginners?",
    a: "Yes! Our programs are designed to be beginner-friendly. No prior yoga experience is needed. Our instructors guide every participant patiently at their own pace.",
  },
  {
    q: "Can children and senior citizens participate?",
    a: "Definitely. We offer specialized programs designed specifically for kids (age-appropriate yoga, games, and breathing) and for senior citizens (gentle yoga, joint mobility, and balance). Separate or mixed batches can be arranged.",
  },
  {
    q: "Do you provide morning and evening batches?",
    a: "Yes, we offer flexible morning and evening batches, and even weekend sessions based on your society's preference and the instructor's availability.",
  },
  {
    q: "Can the society choose its own class timings?",
    a: "Yes, timing is flexible and can be decided mutually based on participant availability and instructor schedule. We'll work with you to find the most convenient time.",
  },
  {
    q: "Are yoga mats and equipment provided?",
    a: "Participants are generally encouraged to bring their own mats. For special events or workshops, we can arrange mats and props. Our team will discuss logistics with you during the consultation.",
  },
  {
    q: "What is the pricing structure?",
    a: "Pricing is customized based on the number of participants, class frequency, selected program, and location. Our team will share a detailed proposal after the initial consultation — no hidden charges.",
  },
  {
    q: "Do you offer weekend wellness workshops?",
    a: "Yes! We offer special weekend wellness workshops, yoga events for festivals, and one-day retreats that can be organized for your community.",
  },
  {
    q: "Is this available outside Kharghar and Navi Mumbai?",
    a: "We primarily serve Kharghar and Navi Mumbai. For locations outside this area, please contact us and we will explore the possibility based on instructor availability. Online sessions are available across India.",
  },
];

export const franchiseFAQs: FAQItem[] = [
  {
    q: "What is the investment required for a franchise?",
    a: "The investment range varies based on location, facility size, and program scope. Our team will share detailed information after reviewing your application.",
  },
  {
    q: "Do I need prior yoga experience to open a franchise?",
    a: "A passion for wellness and community development is essential. Prior yoga teaching experience is beneficial but not mandatory — we provide training and ongoing support.",
  },
  {
    q: "What support does Feel & Heal Yoga provide to franchisees?",
    a: "We provide teacher training, curriculum, branding, marketing support, operational guidance, and ongoing mentorship to ensure your franchise thrives.",
  },
  {
    q: "How long does the franchise approval process take?",
    a: "After receiving your application, our team will review it and contact you within 5–7 working days. The full onboarding process typically takes 4–6 weeks.",
  },
];

interface SocietyFAQProps {
  items?: FAQItem[];
}

export const SocietyFAQ = ({ items = societyFAQs }: SocietyFAQProps) => {
  const [open, setOpen] = useState<number|null>(null);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          background: "white",
          borderRadius: 14,
          border: `1.5px solid ${open===i ? teal : "hsl(38,22%,90%)"}`,
          overflow:"hidden",
          boxShadow: open===i ? `0 4px 16px hsla(175,32%,38%,.12)` : "0 1px 8px rgba(0,0,0,0.04)",
          transition:"border-color .2s, box-shadow .2s",
        }}>
          <button
            onClick={() => setOpen(open===i ? null : i)}
            style={{
              width:"100%", padding:"16px 20px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              background:"none", border:"none", cursor:"pointer",
              textAlign:"left", gap:12,
            }}
          >
            <span style={{ fontSize:14, fontWeight:600, color:slate, lineHeight:1.45, flex:1 }}>{item.q}</span>
            <span style={{
              fontSize:18, color:teal, flexShrink:0, transition:"transform .25s",
              transform: open===i ? "rotate(45deg)" : "rotate(0)",
              display:"inline-block",
            }}>+</span>
          </button>
          <div style={{
            maxHeight: open===i ? 400 : 0,
            overflow:"hidden",
            transition:"max-height .3s ease",
          }}>
            <div style={{ padding:"0 20px 18px", fontSize:13.5, color:muted, lineHeight:1.7 }}>
              {item.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

import { useState, useRef, useEffect, useCallback } from "react";
import "./yogichatbot.css";

const WA = "919920155875";
const waUrl = (msg) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const WA_DEFAULT = waUrl("Namaste! 🙏 I found Feel & Heal Yoga and I'm interested in learning more about your classes.");
const GOOGLE_FORM_URL = "https://forms.gle/TMj8T1XLaY12EPRt7";

/* ── Time helpers ──────────────────────────────────────────────── */
const timeStr = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const timeGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return "Hello 🌙";
  if (h < 12) return "Good morning ☀️";
  if (h < 17) return "Good afternoon 🌤️";
  if (h < 20) return "Good evening 🌅";
  return "Good evening 🌙";
};

/* ── Knowledge Base ────────────────────────────────────────────── */
const KB = {
  timings: `🌅 **Adult Batches** (Mon – Fri)
• 6:00 – 7:00 AM  (Online & Offline)
• 8:00 – 9:00 AM  (Online & Offline)
👩 **Women's Only** (Mon – Fri)
• 10:00 – 11:00 AM  (Online & Offline)
🌙 **Evening Batch** (Mon – Fri)
• 7:30 – 8:30 PM  (Online & Offline)

🌐 All batches available both Online and Offline.`,

  location: `📍 **Offline Studio:**\nClub House, Adhiraj Garden,\nSector 5, Kharghar, Navi Mumbai – 410210\n\n🌐 **Online classes** are also available — join from anywhere in the world!`,

  about: `Feel & Heal Yoga is a certified yoga studio based in Kharghar, Navi Mumbai.\n\nOur instructors specialise in **Hatha Yoga & Vinyasa Flow**, with a holistic focus on healing, mindfulness, and personal transformation.\n\nWith small batch sizes and a caring approach, every student gets personal attention. 🙏`,

  free_trial: `Absolutely! 🎉 We offer a **FREE trial class** so you can experience the vibe before committing.\n\nNo strings attached — just show up with an open mind!\n\nYou can book instantly via our **Google Form** or message us on WhatsApp — our team will set up your slot within minutes.`,

  pricing: `Our fees are personalised based on your goals, chosen program, and batch preference.\n\nRather than a fixed list, our team loves to understand your needs first and suggest the best fit.\n\nConnect with us on WhatsApp — we'll walk you through current packages and any running offers! 😊`,

  beginner: `100% yes — beginners are always welcome! 🌱\n\nYou don't need to be flexible, fit, or have any prior experience. Our instructors guide every student patiently at their own pace.\n\nMany students join with zero yoga background and transform completely within just a few weeks. Your journey starts exactly where you are.`,

  online_offline: `We offer **both** — and you can switch anytime! 🌐📍\n\n• **Online**: Join via video call from anywhere in the world\n• **Offline**: In-person at our Kharghar studio\n\nA lot of students even mix both depending on their schedule. Very flexible!`,

  what_to_bring: `For offline classes, just bring:\n• Comfortable, stretchable clothing\n• A water bottle\n• A yoga mat (optional — extras are available)\n• An open, curious mind 🧘\n\nNo special equipment needed. You're all set!`,

  dress_code: `Wear **comfortable, stretchy clothing** — yoga pants, track pants, or leggings are perfect.\n\nJust avoid jeans or anything restrictive. Breathability is key since you'll be moving and breathing deeply! 😊`,

  benefits: `Regular yoga at Feel & Heal can help you:\n✅ Lose weight & tone your body naturally\n✅ Relieve back pain, stiffness & body aches\n✅ Reduce stress, anxiety & overthinking\n✅ Improve flexibility, strength & posture\n✅ Sleep deeply & wake up energised\n✅ Balance hormones & boost immunity\n✅ Sharpen focus & cultivate inner calm\n✅ Build a consistent wellness habit\n\nThe results speak for themselves! 🌸`,

  women_batch: `👩 **Women's Only Batch** — exclusively for women!\n\n• **Timing:** 10:00 – 11:00 AM, Mon – Fri\n• Available **Online & Offline**\n\nA safe, comfortable, and empowering space designed exclusively for women. Practice freely, build confidence, and connect with a wonderful community. 🌸`,

  injury: `If you have a health condition, injury, or medical concern — please share it with our team before starting.\n\nOur instructors carefully adapt poses to suit individual needs, ensuring a completely safe practice.\n\nYoga actually **helps many conditions** when practiced correctly — back pain, knee issues, PCOD, thyroid, and more. Our team will guide you safely. 🙏`,

  meditation: `Yes! **Pranayama** (breathing techniques) and **Dhyana** (meditation) are woven into many sessions.\n\nThese practices help students:\n• Manage stress and anxiety\n• Develop deep mindfulness\n• Cultivate lasting inner calm and clarity\n• Improve sleep quality\n\nIt's not just physical — it's a complete wellness experience. 🧘`,

  duration: `Each class runs for approximately **60 minutes**.\n\nThe Weight Loss Program is also 60 minutes, 4 days a week — structured and progressive for results.`,

  group_size: `Batches are intentionally **small** 🙏\n\nThis isn't a crowd workout — our team keeps class sizes intimate so every student gets genuine individual attention.\n\nYou'll never feel lost in a big group here.`,

  weight_loss: `Weight loss is one of the most common goals our team works with! 🌿\n\nYour weight loss journey happens within the **regular batch timings** (Mon – Fri), where our instructors incorporate dynamic yoga sequences, pranayama, and lifestyle guidance tailored to your goals.\n\nMany students have seen significant results:\n• Fat loss and body toning\n• Improved metabolism\n• Reduced bloating\n• Better eating habits naturally\n\nThe best first step? A **free trial class** — see for yourself! 💪`,

  contact: `You can reach Team Feel & Heal Yoga directly:\n📞 **+91 99201 55875** (Call or WhatsApp)\n✉️ feelandhealyoga@gmail.com\n📍 Kharghar, Navi Mumbai\n\nWe're typically available **Mon–Sat, 6 AM – 9 PM**. Don't hesitate to reach out — we're very responsive! 💬`,

  hormones: `Yoga is **deeply effective** for hormonal balance! 🌸\n\nSpecific sequences and pranayama practices at Feel & Heal can help with:\n• PCOD/PCOS management\n• Thyroid regulation\n• Stress hormone (cortisol) reduction\n• Menstrual health and regularity\n• Menopause symptoms\n\nSessions are tailored to your specific needs — many students have seen wonderful results with these exact concerns. 🌿`,
};

/* ── Intent Definitions ────────────────────────────────────────── */
const intents = [
  {
    id: "greeting",
    keys: ["hi", "hello", "hey", "namaste", "hii", "helo", "good morning", "good evening", "good afternoon", "sup", "howdy", "namaskar"],
    answer: () => `${timeGreeting()}! Namaste 🙏\n\nI'm **Yogi**, your AI-powered wellness guide for Feel & Heal Yoga.\n\nI can help you discover the right class, check timings, learn about our batches, and more!\n\nWhat would you like to explore? 🌿`,
    chips: ["⏰ Class Timings", "🍯 Free Trial", "💪 Weight Loss", "👩 Women's Batch", "🌿 Benefits"],
    noLead: true,
  },
  {
    id: "farewell",
    keys: ["bye", "goodbye", "see you", "thanks", "thank you", "thankyou", "thnks", "thx", "great", "perfect", "awesome", "amazing", "ok thanks", "got it"],
    answer: (name) =>
      name
        ? `You're welcome, **${name}**! 🌸\n\nWishing you a beautiful yoga journey. Our team is always just a WhatsApp message away. See you on the mat! 🧘`
        : `You're most welcome! 🌸\n\nWishing you a wonderful wellness journey. Feel free to come back anytime — and we'll keep a free trial slot warm for you! 🧘`,
    chips: ["🍯 Book Free Trial", "💬 WhatsApp"],
    noLead: true,
  },
  {
    id: "timing",
    keys: ["time", "timing", "batch", "class", "schedule", "slot", "morning", "evening", "when", "6am", "8am", "7pm", "10am", "what time", "class time"],
    answer: () => KB.timings,
    followUp: "Would you like to book one of these slots? 😊",
    chips: ["🍯 Book Free Trial", "📍 Location", "👩 Women's Batch"],
  },
  {
    id: "location",
    keys: ["where", "location", "address", "place", "studio", "kharghar", "navi mumbai", "offline", "come", "visit", "directions", "map"],
    answer: () => KB.location,
    followUp: "Would you like to come in for a free trial? 🌿",
    chips: ["🍯 Book Free Trial", "⏰ Class Timings"],
  },
  {
    id: "online",
    keys: ["online", "virtual", "zoom", "remote", "video", "anywhere", "home", "digital", "internet"],
    answer: () => KB.online_offline,
    chips: ["🍯 Book Free Trial", "⏰ See Timings"],
  },
  {
    id: "free_trial",
    keys: ["free", "trial", "try", "demo", "sample", "first class", "test", "free class", "trial class", "free trial"],
    answer: () => KB.free_trial,
    chips: [],
    cta: "form",
    ctaText: "📋 Book Free Trial via Google Form",
    ctaMsg: "Namaste! 🙏 I'd like to book a FREE trial yoga class. Could you please help me set up a slot?",
  },
  {
    id: "pricing",
    keys: ["fee", "price", "cost", "charge", "rate", "how much", "package", "offer", "fees", "monthly", "payment"],
    answer: () => KB.pricing,
    chips: ["🍯 Book Free Trial", "💬 WhatsApp"],
    triggerLead: true,
  },
  {
    id: "beginner",
    keys: ["beginner", "new", "start", "never", "first time", "no experience", "fresh", "absolute", "zero", "brand new", "newbie", "just starting"],
    answer: () => KB.beginner,
    followUp: "Shall I set up a free trial so you can experience it firsthand? 🌱",
    chips: ["🍯 Yes, Book Trial!", "⏰ See Timings"],
  },
  {
    id: "bring",
    keys: ["bring", "carry", "mat", "equipment", "need", "prepare", "what to", "carry along"],
    answer: () => KB.what_to_bring,
    chips: ["⏰ See Timings", "🍯 Book Free Trial"],
  },
  {
    id: "dress",
    keys: ["dress", "wear", "clothes", "clothing", "outfit", "attire", "what should i wear"],
    answer: () => KB.dress_code,
    chips: ["⏰ See Timings", "🍯 Book Free Trial"],
  },
  {
    id: "benefits",
    keys: ["benefit", "help", "loss", "stress", "anxiety", "pain", "back", "flexible", "stamina", "energy", "immune", "good for", "does yoga help", "why yoga"],
    answer: () => KB.benefits,
    followUp: "Ready to start your healing journey? 🌸",
    chips: ["🍯 Book Free Trial", "⏰ See Timings"],
  },
  {
    id: "hormones",
    keys: ["hormone", "pcod", "pcos", "thyroid", "period", "menstrual", "menopause", "cortisol", "hormonal"],
    answer: () => KB.hormones,
    followUp: "Would you like to speak with our team about your specific condition?",
    chips: ["💬 WhatsApp", "🍯 Book Free Trial"],
    triggerLead: true,
  },
  {
    id: "weight_loss",
    keys: ["weight", "fat", "burn", "slim", "tone", "inch", "obesity", "overweight", "reduce weight", "lose weight", "weight gain"],
    answer: () => KB.weight_loss,
    followUp: "Would you like to book a free trial to get started? 💪",
    chips: ["🍯 Book Free Trial", "⏰ See Timings"],
  },
  {
    id: "kids",
    keys: ["kid", "child", "children", "son", "daughter", "age", "boy", "girl", "school", "teenager", "teen", "young"],
    answer: () => `Children are welcome to join our **regular adult batches**! 🌱\n\nOur instructors give individual attention to every student in a warm, inclusive environment.\n\nFor specific queries about kids joining, please reach out to our team on WhatsApp. 🙏`,
    followUp: "Would you like to book a trial for your child?",
    chips: ["🍯 Book Free Trial", "⏰ See Timings"],
  },
  {
    id: "injury",
    keys: ["injury", "health", "condition", "medical", "diabetes", "bp", "pregnant", "spine", "knee", "safe", "chronic", "arthritis", "sciatica", "heart"],
    answer: () => KB.injury,
    followUp: "Would you like to speak directly with our team about your condition?",
    chips: ["💬 WhatsApp", "🍯 Book Trial"],
    triggerLead: true,
  },
  {
    id: "meditation",
    keys: ["meditation", "breathe", "pranayama", "mindful", "calm", "dhyana", "breath", "breathing", "inner peace", "relax", "relaxation"],
    answer: () => KB.meditation,
    chips: ["⏰ See Timings", "🍯 Book Free Trial"],
  },
  {
    id: "duration",
    keys: ["how long", "duration", "minute", "hour", "length", "long is", "how many minutes"],
    answer: () => KB.duration,
    chips: ["⏰ See Timings", "🍯 Book Free Trial"],
  },
  {
    id: "group",
    keys: ["group", "batch size", "how many", "people", "class size", "crowd", "big class", "small class"],
    answer: () => KB.group_size,
    chips: ["⏰ See Timings", "🍯 Book Free Trial"],
  },
  {
    id: "personal_session",
    keys: [
      "personal training", "personal session", "personal sesson",
      "private session", "private class", "private training",
      "one on one", "one-on-one", "1 on 1", "1on1", "1-on-1",
      "personal", "private", "individual", "solo", "dedicated",
      "exclusive", "customised", "personalized", "personalised",
      "custom session", "my own", "just me", "alone", "training", "session", "sessions"
    ],
    leadType: "personal",
    answer: (name) => name
      ? `Thank you for your enquiry, **${name}**! 🙏\n\n**Personal 1-on-1 Sessions** at Feel & Heal Yoga are completely tailored to your specific goals, body type, health condition, and schedule — with flexible timings set at mutual convenience.\n\nOur team would love to understand your requirements better and suggest the perfect plan for you.`
      : `Thank you for your enquiry! 🙏\n\n**Personal 1-on-1 Sessions** at Feel & Heal Yoga are completely tailored to your specific goals, body type, health condition, and schedule — with flexible timings set at mutual convenience.\n\nOur team would love to understand your requirements better and suggest the perfect plan for you.`,
    followUp: "Could you share your contact details so our team can reach out to you? 🌿",
    chips: [],
    triggerLead: true,
  },
  {
    id: "about",
    keys: ["about", "who", "instructor", "teacher", "certified", "ryt", "background", "experience", "qualified"],
    answer: () => KB.about,
    followUp: "Would you like to connect with our team directly?",
    chips: ["💬 WhatsApp", "🍯 Book Free Trial"],
    triggerLead: true,
  },
  {
    id: "contact",
    keys: ["contact", "phone", "email", "number", "reach", "call", "message", "whatsapp", "get in touch"],
    answer: () => KB.contact,
    chips: ["💬 WhatsApp", "📍 Location"],
  },
  {
    id: "women_batch",
    keys: ["women", "ladies", "female", "woman", "women only", "women's", "10 am", "ladies batch", "women batch"],
    answer: () => KB.women_batch,
    followUp: "Would you like to book a slot for the Women's Only batch? 🌸",
    chips: ["🍯 Book Free Trial", "⏰ Class Timings"],
  },
  {
    id: "join",
    keys: ["join", "enroll", "register", "sign up", "book", "yes", "interested", "want to", "i want", "i would like", "let me join"],
    answer: null,
    triggerLead: true,
  },
];

const DEFAULT_CHIPS = [
  "⏰ Class Timings",
  "🍯 Free Trial",
  "💪 Weight Loss",
  "🌿 Benefits",
  "👩 Women's Batch",
];

const CHIP_MAP = {
  "⏰ class timings": "class timings",
  "see timings": "class timings",
  "⏰ see timings": "class timings",
  "book a slot": "join",
  "book online": "online",
  "📍 location": "location",
  "book offline": "location",
  "book free trial": "free trial",
  "🍯 book free trial": "free trial",
  "🍯 yes, book trial!": "free trial",
  "book trial": "free trial",
  "free trial": "free trial",
  "🍯 free trial": "free trial",
  "💪 weight loss": "weight loss",
  "book weight loss slot": "weight loss",
  "💪 book weight loss slot": "weight loss",
  "👩 women's batch": "women_batch",
  "👩 book women's": "women_batch",
  "🌿 benefits": "benefit",
  "💬 whatsapp": "__wa__",
};

/* ── Smart Intent Engine ─────────────────────────────────────────── */
function scoreIntent(msg, intent) {
  const lower = msg.toLowerCase();
  let score = 0;
  for (const key of intent.keys) {
    // Word-boundary matching: prevents "son" firing inside "personal" or "session"
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?<![a-z])${escaped}(?![a-z])`);
    if (pattern.test(lower)) {
      score += key.split(" ").length;
    }
  }
  return score;
}


function findBestIntent(msg) {
  let best = null;
  let bestScore = 0;
  for (const intent of intents) {
    const s = scoreIntent(msg, intent);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  }
  return bestScore > 0 ? best : null;
}

/* ── Helpers ─────────────────────────────────────────────────────── */
const phoneRe = /^[6-9]\d{9}$/;
const validatePhone = (s) => phoneRe.test(s.replace(/[\s\-()]/g, ""));

const LEAD_STEPS = ["name", "phone", "timing"];
const LEAD_LABELS = {
  name:   "Step 1 of 3 — Your name",
  phone:  "Step 2 of 3 — Mobile number",
  timing: "Step 3 of 3 — Preferred timing",
};
const LEAD_PROGRESS = { name: 33, phone: 66, timing: 100 };

const TYPING_SPEED = 18;
const typingDelay = (text) =>
  Math.min(400 + text.length * TYPING_SPEED, 2200);

/* ── WhatsApp SVG Icon ───────────────────────────────────────────── */
const WAIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── Component ────────────────────────────────────────────────────── */
export default function YogiChatbot() {
  const [open, setOpen]             = useState(false);
  const [unread, setUnread]         = useState(1);
  const [messages, setMessages]     = useState([
    {
      from: "bot",
      text: `${timeGreeting()} ✨ I'm **Yogi** — Feel & Heal Yoga's intelligent AI wellness assistant.\n\nI'm trained to instantly answer anything: class timings, free trials, batch types, weight loss yoga, fees, and more. No hold music. No waiting. Just smart answers. 🧠🌿\n\nWhat would you like to know?`,
      time: timeStr(),
    },
  ]);
  const [chips, setChips]           = useState(DEFAULT_CHIPS);
  const [cta, setCta]               = useState(null);
  const [input, setInput]           = useState("");
  const [typing, setTyping]         = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [step, setStep]             = useState("");
  const [lead, setLead]             = useState({ name: "", phone: "", timing: "" });
  const [userName, setUserName]     = useState("");
  const [ctx, setCtx]               = useState([]);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [leadType, setLeadType]         = useState("batch");
  const [isListening, setIsListening]   = useState(false);
  const [micStatus, setMicStatus]       = useState("");
  const messagesEndRef                  = useRef(null);
  const idleTimerRef                    = useRef(null);
  const recognitionRef                  = useRef(null);

  // ── Callbacks declared BEFORE effects that reference them ──────────
  const touch = () => setLastActivity(Date.now());

  const addMsg = useCallback((from, text) => {
    setMessages((p) => [...p, { from, text, time: timeStr() }]);
  }, []);

  const addSpecial = useCallback((type, data) => {
    setMessages((p) => [...p, { from: "bot", special: type, data, time: timeStr() }]);
  }, []);

  const botReply = useCallback((text, delay) => {
    const d = delay ?? typingDelay(text);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMsg("bot", text);
    }, d);
  }, [addMsg]);

  // ── Effects ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => { if (open) setUnread(0); }, [open]);

  // Listen for Book Free Trial button in hero/nav
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setUnread(0);
      setTimeout(() => {
        botReply(`🎉 Great news! **Yogi AI** has reserved a FREE trial class for you!\n\nYour first session is completely free — just show up with an open mind and we'll handle everything else. 🌿\n\nTap below to confirm your spot instantly:`, 300);
        setTimeout(() => {
          addSpecial("gform", { text: "📋 Book Your FREE Trial — Google Form", url: GOOGLE_FORM_URL });
          setChips(["⏰ Class Timings", "📍 Location"]);
        }, 1600);
      }, 350);
    };
    window.addEventListener("open-yogi-trial", handler);
    return () => window.removeEventListener("open-yogi-trial", handler);
  }, [botReply, addSpecial]);

  useEffect(() => {
    if (!open || collecting) return;
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      const nudge = userName
        ? `Still there, **${userName}**? 😊 If you'd like, I can book a free trial for you in just a few seconds!`
        : `Still thinking? 😊 I can book you a **free trial class** with our team — no commitment needed!`;
      addMsg("bot", nudge);
      setChips(["🎯 Book Free Trial", "⏰ See Timings"]);
    }, 55000);
    return () => clearTimeout(idleTimerRef.current);
  }, [open, lastActivity, collecting, userName, addMsg]);

  const saveLead = (l) => {
    const prev = JSON.parse(localStorage.getItem("yogi_leads") || "[]");
    localStorage.setItem("yogi_leads", JSON.stringify([...prev, { ...l, date: new Date().toISOString() }]));
  };

  const startLead = (topicMsg = null, type = "batch") => {
    setCollecting(true);
    setLeadType(type);
    setStep("name");
    setChips([]);
    setCta(null);
    const greeting = userName ? `Great, **${userName}**! 😊` : "Let's get you set up! 😊";
    const extra = topicMsg ? `\n${topicMsg}` : "";
    botReply(`${greeting}${extra}\n\nMay I know your **name** first?`, 420);
  };

  const handleLeadStep = (text) => {
    if (step === "name") {
      const name = text.trim().split(" ")[0];
      setUserName(name);
      setLead((l) => ({ ...l, name: text.trim() }));
      setStep("phone");
      botReply(`Nice to meet you, **${name}**! 🙏\n\nWhat's your **mobile number**? (Our team will reach out to you to confirm your slot)`, 380);
      return;
    }
    if (step === "phone") {
      if (!validatePhone(text)) {
        botReply("Hmm, that doesn't look right 🤔\nPlease enter a valid **10-digit** Indian mobile number.\n\nExample: 98765 43210", 300);
        return;
      }
      setLead((l) => ({ ...l, phone: text }));
      setStep("timing");
      if (leadType === "personal") {
        setChips(["🌅 Morning", "🌇 Evening", "🕐 Flexible / Any Time"]);
        botReply("Thank you! 🙏 What's your **preferred time of day** for the personal session?", 350);
      } else {
        setChips(["🌅 Morning (6–7 AM)", "🌤️ Morning (8–9 AM)", "👩 Women's Only (10–11 AM)", "🌇 Evening (7:30–8:30 PM)"]);
        botReply("Perfect! 📲 Which **batch timing** works best for you?", 350);
      }
      return;
    }
    if (step === "timing") {
      const finalLead = { ...lead, timing: text };
      setLead(finalLead);
      saveLead(finalLead);
      setCollecting(false);
      setStep("");
      setChips(["⏰ Class Timings", "🍯 Free Trial"]);
      const waMsg = leadType === "personal"
        ? `Namaste! 🙏 My name is ${finalLead.name}. I'm interested in a **Personal 1-on-1 Yoga Session**. My preferred time is ${text.replace(/[🌅🌇🕐🌤️]/g, "").trim()} and my number is ${finalLead.phone}. Kindly connect with me to discuss further. 🌿`
        : `Namaste! 🙏 My name is ${finalLead.name}. I'm interested in joining the ${text.replace(/[🌅🌤️🌇]/g, "").trim()} batch. My number is ${finalLead.phone}. Please confirm my slot! 😊`;
      const confirmMsg = `Thank you, **${finalLead.name}**! 🌸\n\nOur team will reach out to **${finalLead.phone}** shortly. You can also tap below to message us right now — everything is pre-filled! 👇`;
      botReply(confirmMsg, 600);
      setTimeout(() => {
        addSpecial("wa", { text: "💬 Confirm My Slot on WhatsApp", url: waUrl(waMsg) });
      }, 1800);
    }
  };

  const resolveIntent = (msg) => {
    touch();
    const lower = msg.toLowerCase().trim();
    const mapped = CHIP_MAP[lower];
    if (mapped === "__wa__") {
      addSpecial("wa", { text: "💬 Open WhatsApp Chat", url: WA_DEFAULT });
      setChips(DEFAULT_CHIPS);
      return;
    }
    const queryText = mapped || msg;
    const intent = findBestIntent(queryText);
    if (intent) {
      setCtx((c) => [...c.slice(-3), intent.id]);
      if (intent.noLead) {
        if (intent.answer) botReply(intent.answer(userName), typingDelay(intent.answer(userName)));
        if (intent.chips?.length) setTimeout(() => setChips(intent.chips), 500);
        else setChips(DEFAULT_CHIPS);
        setCta(null);
        return;
      }
      if (intent.triggerLead && !intent.answer) {
        startLead(null, intent.leadType || "batch");
        return;
      }
      if (intent.answer) {
        const txt = intent.answer(userName);
        botReply(txt, typingDelay(txt));
      }
      if (intent.followUp) {
        const delay = intent.answer ? typingDelay(intent.answer(userName)) + 700 : 500;
        setTimeout(() => botReply(intent.followUp, 400), delay);
      }
      if (intent.cta === "form") {
        const delay = intent.answer ? typingDelay(intent.answer(userName)) + 900 : 600;
        setTimeout(() => {
          addSpecial("gform", { text: "📋 Book Your FREE Trial — Google Form", url: GOOGLE_FORM_URL });
        }, delay);
      } else if (intent.cta === "wa") {
        const delay = intent.answer ? typingDelay(intent.answer(userName)) + 900 : 600;
        setTimeout(() => {
          addSpecial("wa", { text: intent.ctaText, url: waUrl(intent.ctaMsg) });
        }, delay);
      }
      if (intent.triggerLead && intent.answer) {
        const delay = intent.answer ? typingDelay(intent.answer(userName)) + 1600 : 900;
        setTimeout(() => startLead(null, intent.leadType || "batch"), delay);
        return;
      }
      if (intent.chips?.length) {
        setTimeout(() => setChips(intent.chips), 600);
      } else {
        setChips(DEFAULT_CHIPS);
      }
      return;
    }
    const lower2 = msg.toLowerCase();
    const topicHints = [
      { words: ["time", "class", "batch", "morning", "evening", "schedule"], chip: "⏰ Class Timings", label: "class timings" },
      { words: ["fee", "cost", "price", "charge", "pay", "how much"], chip: "💬 WhatsApp", label: "pricing" },
      { words: ["private", "personal", "one on one", "1 on 1", "solo", "individual"], chip: "💬 WhatsApp", label: "personal sessions" },
      { words: ["weight", "fat", "slim", "tone", "lose"], chip: "💪 Weight Loss", label: "weight loss" },
      { words: ["women", "ladies", "female"], chip: "👩 Women's Batch", label: "Women's Only batch" },
      { words: ["meditat", "breath", "pranayama", "calm", "stress", "anxiety"], chip: "🌿 Benefits", label: "meditation & breathwork" },
      { words: ["online", "zoom", "virtual", "home", "remote"], chip: "⏰ Class Timings", label: "online classes" },
    ];
    const matched = topicHints.find(h => h.words.some(w => lower2.includes(w)));
    if (matched) {
      botReply(
        `I understand you're asking about **${matched.label}**! 🌿\n\nI've got detailed info on this — tap a quick option below or ask me something more specific and I'll answer right away.`,
        380
      );
      setTimeout(() => setChips([matched.chip, "🍯 Free Trial", "💬 WhatsApp"]), 600);
    } else {
      const aiResponses = [
        `Great question! 🤔 I'm still learning, but I know a lot about Feel & Heal Yoga.\n\nTry asking me about **class timings**, **free trials**, **weight loss**, or **women's batch** — or chat with our team directly on WhatsApp! 🌿`,
        `Interesting! 🧘 I didn't quite catch that, but I'm here to help.\n\nYou can ask me about **batch schedules**, **pricing**, **online vs offline classes**, or **health conditions** — I'll give you an instant smart answer!`,
        `Hmm, let me make sure I give you the right info! 😊\n\nCould you rephrase that? Or pick one of the quick options below — I'm fully powered to answer most yoga queries instantly! 🌿`,
      ];
      const randomReply = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      botReply(randomReply, 420);
      setTimeout(() => {
        addSpecial("wa", { text: "💬 Ask on WhatsApp", url: waUrl(`Hi! I have a question: ${msg}`) });
        setChips(["⏰ Class Timings", "🍯 Free Trial", "🌿 Benefits", "💪 Weight Loss"]);
      }, 700);
    }
  };

  const send = (overrideText = null) => {
    const msg = (overrideText ?? input).trim();
    if (!msg) return;
    addMsg("user", msg);
    setInput("");
    setChips([]);
    setCta(null);
    touch();
    if (collecting) handleLeadStep(msg);
    else resolveIntent(msg);
  };

  const chipClick = (chip) => {
    addMsg("user", chip);
    setChips([]);
    setCta(null);
    touch();
    if (collecting) handleLeadStep(chip);
    else resolveIntent(chip);
  };

  const renderText = (text) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );

  return (
    <>
      {/* Float Button */}
      <button
        className="yogi-float"
        onClick={() => setOpen(!open)}
        aria-label="Open Yogi chat"
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
      >
        {unread > 0 && !open && <span className="yogi-badge">{unread}</span>}
        <span className="yogi-float-icon">🧘</span>
        <span>Yogi</span>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="yogi-box">
          {/* Header */}
          <div className="yogi-header">
            <div className="yogi-header-left">
              <div className="yogi-avatar-wrap">
                <div className="yogi-avatar">🧘</div>
                <span className="yogi-online-dot" />
              </div>
              <div className="yogi-header-info">
                <strong>Yogi</strong>
                <small>Feel &amp; Heal Yoga · AI-Powered · Online now</small>
              </div>
            </div>
            <div className="yogi-header-actions">
              <button className="yogi-close-btn" onClick={() => setOpen(false)} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sub-header strip */}
          <div className="yogi-subheader">
            <span>🌿 Feel &amp; Heal Yoga · Kharghar, Navi Mumbai</span>
          </div>

          {/* Messages */}
          <div className="yogi-messages">
            <div className="yogi-day-label">Today</div>

            {messages.map((m, i) => {
              if (m.special === "wa") {
                return (
                  <a key={i} href={m.data.url} target="_blank" rel="noopener noreferrer" className="yogi-wa-btn">
                    <WAIcon /> {m.data.text}
                  </a>
                );
              }
              if (m.special === "gform") {
                return (
                  <a key={i} href={m.data.url} target="_blank" rel="noopener noreferrer" className="yogi-gform-btn">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
                      <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="hsl(145,44%,30%)"/>
                      <path d="M14 2v6h6" fill="hsl(145,44%,46%)"/>
                      <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="white"/>
                      <rect x="7" y="15" width="7" height="1.5" rx="0.75" fill="white"/>
                    </svg>
                    {m.data.text}
                  </a>
                );
              }
              return (
                <div key={i} className={`yogi-msg-wrap ${m.from}`}>
                  {m.from === "bot" ? (
                    <div className="yogi-bot-row">
                      <div className="yogi-mini-avatar">🧘</div>
                      <div className={`yogi-msg ${m.from}`}>{renderText(m.text)}</div>
                    </div>
                  ) : (
                    <div className={`yogi-msg ${m.from}`}>{m.text}</div>
                  )}
                  <span className="yogi-timestamp">{m.time}</span>
                </div>
              );
            })}

            {typing && (
              <div className="yogi-typing-wrap">
                <div className="yogi-mini-avatar">🧘</div>
                <div className="yogi-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {!typing && chips.length > 0 && (
              <div className="yogi-chips">
                {chips.map((chip) => (
                  <button key={chip} className="yogi-chip" onClick={() => chipClick(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {cta && !typing && (
              <a href={cta.href} className="yogi-wa-btn yogi-call-btn" style={{ marginLeft: 32, maxWidth: "86%" }}>
                {cta.text}
              </a>
            )}

            <div ref={messagesEndRef} />
          </div>

          {collecting && step && (
            <div className="yogi-progress-wrap">
              <div className="yogi-progress-label">{LEAD_LABELS[step]}</div>
              <div className="yogi-progress-bar">
                <div className="yogi-progress-fill" style={{ width: `${LEAD_PROGRESS[step]}%` }} />
              </div>
            </div>
          )}



          {/* Input */}
          <div className="yogi-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              onFocus={touch}
              placeholder={
                collecting
                  ? step === "name"  ? "Your name..."
                  : step === "phone" ? "10-digit mobile number..."
                  : "Your preferred timing..."
                  : "Ask Yogi anything... 🌿"
              }
              maxLength={200}
              autoComplete="off"
            />
            <button
              className={`yogi-mic-btn${isListening ? " yogi-mic-active" : ""}`}
              aria-label={isListening ? "Stop listening" : "Voice input"}
              title={isListening ? "Tap to stop" : "Speak your question"}
              onClick={() => {
                if (isListening && recognitionRef.current) {
                  recognitionRef.current.stop();
                  setIsListening(false);
                  setMicStatus("");
                  return;
                }
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SR) {
                  setMicStatus("❌ Voice input not supported. Use Chrome or Edge.");
                  setTimeout(() => setMicStatus(""), 4000);
                  return;
                }
                const rec = new SR();
                rec.lang = "en-US";
                rec.continuous = false;
                rec.interimResults = true;
                rec.maxAlternatives = 1;
                recognitionRef.current = rec;
                setIsListening(true);
                setMicStatus("🎤 Listening... speak now");
                setInput("");
                rec.start();
                rec.onresult = (e) => {
                  let transcript = "";
                  let isFinal = false;
                  for (let i = e.resultIndex; i < e.results.length; i++) {
                    transcript += e.results[i][0].transcript;
                    if (e.results[i].isFinal) isFinal = true;
                  }
                  setInput(transcript);
                  if (isFinal) {
                    setIsListening(false);
                    setMicStatus("✅ Got it!");
                    recognitionRef.current = null;
                    setTimeout(() => setMicStatus(""), 1500);
                    setTimeout(() => send(transcript.trim()), 200);
                  }
                };
                rec.onerror = (e) => {
                  setIsListening(false);
                  recognitionRef.current = null;
                  const errorMessages = {
                    "not-allowed":   "🔒 Mic blocked — click the 🔒 lock icon in address bar and Allow Microphone.",
                    "no-speech":     "😐 No speech detected — please speak louder or closer to the mic.",
                    "audio-capture": "🚨 No microphone found — check your mic is connected.",
                    "network":       "📡 Network error — Chrome Speech API needs internet. Check your connection.",
                    "aborted":       "",
                  };
                  const msg = errorMessages[e.error] || `❌ Mic error: ${e.error}`;
                  if (msg) setMicStatus(msg);
                  setTimeout(() => setMicStatus(""), 5000);
                };
                rec.onend = () => {
                  setIsListening(false);
                  if (micStatus === "🎤 Listening... speak now") {
                    setMicStatus("😐 Nothing heard — try again and speak clearly.");
                    setTimeout(() => setMicStatus(""), 3000);
                  }
                };
              }}
            >
              {isListening ? "🔴" : "🎤"}
            </button>
            <button
              className="yogi-send-btn"
              onClick={() => send()}
              disabled={!input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
          {micStatus ? (
            <p style={{
              fontSize: "11px",
              color: micStatus.startsWith("❌") || micStatus.startsWith("🔒") || micStatus.startsWith("🚨") || micStatus.startsWith("📡")
                ? "hsl(0,72%,50%)" : "hsl(145,48%,32%)",
              textAlign: "center",
              margin: "4px 8px 0",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}>
              {micStatus}
            </p>
          ) : null}
        </div>
      )}
    </>
  );
}

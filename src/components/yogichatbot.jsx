import { useState, useRef, useEffect, useCallback } from "react";
import "./yogichatbot.css";

const WA = "919920155875";
const waUrl = (msg) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const WA_DEFAULT = waUrl("Namaste! 🙏 I found Feel & Heal Yoga and I'm interested in learning more about your classes.");
const WA_TRIAL = waUrl("Namaste! 🙏 I'd like to book a FREE trial yoga class at Feel & Heal Yoga. Could you please help me set up a slot?");

/* ── Time helpers ──────────────────────────────────────────────── */
const timeStr = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const timeGreeting = () => {
  const h = new Date().getHours();
  if (h < 5) return "Hello 🌙";
  if (h < 12) return "Good morning ☀️";
  if (h < 17) return "Good afternoon 🌤️";
  if (h < 20) return "Good evening 🌅";
  return "Good evening 🌙";
};

/* ── Knowledge Base ────────────────────────────────────────────── */
const KB = {
  timings: `🌅 **Morning Batches** (Mon – Fri)
• 6:00 – 7:00 AM  (Online & Offline)
• 8:00 – 9:00 AM  (Online & Offline)

🌙 **Evening Batch** (Mon – Fri)
• 7:30 – 8:30 PM  (Online & Offline)

🌐 All batches available both Online and Offline.`,

  location: `📍 **Offline Studio:**\nClub House, Adhiraj Garden,\nSector 5, Kharghar, Navi Mumbai – 410210\n\n🌐 **Online classes** are also available — join from anywhere in the world!`,

  about: `Feel & Heal Yoga is a certified yoga studio based in Kharghar, Navi Mumbai.\n\nOur teacher **Priyanka** specialises in **Hatha Yoga, Vinyasa Flow, Pranayama**, and therapeutic yoga — with a holistic focus on healing, mindfulness, and personal transformation.\n\nWith small intimate batch sizes and a caring approach, every student gets genuine personal attention. 🙏`,

  free_trial: `Absolutely! 🎉 We offer a **FREE trial class** so you can experience the vibe before committing.\n\nNo strings attached — just show up with an open mind! 🌿\n\nTap below to send us a WhatsApp message and our team will confirm your free trial slot within minutes. ✅`,

  pricing_offline: `Here are our **Offline Group Class** membership plans:

👤 **Individual**
• 1 Month — ₹2,499/month
• 3 Months — ₹2,000/month *(Total ₹6,000 · Save ₹1,500 · ⭐ Most Popular)*
• 6 Months — ₹1,850/month *(Total ₹11,100 · Save ₹3,900)*

👫 **Couple** (per person)
• 3 Months — ₹1,850/person/month *(Couple total: ₹11,100)*
• 6 Months — ₹1,750/person/month *(Couple total: ₹21,000)*

👨‍👩‍👧 **Family** (3+ members, per person)
• 3 Months — ₹1,800/person/month
• 6 Months — ₹1,700/person/month

💡 **We recommend the 3-Month plan** — it gives you enough time to build a real routine while saving ₹499/month vs the 1-month rate.`,

  pricing_online: `Here are our **Online Group Class** membership plans:

👤 **Individual**
• 1 Month — ₹1,999/month
• 3 Months — ₹1,500/month *(Total ₹4,500 · Save ₹1,499 · ⭐ Most Popular)*
• 6 Months — ₹1,350/month *(Total ₹8,100 · Save ₹2,899)*

👫 **Couple** (per person)
• 3 Months — ₹1,350/person/month *(Couple total: ₹8,100)*
• 6 Months — ₹1,250/person/month *(Couple total: ₹15,000)*

👨‍👩‍👧 **Family** (3+ members, per person)
• 3 Months — ₹1,250/person/month
• 6 Months — ₹1,200/person/month

💡 **We recommend the 3-Month plan** — it gives you time to build consistency while saving ₹499/month vs the 1-month rate.`,

  pricing_compare: `Here's a quick **plan comparison** to help you decide:

📊 **Offline Individual**
| Plan | Monthly | Total | You Save |
|------|---------|-------|----------|
| 1 Month | ₹2,499 | ₹2,499 | — |
| **3 Months** ⭐ | **₹2,000** | **₹6,000** | **₹1,500** |
| 6 Months | ₹1,850 | ₹11,100 | ₹3,900 |

📊 **Online Individual**
| Plan | Monthly | Total | You Save |
|------|---------|-------|----------|
| 1 Month | ₹1,999 | ₹1,999 | — |
| **3 Months** ⭐ | **₹1,500** | **₹4,500** | **₹1,499** |
| 6 Months | ₹1,350 | ₹8,100 | ₹2,899 |`,

  which_plan: `Great question! Here's an honest recommendation 🌿

**Choose 1 Month if:**
→ You're still deciding & want flexibility
→ You haven't tried the classes yet (better to try the free trial first!)

**Choose 3 Months if** *(most people start here)*:
→ You're ready to commit to building a yoga habit
→ You want to save ₹499/month vs month-to-month
→ You want enough time to see real results without a big commitment

**Choose 6 Months if:**
→ You're fully committed and want the best per-month rate
→ You've already done yoga before and know you'll stick with it

🌟 **Our honest advice:** Start with a **free trial first**, then choose **3 months** — it's the sweet spot between flexibility and savings.`,

  couple_pricing: `Yes! We have special **Couple Plans** 💕

🏠 **Offline Couple (per person)**
• 3 Months — ₹1,850/person/month *(₹11,100 total for 2)*
• 6 Months — ₹1,750/person/month *(₹21,000 total for 2)*

🌐 **Online Couple (per person)**
• 3 Months — ₹1,350/person/month *(₹8,100 total for 2)*
• 6 Months — ₹1,250/person/month *(₹15,000 total for 2)*

💕 **Better Together** — practicing with your partner keeps you both accountable and saves more per person than individual plans!`,

  family_pricing: `Yes! We have **Family Plans** for 3 or more members 🏡

🏠 **Offline Family (per person)**
• 3 Months — ₹1,800/person/month
• 6 Months — ₹1,700/person/month

🌐 **Online Family (per person)**
• 3 Months — ₹1,250/person/month
• 6 Months — ₹1,200/person/month

**Example — 3 members, 3 months offline:** ₹1,800 × 3 months × 3 members = ₹16,200 total

🏡 Make wellness a family habit — practice together, stay accountable together!`,

  beginner: `100% yes — beginners are always welcome! 🌱\n\nYou don't need to be flexible, fit, or have any prior experience. Our teacher guides every student patiently at their own pace.\n\nMany students join with zero yoga background and transform completely within just a few weeks. Your journey starts exactly where you are.`,

  online_offline: `We offer **both** — and you can switch anytime! 🌐📍\n\n• **Online**: Join via video call from anywhere in the world\n• **Offline**: In-person at our Kharghar studio\n\nLots of students mix both depending on their schedule. Very flexible!`,

  what_to_bring: `For offline classes, just bring:\n• Comfortable, stretchable clothing\n• A water bottle\n• A yoga mat (optional — extras are available)\n• An open, curious mind 🧘\n\nNo special equipment needed. You're all set!`,

  dress_code: `Wear **comfortable, stretchy clothing** — yoga pants, track pants, or leggings are perfect.\n\nJust avoid jeans or anything restrictive. Breathability is key since you'll be moving and breathing deeply! 😊`,

  benefits: `Regular yoga at Feel & Heal can help you:\n✅ Lose weight & tone your body naturally\n✅ Relieve back pain, stiffness & body aches\n✅ Reduce stress, anxiety & overthinking\n✅ Improve flexibility, strength & posture\n✅ Sleep deeply & wake up energised\n✅ Balance hormones & boost immunity\n✅ Sharpen focus & cultivate inner calm\n✅ Build a consistent wellness habit\n\nThe results speak for themselves! 🌸`,

  women_batch: `👩 **Women's Wellness Yoga**\n\nOur classes warmly welcome women of all ages and fitness levels! 🌸\n\nPopular goals among our women students:\n• Weight management & body toning\n• PCOD/PCOS & hormonal balance\n• Stress relief & better sleep\n• Postnatal recovery & core strengthening\n\nFor current batch availability and timings, please reach out to our team — we'll match you with the perfect slot!\n\n📞 **+91 99201 55875** (WhatsApp / Call)`,

  injury: `If you have a health condition, injury, or medical concern — please share it with our team before starting.\n\nOur teacher carefully adapts poses to suit individual needs, ensuring a completely safe practice.\n\nYoga actually **helps many conditions** when practiced correctly — back pain, knee issues, PCOD, thyroid, and more. Our team will guide you safely. 🙏`,

  meditation: `Yes! **Pranayama** (breathing techniques) and **Dhyana** (meditation) are woven into many sessions.\n\nThese practices help students:\n• Manage stress and anxiety\n• Develop deep mindfulness\n• Cultivate lasting inner calm and clarity\n• Improve sleep quality\n\nIt's not just physical — it's a complete wellness experience. 🧘`,

  duration: `Each class runs for approximately **60 minutes**.\n\nThe Weight Loss Program is also 60 minutes, 4 days a week — structured and progressive for results.`,

  group_size: `Batches are intentionally **small** 🙏\n\nThis isn't a crowd workout — our team keeps class sizes intimate so every student gets genuine individual attention.\n\nYou'll never feel lost in a big group here.`,

  weight_loss: `Weight loss is one of the most common goals our team works with! 🌿\n\nYour weight loss journey happens within the **regular batch timings** (Mon – Fri), where our teacher incorporates dynamic yoga sequences, pranayama, and lifestyle guidance tailored to your goals.\n\nMany students have seen significant results:\n• Fat loss and body toning\n• Improved metabolism\n• Reduced bloating\n• Better eating habits naturally\n\nThe best first step? A **free trial class** — see for yourself! 💪`,

  contact: `You can reach Team Feel & Heal Yoga directly:\n📞 **+91 99201 55875** (Call or WhatsApp)\n✉️ feelandhealyoga@gmail.com\n📍 Kharghar, Navi Mumbai\n\nWe're typically available **Mon–Sat, 6 AM – 9 PM**. Don't hesitate to reach out — we're very responsive! 💬`,

  hormones: `Yoga is **deeply effective** for hormonal balance! 🌸\n\nSpecific sequences and pranayama practices at Feel & Heal can help with:\n• PCOD/PCOS management\n• Thyroid regulation\n• Stress hormone (cortisol) reduction\n• Menstrual health and regularity\n• Menopause symptoms\n\nSessions are tailored to your specific needs — many students have seen wonderful results with these exact concerns. 🌿`,

  personal_session: `Great choice! 🧘 We do offer **1-on-1 personal yoga sessions** at Feel & Heal Yoga.\n\nA personalised session gives you:\n• Dedicated time with our teacher Priyanka\n• A practice tailored entirely to your goals & body\n• Flexible scheduling that suits YOU\n• Faster progress with individual feedback\n\nTo get started, just share your details and our team will call you back to discuss and schedule your session! 📞`,

  society_yoga: `Great question! 🏘️\n\nFeel & Heal Yoga offers **community yoga programs** for residential societies and community groups.\n\n🌿 **Programs we offer:**\n• Regular group yoga (all levels)\n• Beginner yoga\n• Weight management yoga\n• Women's wellness yoga\n• Kids yoga & senior citizen yoga\n• Meditation & breathwork\n• Weekend wellness workshops\n\n👥 **Minimum participants:** Usually 8–10 people, but flexible based on the program.\n\n📍 **We come to you:** Our certified teachers travel to your society or location.\n\n💰 **Pricing:** Customized based on group size, frequency, and program type.\n\n🎏 **Free trial:** Yes! We offer an introductory session before any commitment.\n\nWould you like to submit a society yoga enquiry? 🙏`,

  franchise: `Exciting opportunity! 🤝\n\nFeel & Heal Yoga offers a **Franchise Partnership** program — bring the Feel & Heal experience to your city or community!\n\n🌿 **Why partner with us?**\n• Established brand with 5★ reputation\n• Complete training & certification support\n• Marketing & operational guidance\n• Proven curriculum and teaching methodology\n• Low investment, high community impact\n\n📋 **Who can apply?**\n• Certified yoga teachers looking to scale\n• Wellness entrepreneurs\n• Studio owners looking for a trusted brand\n\nOur team will walk you through the complete franchise model.\n\nInterested? Fill out our enquiry form and we'll get back to you within 24 hours! 🙏`,
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
    cta: "wa",
    ctaText: "💬 Book FREE Trial on WhatsApp",
    ctaMsg: "Namaste! 🙏 I'd like to book a FREE trial yoga class at Feel & Heal Yoga. Could you please help me set up a slot?",
  },
  {
    id: "pricing_offline",
    keys: ["offline price", "offline fee", "offline cost", "offline rate", "offline package", "in person price", "studio fee", "offline plan"],
    answer: () => KB.pricing_offline,
    chips: ["💰 Online Pricing", "🆚 Compare Plans", "🍯 Book Free Trial"],
  },
  {
    id: "pricing_online",
    keys: ["online price", "online fee", "online cost", "online rate", "online package", "virtual price", "zoom price", "online plan"],
    answer: () => KB.pricing_online,
    chips: ["💰 Offline Pricing", "🆚 Compare Plans", "🍯 Book Free Trial"],
  },
  {
    id: "pricing",
    keys: ["fee", "price", "cost", "charge", "rate", "how much", "package", "offer", "fees", "monthly", "payment", "plan", "plans", "membership", "subscription"],
    answer: () => `Here's a quick overview of our pricing 🌿\n\n🏠 **Offline** (Group Classes)\n• 1 Month — ₹2,499/month\n• **3 Months — ₹2,000/month** ⭐ Most Popular\n• 6 Months — ₹1,850/month\n\n🌐 **Online** (Group Classes)\n• 1 Month — ₹1,999/month\n• **3 Months — ₹1,500/month** ⭐ Most Popular\n• 6 Months — ₹1,350/month\n\nWe also have **Couple** and **Family** plans with extra savings!\n\nWant the full breakdown?`,
    chips: ["💰 Offline Pricing", "💰 Online Pricing", "👫 Couple Plans", "🆚 Compare Plans"],
  },
  {
    id: "pricing_compare",
    keys: ["compare", "comparison", "difference", "vs", "versus", "better plan", "which is better", "1 month vs", "3 month vs"],
    answer: () => KB.pricing_compare,
    chips: ["🤔 Which Plan?", "🍯 Book Free Trial", "💬 WhatsApp"],
  },
  {
    id: "which_plan",
    keys: ["which plan", "what plan", "recommend", "suggestion", "which one", "best plan", "best option", "what should i", "help me choose", "not sure", "confused", "which membership"],
    answer: () => KB.which_plan,
    chips: ["🍯 Book Free Trial First", "💰 See All Prices", "💬 WhatsApp"],
  },
  {
    id: "three_month",
    keys: ["3 month", "three month", "3month", "quarterly", "3 months plan", "three months"],
    answer: () => `The **3-Month Plan** is our most popular choice! ⭐\n\n🏠 **Offline** — ₹2,000/month (Total ₹6,000, save ₹1,500)\n🌐 **Online** — ₹1,500/month (Total ₹4,500, save ₹1,499)\n\n✅ Save ₹499/month vs the 1-month rate\n✅ Enough time to see real, visible results\n✅ Build a consistent yoga habit\n✅ Less commitment than 6 months\n\nThis is the plan we recommend for most beginners. 🌿`,
    chips: ["💬 Enroll on WhatsApp", "🍯 Try Free First", "🆚 Compare Plans"],
  },
  {
    id: "six_month",
    keys: ["6 month", "six month", "6month", "half year", "6 months plan", "six months"],
    answer: () => `The **6-Month Plan** is our best value for committed practitioners! 🏆\n\n🏠 **Offline** — ₹1,850/month (Total ₹11,100, save ₹3,900)\n🌐 **Online** — ₹1,350/month (Total ₹8,100, save ₹2,899)\n\n✅ Lowest per-month rate\n✅ Maximum savings\n✅ Best for those who know they love yoga\n\n💡 **Not sure yet?** We recommend starting with the **3-month plan** or a **free trial** first. 🌿`,
    chips: ["💬 Enroll on WhatsApp", "🍯 Try Free First", "🤔 Which Plan?"],
  },
  {
    id: "couple_pricing",
    keys: ["couple", "partner", "husband", "wife", "spouse", "together", "two people", "both of us", "me and my", "family plan", "for two"],
    answer: () => KB.couple_pricing,
    chips: ["👨‍👩‍👧 Family Plan", "🍯 Book Free Trial", "💬 WhatsApp"],
  },
  {
    id: "family_pricing",
    keys: ["family", "family plan", "family membership", "kids and parents", "3 members", "4 members", "family pricing"],
    answer: () => KB.family_pricing,
    chips: ["👫 Couple Plan", "🍯 Book Free Trial", "💬 WhatsApp"],
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
    id: "personal_session",
    keys: [
      "personal training", "personal session", "personal sesson",
      "private session", "private class", "private training",
      "one on one", "one-on-one", "1 on 1", "1on1", "1-on-1",
      "personal", "private", "individual", "solo", "dedicated",
      "exclusive", "customised", "personalized", "personalised",
      "custom session", "my own", "just me", "alone", "training", "session", "sessions"
    ],
    answer: () => KB.personal_session,
    followUp: "Shall I collect your details so our team can call you back to schedule your 1-on-1 session? 🌿",
    chips: ["🧘 Book 1-on-1 Session", "💬 WhatsApp", "⏰ Class Timings"],
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
    id: "about",
    keys: ["about", "who", "instructor", "teacher", "certified", "ryt", "background", "experience", "qualified", "priyanka"],
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
    followUp: "Would you like our team to reach out when the batch opens? 🌸",
    chips: ["💬 WhatsApp", "⏰ Class Timings", "🍯 Book Free Trial"],
  },
  {
    id: "join",
    keys: ["join", "enroll", "register", "sign up", "book", "yes", "interested", "want to", "i want", "i would like", "let me join"],
    answer: null,
    triggerLead: true,
  },
  {
    id: "society_yoga",
    keys: [
      "society", "apartment complex", "residential society", "housing society",
      "community yoga", "community group", "bulk classes",
      "group yoga", "yoga for society", "yoga at society", "society yoga",
      "bring yoga", "yoga classes in society",
    ],
    answer: () => KB.society_yoga,
    chips: ["🏘️ Submit Society Request", "💬 WhatsApp", "⏰ Class Timings"],
  },
  {
    id: "franchise",
    keys: [
      "franchise", "partner", "partnership", "business", "investor", "invest",
      "open a studio", "start a studio", "own a studio", "my own studio",
      "franchise opportunity", "collaborate", "collaboration", "dealership",
      "run a class", "start yoga business",
    ],
    answer: () => KB.franchise,
    followUp: "Would you like to visit our Franchise page or connect with our team directly? 🤝",
    chips: ["🏘️ View Franchise Page", "💬 WhatsApp"],
  },
];

const DEFAULT_CHIPS = [
  "⏰ Class Timings",
  "🍯 Free Trial",
  "💰 Pricing",
  "💪 Weight Loss",
  "🌿 Benefits",
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
  "🍯 try free first": "free trial",
  "🍯 book free trial first": "free trial",
  "book trial": "free trial",
  "free trial": "free trial",
  "🍯 free trial": "free trial",
  "💪 weight loss": "weight loss",
  "book weight loss slot": "weight loss",
  "💪 book weight loss slot": "weight loss",
  "👩 women's batch": "women_batch",
  "👩 book women's": "women_batch",
  "🌿 benefits": "benefit",
  "🏘️ society yoga": "society yoga",
  "🏘️ submit society request": "__society_link__",
  "🏘️ view franchise page": "__franchise_link__",
  "🧘 book 1-on-1 session": "join",
  "💬 whatsapp": "__wa__",
  "💬 enroll on whatsapp": "__wa_enroll__",
  "💰 pricing": "pricing",
  "💰 see all prices": "pricing",
  "💰 offline pricing": "offline price",
  "💰 online pricing": "online price",
  "🆚 compare plans": "compare plans",
  "🤔 which plan?": "which plan",
  "👫 couple plans": "couple pricing",
  "👫 couple plan": "couple pricing",
  "👨‍👩‍👧 family plan": "family pricing",
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

const LEAD_STEPS = ["name", "phone", "session_type"];
const LEAD_LABELS = {
  name: "Step 1 of 3 — Your name",
  phone: "Step 2 of 3 — Mobile number",
  session_type: "Step 3 of 3 — Session type",
};
const LEAD_PROGRESS = { name: 33, phone: 66, session_type: 100 };

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
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `${timeGreeting()} ✨ I'm **Yogi** — Feel & Heal Yoga's intelligent AI wellness assistant.\n\nI'm trained to instantly answer anything: class timings, free trials, batch types, weight loss yoga, fees, and more. No hold music. No waiting. Just smart answers. 🧠🌿\n\nWhat would you like to know?`,
      time: timeStr(),
    },
  ]);
  const [chips, setChips] = useState(DEFAULT_CHIPS);
  const [cta, setCta] = useState(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [step, setStep] = useState("");
  const [lead, setLead] = useState({ name: "", phone: "", timing: "" });
  const [userName, setUserName] = useState("");
  const [ctx, setCtx] = useState([]);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [leadType, setLeadType] = useState("batch");
  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState("");
  const messagesEndRef = useRef(null);
  const idleTimerRef = useRef(null);
  const recognitionRef = useRef(null);

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
          addSpecial("wa", { text: "💬 Book Your FREE Trial on WhatsApp", url: WA_TRIAL });
          setChips(["⏰ Class Timings", "📍 Location"]);
        }, 1600);
      }, 350);
    };
    window.addEventListener("open-yogi-trial", handler);
    return () => window.removeEventListener("open-yogi-trial", handler);
  }, [botReply, addSpecial]);

  // Listen for open-yogi-chat — dispatched by MobileApp Chat tab/card
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setUnread(0);
    };
    window.addEventListener("open-yogi-chat", handler);
    return () => window.removeEventListener("open-yogi-chat", handler);
  }, []);

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
      setStep("session_type");
      setChips(["🧘 1-on-1 Session", "👥 Group Class"]);
      botReply(`Got it! 📲\n\nWhat are you looking for?`, 350);
      return;
    }
    if (step === "session_type") {
      const lower = text.toLowerCase();
      const isPersonal =
        lower.includes("1-on-1") || lower.includes("1 on 1") ||
        lower.includes("personal") || lower.includes("private") ||
        lower.includes("individual") || lower.includes("solo") ||
        lower.includes("one") || lower.includes("1-1");
      setCollecting(false);
      setStep("");
      setChips([]);

      if (isPersonal) {
        const finalLead = { ...lead, type: "1-on-1 Session" };
        setLead(finalLead);
        saveLead(finalLead);

        // Email alert to team
        fetch("https://formsubmit.co/ajax/vishalnair198@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: `🧘 1-on-1 Session Enquiry — ${finalLead.name} (${finalLead.phone})`,
            _template: "table",
            "Name": finalLead.name,
            "Phone": finalLead.phone,
            "Session Type": "1-on-1 Personal Session",
            "Source": "Yogi Chatbot",
            "Submitted At": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          }),
        }).catch(() => {});

        const waMsg = `Namaste! 🙏 My name is ${finalLead.name}. I'm interested in a **1-on-1 personal yoga session** at Feel & Heal Yoga. My number is ${finalLead.phone}. Please get in touch! 🌿`;
        botReply(`Thank you, **${finalLead.name}**! 🙏\n\nYour enquiry for a **1-on-1 session** has been received. Our team will contact you at **${finalLead.phone}** shortly.\n\nYou can also reach us directly on WhatsApp right now 👇`, 600);
        setTimeout(() => {
          addSpecial("wa", { text: "💬 WhatsApp Us for 1-on-1 Session", url: waUrl(waMsg) });
          setChips(["⏰ Class Timings", "🌿 Benefits"]);
        }, 1800);
      } else {
        // Group class → registration form directly
        const finalLead = { ...lead, type: "Group Class" };
        setLead(finalLead);
        saveLead(finalLead);

        // Email alert to team
        fetch("https://formsubmit.co/ajax/vishalnair198@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            _subject: `👥 Group Class Interest — ${finalLead.name} (${finalLead.phone})`,
            _template: "table",
            "Name": finalLead.name,
            "Phone": finalLead.phone,
            "Session Type": "Group Class",
            "Source": "Yogi Chatbot",
            "Submitted At": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          }),
        }).catch(() => {});

        botReply(`Awesome, **${finalLead.name}**! 🌿\n\nOur group classes are welcoming, fun, and suitable for all levels. Tap below to send us a WhatsApp message — our team will confirm your slot in minutes! 👇`, 500);
        setTimeout(() => {
          addSpecial("wa", { text: "💬 Book Group Class on WhatsApp", url: waUrl(`Namaste! 🙏 My name is ${finalLead.name}. I'm interested in joining a group yoga class at Feel & Heal Yoga. My number is ${finalLead.phone}. Please help me book a slot!`) });
          setChips(["⏰ Class Timings", "💬 WhatsApp"]);
        }, 1500);
      }
      return;
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
    if (mapped === "__wa_enroll__") {
      addSpecial("wa", { text: "💬 Enroll via WhatsApp", url: waUrl("Namaste! 🙏 I'd like to enroll in a Feel & Heal Yoga membership. Can you help me choose the right plan?") });
      setChips(["🍯 Book Free Trial", "🆚 Compare Plans"]);
      return;
    }
    if (mapped === "__society_link__") {
      botReply("I'll take you to our Society Yoga enquiry page! 🏘️\n\nYou can fill in your society details and our team will design a customized wellness program for your community. 🌿", 400);
      setTimeout(() => {
        addSpecial("gform", { text: "🏘️ Submit Society Yoga Request", url: "/bring-yoga-to-your-society" });
        setChips(["💬 WhatsApp", "⏰ Class Timings"]);
      }, 1600);
      return;
    }
    if (mapped === "__franchise_link__") {
      botReply("Taking you to our Franchise page! 🤝\n\nDiscover how you can bring Feel & Heal Yoga to your community and build a wellness business you're proud of. 🌿", 400);
      setTimeout(() => {
        addSpecial("gform", { text: "🤝 View Franchise Opportunity", url: "/franchise-with-us" });
        setChips(["💬 WhatsApp", "⏰ Class Timings"]);
      }, 1600);
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
      if (intent.cta === "wa") {
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
      { words: ["fee", "cost", "price", "charge", "pay", "how much", "monthly", "plan", "membership"], chip: "💰 Pricing", label: "pricing & plans" },
      { words: ["compare", "vs", "difference", "which plan", "best plan", "recommend"], chip: "🤔 Which Plan?", label: "plan comparison" },
      { words: ["couple", "partner", "husband", "wife", "together"], chip: "👫 Couple Plans", label: "couple pricing" },
      { words: ["family", "members", "3 people", "4 people"], chip: "👨‍👩‍👧 Family Plan", label: "family pricing" },
      { words: ["private", "personal", "one on one", "1 on 1", "solo"], chip: "💬 WhatsApp", label: "1-on-1 personal sessions" },
      { words: ["weight", "fat", "slim", "tone", "lose"], chip: "💪 Weight Loss", label: "weight loss" },
      { words: ["women", "ladies", "female"], chip: "👩 Women's Batch", label: "Women's Only batch" },
      { words: ["meditat", "breath", "pranayama", "calm", "stress", "anxiety"], chip: "🌿 Benefits", label: "meditation & breathwork" },
      { words: ["online", "zoom", "virtual", "home", "remote"], chip: "💰 Online Pricing", label: "online classes" },
      { words: ["offline", "studio", "in person", "kharghar", "navi mumbai"], chip: "💰 Offline Pricing", label: "offline classes" },
    ];
    const matched = topicHints.find(h => h.words.some(w => lower2.includes(w)));
    if (matched) {
      botReply(
        `I understand you're asking about **${matched.label}**! 🌿\n\nI've got detailed info — tap a quick option below or ask me something more specific and I'll answer right away.`,
        380
      );
      setTimeout(() => setChips([matched.chip, "🍯 Free Trial", "💬 WhatsApp"]), 600);
    } else {
      const aiResponses = [
        `Great question! 🤔 I know a lot about Feel & Heal Yoga — let me help you.\n\nTry asking me about:\n• **Class timings** 📅\n• **Pricing plans** 💰\n• **Free trial** 🎉\n• **Weight loss yoga** 💪\n• **Which plan to choose** 🤔\n\nOr chat with our team directly on WhatsApp!`,
        `Hmm, I didn't quite catch that! 🧘\n\nYou can ask me about **batch schedules**, **offline vs online pricing**, **couple/family plans**, **health conditions**, or **how to join** — I'll give you an instant smart answer! 🌿`,
        `Let me make sure I give you the right info! 😊\n\nCould you rephrase that? Or pick one of the options below — I'm fully trained to answer most yoga queries instantly. 🌿`,
      ];
      const randomReply = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      botReply(randomReply, 420);
      setTimeout(() => {
        addSpecial("wa", { text: "💬 Ask on WhatsApp", url: waUrl(`Hi! I have a question: ${msg}`) });
        setChips(["⏰ Class Timings", "💰 Pricing", "🍯 Free Trial", "🤔 Which Plan?"]);
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
      {/* Float Button — hidden when chat is open on mobile to avoid overlay */}
      {!open && (
        <button
          className="yogi-float"
          onClick={() => setOpen(true)}
          aria-label="Open Yogi chat"
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
        >
          {unread > 0 && <span className="yogi-badge">{unread}</span>}
          <span className="yogi-float-icon">🧘</span>
          <span>Yogi</span>
        </button>
      )}

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
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="hsl(145,44%,30%)" />
                      <path d="M14 2v6h6" fill="hsl(145,44%,46%)" />
                      <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="white" />
                      <rect x="7" y="15" width="7" height="1.5" rx="0.75" fill="white" />
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
                  ? step === "name" ? "Your name..."
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
                    "not-allowed": "🔒 Mic blocked — click the 🔒 lock icon in address bar and Allow Microphone.",
                    "no-speech": "😐 No speech detected — please speak louder or closer to the mic.",
                    "audio-capture": "🚨 No microphone found — check your mic is connected.",
                    "network": "📡 Network error — Chrome Speech API needs internet. Check your connection.",
                    "aborted": "",
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

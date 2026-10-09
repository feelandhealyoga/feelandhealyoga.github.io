export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://feelandhealyoga.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    full_name = "",
    phone = "",
    email = "",
    participant_count = 1,
    preferred_contact = "whatsapp",
    notes = "",
    registration_source = "website_form",
  } = req.body || {};

  const cleanName = String(full_name).trim().slice(0, 100);
  const cleanPhone = String(phone).replace(/\D/g, "").slice(0, 15);
  const cleanEmail = String(email).trim().slice(0, 200);
  const cleanNotes = String(notes).trim().slice(0, 500);
  const pCount = Math.min(Math.max(parseInt(participant_count) || 1, 1), 50);

  if (!cleanName || cleanName.length < 2)
    return res.status(400).json({ error: "Please provide a valid full name." });
  if (!cleanPhone || cleanPhone.length < 10)
    return res.status(400).json({ error: "Please provide a valid 10-digit mobile number." });
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
    return res.status(400).json({ error: "Please provide a valid email address." });

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/retreat_registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=representation",
        },
        body: JSON.stringify({
          retreat_id: "karjat-2026-oct",
          full_name: cleanName,
          phone: cleanPhone,
          email: cleanEmail || null,
          participant_count: pCount,
          preferred_contact_method: preferred_contact,
          notes: cleanNotes || null,
          registration_source: String(registration_source).slice(0, 50),
          status: "new_enquiry",
        }),
      });
      if (!insertRes.ok) console.error("Supabase insert error:", await insertRes.text());
    } catch (err) {
      console.error("Supabase connection error:", err.message);
    }
  }

  const waMsg = encodeURIComponent(
    `Namaste! 🙏 I'm interested in the Feel & Heal Yoga Karjat Mindfulness Retreat on 24–25 October 2026.\n\nName: ${cleanName}\nPhone: ${cleanPhone}\nParticipants: ${pCount}\n\nPlease share registration details and availability. 🌿`
  );

  return res.status(200).json({
    success: true,
    message: "Thank you for your interest in the Karjat Mindfulness Retreat! Our Feel & Heal Yoga team will contact you with the remaining details and confirmation.",
    whatsapp_url: `https://wa.me/919920155875?text=${waMsg}`,
  });
}

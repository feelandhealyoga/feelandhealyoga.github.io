// Vercel Serverless Function: /api/notify-teacher.js
// Triggers Twilio voice call → SMS → WhatsApp for class assignment notifications
// Required env vars in Vercel dashboard:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, TWILIO_WHATSAPP_FROM

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    phone,
    teacherName,
    className,
    date,
    time,
    type,
    studentName,
    channels = ['call', 'sms', 'whatsapp'], // which channels to use
  } = req.body || {};

  if (!phone) return res.status(400).json({ error: 'phone is required' });

  const SID   = process.env.TWILIO_ACCOUNT_SID;
  const TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const FROM  = process.env.TWILIO_PHONE_NUMBER;   // e.g. +919XXXXXXXXX or +1XXXXXXXXXX
  const WA    = process.env.TWILIO_WHATSAPP_FROM;   // e.g. whatsapp:+14155238886

  if (!SID || !TOKEN || !FROM) {
    return res.status(500).json({
      error: 'Twilio env vars not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to Vercel.',
      configured: false,
    });
  }

  // Normalise phone to E.164 with India prefix
  const digits = phone.toString().replace(/\D/g, '');
  const toPhone = digits.startsWith('91') ? `+${digits}` : `+91${digits.slice(-10)}`;

  const portalUrl = 'https://feelandhealyoga.com/staff/';
  const classLabel = type === 'personal'
    ? `Personal Session${studentName ? ` with ${studentName}` : ''}`
    : className || 'Group Class';

  const messageText =
    `Hi ${teacherName}! 🙏 Yogi here from Feel & Heal Yoga.\n\n` +
    `You have a new class assigned:\n` +
    `📅 Date: ${date}\n` +
    `⏰ Time: ${time}\n` +
    `📚 Class: ${classLabel}\n\n` +
    `Please login to the staff portal and mark your attendance:\n${portalUrl}\n\n` +
    `Login: prajakta@feelandhealyoga.com`;

  const voiceText =
    `Hello ${teacherName}. This is Yogi from Feel and Heal Yoga. ` +
    `You have a new ${type === 'personal' ? 'personal session' : 'group class'} assigned ` +
    `on ${date} at ${time}. ` +
    (studentName ? `The student is ${studentName}. ` : '') +
    `Please login to the staff portal at feelandhealyoga.com slash staff and mark it. ` +
    `Thank you. Namaste.`;

  const auth = Buffer.from(`${SID}:${TOKEN}`).toString('base64');
  const baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${SID}`;
  const headers = {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const results = {};

  // ── 1. Voice Call ──────────────────────────────────────────────
  if (channels.includes('call')) {
    try {
      const twiml = `<Response><Say voice="alice" language="en-IN">${voiceText}</Say><Pause length="1"/><Say voice="alice" language="en-IN">Please check your SMS and WhatsApp for the portal link. Thank you.</Say></Response>`;
      const body = new URLSearchParams({ To: toPhone, From: FROM, Twiml: twiml });
      const r = await fetch(`${baseUrl}/Calls.json`, { method: 'POST', headers, body: body.toString() });
      const data = await r.json();
      results.call = r.ok ? { status: 'sent', sid: data.sid } : { status: 'failed', error: data.message };
    } catch (e) {
      results.call = { status: 'error', error: e.message };
    }
  }

  // ── 2. SMS ────────────────────────────────────────────────────
  if (channels.includes('sms')) {
    try {
      const body = new URLSearchParams({ To: toPhone, From: FROM, Body: messageText });
      const r = await fetch(`${baseUrl}/Messages.json`, { method: 'POST', headers, body: body.toString() });
      const data = await r.json();
      results.sms = r.ok ? { status: 'sent', sid: data.sid } : { status: 'failed', error: data.message };
    } catch (e) {
      results.sms = { status: 'error', error: e.message };
    }
  }

  // ── 3. WhatsApp ───────────────────────────────────────────────
  if (channels.includes('whatsapp') && WA) {
    try {
      const waTo = `whatsapp:${toPhone}`;
      const body = new URLSearchParams({ To: waTo, From: WA, Body: messageText });
      const r = await fetch(`${baseUrl}/Messages.json`, { method: 'POST', headers, body: body.toString() });
      const data = await r.json();
      results.whatsapp = r.ok ? { status: 'sent', sid: data.sid } : { status: 'failed', error: data.message };
    } catch (e) {
      results.whatsapp = { status: 'error', error: e.message };
    }
  }

  return res.status(200).json({ success: true, to: toPhone, results });
}

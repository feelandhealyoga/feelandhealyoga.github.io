import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

const G = '#1b4332';

const MESSAGES = {
  trial: {
    emoji: '🧘‍♀️',
    title: "You're booked!",
    lines: [
      "Namaste! 🙏 Your free trial class request is confirmed.",
      "Our team will WhatsApp you with the slot details shortly.",
      "Come with an open heart and comfy clothes. See you on the mat! 🌿",
    ],
    cta: "Explore our classes →",
    ctaHref: "/#schedule",
  },
  contact: {
    emoji: '💌',
    title: 'Message received!',
    lines: [
      "Namaste! 🙏 Thank you for reaching out.",
      "Priyanka will personally get back to you within 24 hours.",
      "In the meantime, feel free to explore our class schedule. 🌸",
    ],
    cta: "Back to home →",
    ctaHref: "/",
  },
  franchise: {
    emoji: '🌱',
    title: 'Application submitted!',
    lines: [
      "Namaste! 🙏 Your franchise enquiry has been received.",
      "Our team will review your details and connect with you within 5–7 working days.",
      "Excited to grow the Feel & Heal family with you! 🌿",
    ],
    cta: "Learn more →",
    ctaHref: "/franchise-with-us",
  },
  society: {
    emoji: '🏡',
    title: 'Request received!',
    lines: [
      "Namaste! 🙏 Your society yoga request is in.",
      "Our wellness team will reach out to plan a session for your community.",
      "Looking forward to bringing yoga to your doorstep! 🌸",
    ],
    cta: "Back to home →",
    ctaHref: "/",
  },
};

type FormType = keyof typeof MESSAGES;

export function ThankYouPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState<FormType>('trial');
  const [visibleLines, setVisibleLines] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get('name') || '';
    const t = (params.get('type') || 'trial') as FormType;
    setName(n.split(' ')[0]);
    setType(MESSAGES[t] ? t : 'trial');

    const t0 = setTimeout(() => setShow(true), 100);
    const timers: ReturnType<typeof setTimeout>[] = [t0];
    const msg = MESSAGES[MESSAGES[t] ? t : 'trial'];
    msg.lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 700 + i * 800));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const msg = MESSAGES[type];

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #f0fdf4 0%, #faf9f7 55%, #fefce8 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', fontFamily: "'Inter', sans-serif",
    }}>
      {/* Logo */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #2d6a4f)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 20 }}>🌿</span>
        </div>
        <div>
          <p style={{ fontWeight: 800, color: G, fontSize: 15, lineHeight: 1.2, margin: 0 }}>Feel & Heal Yoga</p>
          <p style={{ fontSize: 11, color: '#78716c', margin: 0 }}>Kharghar, Navi Mumbai</p>
        </div>
      </a>

      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: 24, padding: '44px 36px 40px',
        maxWidth: 480, width: '100%', textAlign: 'center',
        boxShadow: '0 12px 60px rgba(27,67,50,0.10)',
        border: '1px solid #e8f5e9',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>

        {/* Yogi avatar with pulse ring */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
          <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: `${G}12`, animation: 'yogiPulse 2.5s ease-in-out infinite' }}/>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `linear-gradient(145deg, ${G}, #2d6a4f)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 10px 32px ${G}44`, position: 'relative',
            animation: 'yogiBounce 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
          }}>
            <Bot size={36} color="#fff"/>
          </div>
          <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 20, animation: 'yogiSpin 4s linear infinite' }}>✨</span>
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 44, marginBottom: 10, animation: 'yogiBounce 0.7s 0.2s cubic-bezier(0.34,1.56,0.64,1) both', animationFillMode: 'both' }}>
          {msg.emoji}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 800, color: G, marginBottom: 6, lineHeight: 1.25 }}>
          {name ? `${msg.title.replace('!', '')}, ${name}!` : msg.title}
        </h1>

        <p style={{ fontSize: 13, color: '#78716c', marginBottom: 28 }}>Here's a message from Yogi 🙏</p>

        {/* Yogi chat bubbles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36, textAlign: 'left' }}>
          {msg.lines.map((line, i) => (
            <div key={i} style={{
              opacity: visibleLines > i ? 1 : 0,
              transform: visibleLines > i ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              background: '#f0fdf4', borderRadius: 14,
              padding: '12px 16px',
              fontSize: 14, color: '#374151', lineHeight: 1.65,
              display: 'flex', gap: 10, alignItems: 'flex-start',
              border: '1px solid #d1fae5',
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <Bot size={12} color="#fff"/>
              </div>
              <span>{line}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <a href="/" style={{
            display: 'inline-block', padding: '13px 36px', borderRadius: 999,
            background: `linear-gradient(135deg, ${G}, #2d6a4f)`,
            color: '#fff', fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
            boxShadow: `0 4px 20px ${G}44`,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            Back to Home 🏠
          </a>
          {msg.cta && msg.ctaHref !== '/' && (
            <a href={msg.ctaHref} style={{ fontSize: 13, color: G, fontWeight: 600, textDecoration: 'none', opacity: 0.8 }}>
              {msg.cta}
            </a>
          )}
        </div>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 32, fontSize: 12, color: '#a8a29e', textAlign: 'center' }}>
        Feel & Heal Yoga · Kharghar, Navi Mumbai · <a href="tel:919920155875" style={{ color: '#a8a29e' }}>+91 99201 55875</a>
      </p>

      <style>{`
        @keyframes yogiPulse { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.14);opacity:1} }
        @keyframes yogiBounce { from{opacity:0;transform:scale(0.4) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes yogiSpin { to{transform:rotate(360deg)} }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

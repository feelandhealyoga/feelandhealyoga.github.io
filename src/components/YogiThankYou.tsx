import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

const G = '#1b4332';
const GOLD = '#f59e0b';

const MESSAGES: Record<string, { title: string; lines: string[]; emoji: string }> = {
  trial: {
    emoji: '🧘‍♀️',
    title: "You're all set!",
    lines: [
      "Namaste! Your free trial class is confirmed. 🙏",
      "Our team will WhatsApp you with the slot details shortly.",
      "See you on the mat — bring an open heart and comfy clothes! 🌿",
    ],
  },
  contact: {
    emoji: '💌',
    title: 'Message received!',
    lines: [
      "Namaste! Thank you for reaching out. 🙏",
      "Priyanka will get back to you within 24 hours.",
      "In the meantime, feel free to explore our class schedule. 🌸",
    ],
  },
  franchise: {
    emoji: '🌱',
    title: 'Application received!',
    lines: [
      "Namaste! Your franchise enquiry has been submitted. 🙏",
      "Our team will review your details and connect with you soon.",
      "Excited to grow the Feel & Heal family with you! 🌿",
    ],
  },
  society: {
    emoji: '🏡',
    title: 'Great, we got it!',
    lines: [
      "Namaste! Your society yoga request is in. 🙏",
      "We'll reach out to plan a session that fits your community.",
      "Looking forward to bringing yoga to your doorstep! 🌸",
    ],
  },
};

interface Props {
  name?: string;
  type?: 'trial' | 'contact' | 'franchise' | 'society';
  onReset?: () => void;
  onClose?: () => void;
  resetLabel?: string;
}

export function YogiThankYou({ name, type = 'trial', onReset, onClose, resetLabel }: Props) {
  const msg = MESSAGES[type];
  const firstName = name?.split(' ')[0] || '';
  const [visibleLines, setVisibleLines] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Entrance animation
    const t0 = setTimeout(() => setShow(true), 80);
    const timers: ReturnType<typeof setTimeout>[] = [t0];
    msg.lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 600 + i * 700));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      padding: '36px 24px 32px', textAlign: 'center',
      opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>
      {/* Yogi Avatar with pulse ring */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          background: `${G}18`, animation: 'yogiPulse 2.5s ease-in-out infinite',
        }}/>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `linear-gradient(145deg, ${G}, #2d6a4f)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 28px ${G}44`,
          position: 'relative',
          animation: 'yogiBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <Bot size={32} color="#fff"/>
        </div>
        {/* Sparkles */}
        <span style={{ position:'absolute', top:-4, right:-4, fontSize:18, animation:'yogiSpin 3s linear infinite' }}>✨</span>
      </div>

      {/* Emoji */}
      <div style={{ fontSize: 36, marginBottom: 8, animation: 'yogiBounce 0.7s 0.2s cubic-bezier(0.34,1.56,0.64,1) both', animationFillMode:'both' }}>
        {msg.emoji}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.45rem', fontWeight: 800,
        color: G, marginBottom: 6,
      }}>
        {firstName ? `${msg.title.replace('!', '')}, ${firstName}!` : msg.title}
      </h3>

      {/* Yogi message lines — typed in one by one */}
      <div style={{ margin: '18px 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msg.lines.map((line, i) => (
          <div key={i} style={{
            opacity: visibleLines > i ? 1 : 0,
            transform: visibleLines > i ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            background: '#f0fdf4', borderRadius: 12, padding: '10px 14px',
            fontSize: 13.5, color: '#374151', lineHeight: 1.6,
            textAlign: 'left', display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>
              <Bot size={14} color={G}/>
            </span>
            <span>{line}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {onClose && (
          <button onClick={onClose} style={{
            padding: '11px 28px', borderRadius: 999,
            background: `linear-gradient(135deg, ${G}, #2d6a4f)`,
            color: '#fff', fontWeight: 700, fontSize: 13.5,
            fontFamily: "'Inter', sans-serif", border: 'none', cursor: 'pointer',
            boxShadow: `0 4px 18px ${G}44`,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            Done 🙏
          </button>
        )}
        {onReset && (
          <button onClick={onReset} style={{
            padding: '11px 24px', borderRadius: 999,
            background: 'transparent',
            color: G, fontWeight: 600, fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            border: `1.5px solid ${G}40`, cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = G)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = `${G}40`)}
          >
            {resetLabel || 'Submit another'}
          </button>
        )}
      </div>

      <style>{`
        @keyframes yogiPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.12); opacity: 1; }
        }
        @keyframes yogiBounce {
          from { opacity: 0; transform: scale(0.4) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes yogiSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

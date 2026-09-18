import { useState, useRef, useEffect } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, type ClassType } from '../../../lib/portal-store';
import { X, Send, Loader2, Bot } from 'lucide-react';

const G = '#1b4332';

// ── Natural Language Parser ────────────────────────────────────
function parseDate(text: string): string {
  const today = new Date();
  const lower = text.toLowerCase();

  if (lower.includes('today')) return today.toISOString().split('T')[0];
  if (lower.includes('tomorrow')) {
    const d = new Date(today); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  if (lower.includes('day after')) {
    const d = new Date(today); d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }
  const DAYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  for (const [i, day] of DAYS.entries()) {
    if (lower.includes(day)) {
      const diff = (i - today.getDay() + 7) % 7 || 7;
      const d = new Date(today); d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    }
  }
  const slashMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})/);
  if (slashMatch) {
    const d = new Date(today.getFullYear(), parseInt(slashMatch[2]) - 1, parseInt(slashMatch[1]));
    return d.toISOString().split('T')[0];
  }
  return today.toISOString().split('T')[0];
}

function parseTime(text: string): { start: string; end: string } {
  const lower = text.toLowerCase();
  const match = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (!match) return { start: '06:00', end: '07:00' };
  let h = parseInt(match[1]);
  const m = match[2] ? parseInt(match[2]) : 0;
  const period = match[3];
  if (period === 'pm' && h !== 12) h += 12;
  if (period === 'am' && h === 12) h = 0;
  if (!period && h < 6) h += 12;
  const startH = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const endH   = `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  return { start: startH, end: endH };
}

function extractStudentName(text: string): string {
  const patterns = [
    /\bwith\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
    /\bstudent[:\s]+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
    /\bclient[:\s]+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
    /\bfor\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && !['prajakta','priyanka','today','tomorrow','monday','tuesday','wednesday','thursday','friday','saturday','sunday'].includes(m[1].toLowerCase())) {
      return m[1].trim();
    }
  }
  return '';
}

function parseClassRequest(text: string) {
  const lower = text.toLowerCase();
  const type: ClassType = (lower.includes('personal') || lower.includes('private') || lower.includes('1 on 1') || lower.includes('one on one') || lower.includes('1:1')) ? 'personal' : 'group';
  const date = parseDate(text);
  const { start: time_start, end: time_end } = parseTime(text);
  const student_name = type === 'personal' ? extractStudentName(text) : '';
  const BATCH_KEYWORDS: Record<string, string> = {
    'morning': 'Morning Batch',
    'evening': 'Evening Batch',
    'weight loss': 'Weight Loss Yoga',
    'kids': 'Kids Yoga',
    '6am': 'Morning Batch – 6:00 AM',
    '8am': 'Morning Batch – 8:00 AM',
    '7:30': 'Evening Yoga – 7:30 PM',
    '7pm': 'Evening Yoga – 7:30 PM',
  };
  let batch_name = 'Group Class';
  for (const [kw, name] of Object.entries(BATCH_KEYWORDS)) {
    if (lower.includes(kw)) { batch_name = name; break; }
  }
  return { type, date, time_start, time_end, student_name, batch_name };
}

function isClassIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    (lower.includes('assign') || lower.includes('schedule') || lower.includes('book') || lower.includes('add') || lower.includes('create') || lower.includes('set')) &&
    (lower.includes('class') || lower.includes('session') || lower.includes('personal') || lower.includes('group') || lower.includes('batch') || lower.includes('prajakta'))
  );
}

interface Msg { role: 'user' | 'yogi'; text: string; ts: Date; }
interface ParsedClass {
  type: ClassType; date: string; time_start: string; time_end: string;
  student_name: string; batch_name: string;
}

export function StaffYogi() {
  const { user } = usePortal();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: 'yogi',
    text: `Namaste Priyanka! 🙏 I'm Yogi, your class assistant.\n\nI can help you:\n• **Assign a class** for Prajakta (personal or group)\n• **Check Prajakta's schedule**\n• **View today's classes**\n\nTry saying:\n_"Assign personal session tomorrow at 6am with Anjali"_\n_"Schedule group class Monday 8am"_\n_"What classes does Prajakta have today?"_`,
    ts: new Date(),
  }]);
  const [loading, setLoading] = useState(false);
  const [pendingClass, setPendingClass] = useState<ParsedClass | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const addMsg = (role: 'user' | 'yogi', text: string) => {
    setMsgs(m => [...m, { role, text, ts: new Date() }]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    addMsg('user', text);
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const lower = text.toLowerCase();

    // Confirm pending class
    if (pendingClass && (lower.includes('yes') || lower.includes('confirm') || lower.includes('ok') || lower === 'y')) {
      const cls = pendingClass;
      setPendingClass(null);

      const teachers = portalDB.getUsers().filter(u => u.role === 'teacher');
      const prajakta = teachers.find(u => u.name.toLowerCase().includes('prajakta')) || teachers[0];

      if (prajakta) {
        portalDB.assignClass({
          type: cls.type,
          teacher_id: prajakta.id,
          assigned_by: user.id,
          date: cls.date,
          time_start: cls.time_start,
          time_end: cls.time_end,
          batch_name: cls.type === 'group' ? cls.batch_name : undefined,
          student_name: cls.type === 'personal' ? cls.student_name : undefined,
        });

        const dateLabel = new Date(cls.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
        addMsg('yogi',
          `✅ **Class assigned successfully!**\n\n` +
          `${cls.type === 'personal' ? '👤 Personal Session' : '👥 Group Class'}\n` +
          `📅 ${dateLabel}\n` +
          `⏰ ${cls.time_start} – ${cls.time_end}\n` +
          `${cls.type === 'personal' && cls.student_name ? `👤 Student: ${cls.student_name}\n` : ''}` +
          `${cls.type === 'group' ? `📚 ${cls.batch_name}\n` : ''}` +
          `\nPrajakta can see this in her **Classes** tab when she logs in. 🙏`
        );
      }
      setLoading(false);
      return;
    }

    // Cancel pending
    if (pendingClass && (lower.includes('no') || lower.includes('cancel') || lower.includes('wrong') || lower === 'n')) {
      setPendingClass(null);
      addMsg('yogi', `No problem! Tell me what you'd like to assign instead.`);
      setLoading(false);
      return;
    }

    // Class assignment intent
    if (isClassIntent(text)) {
      const parsed = parseClassRequest(text);
      setPendingClass(parsed);

      const dateLabel = new Date(parsed.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
      addMsg('yogi',
        `Got it! Here's what I'll assign to **Prajakta**:\n\n` +
        `${parsed.type === 'personal' ? '👤 Personal Session' : '👥 Group Class'}\n` +
        `📅 ${dateLabel}\n` +
        `⏰ ${parsed.time_start} – ${parsed.time_end}\n` +
        `${parsed.type === 'personal' ? `👤 Student: ${parsed.student_name || '(not specified)'}` : `📚 ${parsed.batch_name}`}\n\n` +
        `**Confirm?** _(yes / no)_`
      );
      setLoading(false);
      return;
    }

    // Schedule query
    if (lower.includes('schedule') || lower.includes('today') || lower.includes("prajakta") || lower.includes('assigned') || lower.includes('class')) {
      const teachers = portalDB.getUsers().filter(u => u.role === 'teacher');
      const prajakta = teachers.find(u => u.name.toLowerCase().includes('prajakta'));
      if (prajakta) {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayClasses = portalDB.getClassesByTeacherAndDate(prajakta.id, todayStr);
        const upcoming = portalDB.getUpcomingClasses(prajakta.id, 7);

        if (todayClasses.length === 0 && upcoming.length === 0) {
          addMsg('yogi', `Prajakta has **no classes** assigned today or this week.\n\nAssign one? Try:\n_"Assign personal session tomorrow at 6am with Anjali"_`);
        } else {
          let response = '';
          if (todayClasses.length > 0) {
            response += `**Today's Classes (${todayClasses.length}):**\n` +
              todayClasses.map(c => `• ${c.time_start}–${c.time_end} — ${c.type === 'personal' ? `👤 ${c.student_name}` : `👥 ${c.batch_name || 'Group'}`} [${c.status}]`).join('\n');
          } else {
            response += 'No classes today.';
          }
          if (upcoming.length > 0) {
            response += `\n\n**Upcoming:**\n` +
              upcoming.slice(0,5).map(c => {
                const dl = new Date(c.date+'T12:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
                return `• ${dl} ${c.time_start} — ${c.type==='personal' ? `👤 ${c.student_name}` : `👥 ${c.batch_name||'Group'}`}`;
              }).join('\n');
          }
          addMsg('yogi', response);
        }
      }
      setLoading(false);
      return;
    }

    // Default help
    addMsg('yogi',
      `I can help you with:\n\n` +
      `**📅 Assign a class for Prajakta:**\n` +
      `_"Assign personal session tomorrow at 6am with Anjali"_\n` +
      `_"Schedule group class Monday 8am morning batch"_\n` +
      `_"Book 1:1 session today at 5pm for Sneha"_\n\n` +
      `**📋 Check schedule:**\n` +
      `_"What classes does Prajakta have today?"_\n` +
      `_"Show upcoming classes"_`
    );
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  function renderText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2,-2)}</strong>;
      if (p.startsWith('_') && p.endsWith('_')) return <em key={i} style={{ opacity:0.8 }}>{p.slice(1,-1)}</em>;
      return <span key={i}>{p}</span>;
    });
  }

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position:'fixed', bottom:80, right:16, zIndex:1000,
        width:52, height:52, borderRadius:'50%', border:'none', cursor:'pointer',
        background:`linear-gradient(135deg,${G},#2d6a4f)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 20px rgba(27,67,50,0.4)', transition:'transform 0.2s',
      }}>
        {open ? <X size={20} color="#fff"/> : <Bot size={20} color="#fff"/>}
        {!open && pendingClass && (
          <span style={{ position:'absolute', top:0, right:0, width:14, height:14, borderRadius:'50%', background:'#ef4444', border:'2px solid #fff', fontSize:8, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>!</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position:'fixed', bottom:144, right:16, zIndex:1001,
          width:'min(380px, calc(100vw - 32px))',
          height:'min(520px, calc(100dvh - 200px))',
          background:'#fff', borderRadius:16, overflow:'hidden',
          boxShadow:'0 8px 40px rgba(0,0,0,0.18)', display:'flex', flexDirection:'column',
          border:'1px solid #e8e2da',
        }}>
          {/* Header */}
          <div style={{ padding:'14px 16px', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bot size={18} color="#fff"/>
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:'#fff' }}>Yogi — Class Assistant</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>Assign & manage Prajakta's classes</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:10 }}>
            {msgs.map((msg, i) => (
              <div key={i} style={{ display:'flex', flexDirection:msg.role==='user'?'row-reverse':'row', gap:8, alignItems:'flex-end' }}>
                {msg.role === 'yogi' && (
                  <div style={{ width:28, height:28, borderRadius:'50%', background:G, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Bot size={13} color="#fff"/>
                  </div>
                )}
                <div style={{
                  maxWidth:'80%', padding:'10px 12px',
                  borderRadius: msg.role==='user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role==='user' ? G : '#f3f4f6',
                  color: msg.role==='user' ? '#fff' : '#1c1917',
                  fontSize:13, lineHeight:1.55, whiteSpace:'pre-line',
                }}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:G, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Bot size={13} color="#fff"/>
                </div>
                <div style={{ padding:'10px 14px', borderRadius:'12px 12px 12px 2px', background:'#f3f4f6', display:'flex', gap:4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#9ca3af', animation:`bounce 1.2s ${i*0.2}s infinite` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick suggestions */}
          {msgs.length <= 1 && (
            <div style={{ padding:'0 12px 8px', display:'flex', gap:6, flexWrap:'wrap', flexShrink:0 }}>
              {[
                "Assign personal session tomorrow 6am with Anjali",
                "Schedule group class Monday 8am",
                "What classes today?",
              ].map(s => (
                <button key={s} onClick={() => setInput(s)}
                  style={{ padding:'6px 10px', borderRadius:99, border:`1px solid ${G}20`, background:'#f0fdf4', color:G, fontSize:11, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'10px 12px', borderTop:'1px solid #f3f4f6', display:'flex', gap:8, flexShrink:0 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              style={{ flex:1, padding:'10px 12px', borderRadius:10, border:'1.5px solid #e8e2da', fontSize:13, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917', background:'#faf9f7' }}
            />
            <button onClick={handleSend} disabled={!input.trim() || loading}
              style={{ width:40, height:40, borderRadius:10, border:'none', cursor:input.trim()?'pointer':'default', background:input.trim()?G:'#e8e2da', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {loading ? <Loader2 size={16} color="#fff" style={{ animation:'spin 1s linear infinite' }}/> : <Send size={16} color="#fff"/>}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}

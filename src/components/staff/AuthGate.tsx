import { useState } from 'react';
import { portalDB, type User } from '../../lib/portal-store';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const G = '#1b4332';
const GOLD = '#f59e0b';

interface Props { onLogin: (user: User) => void; }

export function AuthGate({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulated delay
    const user = portalDB.login(email.trim(), password);
    setLoading(false);
    if (!user) { setError('Invalid email or password. Please try again.'); return; }
    onLogin(user);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setForgotSent(true);
  };

  return (
    <div style={{ minHeight:'100dvh', background:'#faf9f7', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px' }}>
      {/* Brand */}
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg, ${G}, #2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 4px 20px rgba(27,67,50,0.25)' }}>
          <span style={{ fontSize:24 }}>🌿</span>
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:G, marginBottom:4 }}>Feel & Heal Yoga</h1>
        <p style={{ color:'#78716c', fontSize:13, fontWeight:500 }}>Teacher & Staff Portal</p>
      </div>

      {/* Card */}
      <div style={{ width:'100%', maxWidth:380, background:'#fff', borderRadius:16, border:'1px solid #e8e2da', padding:'32px 28px', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
        {view === 'login' ? (
          <>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#1c1917', marginBottom:6 }}>Welcome back</h2>
            <p style={{ color:'#78716c', fontSize:13, marginBottom:24 }}>Sign in to your account</p>

            {error && (
              <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#dc2626', fontSize:13 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#57534e', marginBottom:6 }}>Email / Mobile</label>
                <input
                  type="text" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@feelandhealyoga.com"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#57534e', marginBottom:6 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight:44 }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#78716c', display:'flex', padding:0 }}>
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'#57534e' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    style={{ width:14, height:14, accentColor:G, cursor:'pointer' }} />
                  Remember me
                </label>
                <button type="button" onClick={() => { setView('forgot'); setError(''); }}
                  style={{ background:'none', border:'none', cursor:'pointer', color:G, fontSize:13, fontWeight:500 }}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                style={{ width:'100%', padding:'13px 0', borderRadius:10, background:loading ? '#9ca3af' : G,
                  border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(27,67,50,0.30)', transition:'all 0.2s' }}>
                {loading ? <><Loader2 size={16} style={{ animation:'spin 1s linear infinite' }}/> Signing in…</> : 'Sign In →'}
              </button>
            </form>

            {/* Demo hints */}
            <div style={{ marginTop:20, padding:'12px 14px', background:'#f0fdf4', borderRadius:8, border:'1px solid #bbf7d0' }}>
              <p style={{ fontSize:11, fontWeight:600, color:G, marginBottom:6 }}>Demo Credentials</p>
              {[
                ['Admin', 'admin@feelandhealyoga.com', 'Admin@1234'],
                ['Senior', 'priyanka@feelandhealyoga.com', 'Teacher@1234'],
                ['Teacher', 'ananya@feelandhealyoga.com', 'Teacher@1234'],
              ].map(([role, em, pw]) => (
                <button key={role} type="button" onClick={() => { setEmail(em); setPassword(pw); }}
                  style={{ display:'block', background:'none', border:'none', cursor:'pointer', fontSize:11, color:'#4b5563', padding:'1px 0', textAlign:'left' }}>
                  <strong style={{ color:G }}>{role}:</strong> {em}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#1c1917', marginBottom:6 }}>Reset Password</h2>
            <p style={{ color:'#78716c', fontSize:13, marginBottom:24 }}>Enter your email to receive a reset link</p>
            {forgotSent ? (
              <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:8, padding:'14px', textAlign:'center' }}>
                <p style={{ color:G, fontWeight:600, fontSize:14 }}>✓ Reset link sent</p>
                <p style={{ color:'#78716c', fontSize:12, marginTop:4 }}>Check your email inbox</p>
              </div>
            ) : (
              <form onSubmit={handleForgot} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" style={inputStyle} />
                <button type="submit" disabled={loading}
                  style={{ width:'100%', padding:'13px 0', borderRadius:10, background:G, border:'none', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            )}
            <button onClick={() => { setView('login'); setForgotSent(false); }}
              style={{ width:'100%', marginTop:14, background:'none', border:'none', cursor:'pointer', color:G, fontSize:13, fontWeight:500 }}>
              ← Back to login
            </button>
          </>
        )}
      </div>
      <p style={{ marginTop:24, fontSize:11, color:'#a8a29e', textAlign:'center' }}>
        © 2025 Feel & Heal Yoga · Internal Staff Portal
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width:'100%', padding:'11px 14px', borderRadius:8,
  border:'1.5px solid #e8e2da', background:'#faf9f7',
  fontSize:14, color:'#1c1917', outline:'none',
  fontFamily:'Inter,sans-serif', transition:'border 0.15s',
};

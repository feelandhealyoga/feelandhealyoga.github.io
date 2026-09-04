import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, LEAVE_TYPE_LABELS, LEAVE_STATUS_COLORS, type LeaveType } from '../../../lib/portal-store';
import { PhotoCapture } from '../shared/PhotoCapture';
import { ChevronLeft, CheckCircle, Loader2, FileText } from 'lucide-react';

const G = '#1b4332';
const LEAVE_TYPES: LeaveType[] = ['full_day','half_day','sick','emergency','other'];

export function ApplyLeave() {
  const { user, navigate, refreshNotifs } = usePortal();
  const [tab, setTab] = useState<'apply'|'history'>('apply');
  const [leaveType, setLeaveType] = useState<LeaveType>('full_day');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const leaves = portalDB.getLeavesByTeacher(user.id).sort((a,b) => b.created_at.localeCompare(a.created_at));
  const allUsers = portalDB.getUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate) { setError('Please select dates.'); return; }
    if (!reason.trim()) { setError('Reason is mandatory.'); return; }
    if (new Date(toDate) < new Date(fromDate)) { setError('End date must be after start date.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    const leave = portalDB.submitLeave({
      teacher_id: user.id,
      leave_type: leaveType,
      from_date: fromDate, to_date: toDate,
      reason, attachment_url: attachment,
    });

    // Notify senior + admin
    const seniors = allUsers.filter(u => u.role === 'senior' || u.role === 'admin');
    const days = Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000) + 1;
    for (const s of seniors) {
      portalDB.addNotification({
        user_id: s.id, type: 'leave_request',
        title: `New Leave Request — ${user.name}`,
        message: `${LEAVE_TYPE_LABELS[leaveType]} · ${days} day${days>1?'s':''} · From ${fromDate} to ${toDate}`,
        reference_id: leave.id,
      });
    }
    refreshNotifs();
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ padding:'40px 16px', maxWidth:420, margin:'0 auto', textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'#fef9c3', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <CheckCircle size={36} color="#ca8a04"/>
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:G, marginBottom:8 }}>Leave Requested</h2>
        <p style={{ color:'#78716c', fontSize:14, marginBottom:24 }}>Your request has been submitted and is pending approval.</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
          <button onClick={() => { setSuccess(false); setTab('history'); }} style={{ padding:'12px 24px', borderRadius:10, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:14, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
            View History
          </button>
          <button onClick={() => navigate('teacher-dashboard')} style={{ padding:'12px 24px', borderRadius:10, border:'1.5px solid #e8e2da', cursor:'pointer', background:'#fff', color:'#57534e', fontSize:14, fontWeight:500, fontFamily:'Inter,sans-serif' }}>
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:480, margin:'0 auto' }}>
      <button onClick={() => navigate('teacher-dashboard')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#78716c', fontSize:13, marginBottom:20, padding:0 }}>
        <ChevronLeft size={15}/> Dashboard
      </button>

      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:16 }}>Leave</h1>

      {/* Tabs */}
      <div style={{ display:'flex', background:'#f3f4f6', borderRadius:8, padding:3, marginBottom:20 }}>
        {[['apply','Apply Leave'],['history','My Requests']].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t as any)}
            style={{ flex:1, padding:'8px 0', borderRadius:6, border:'none', cursor:'pointer', fontSize:13, fontWeight: tab===t ? 600 : 400,
              background: tab===t ? '#fff' : 'transparent', color: tab===t ? G : '#6b7280',
              fontFamily:'Inter,sans-serif', boxShadow: tab===t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition:'all 0.15s' }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'apply' ? (
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {error && <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'10px 14px', color:'#dc2626', fontSize:13 }}>{error}</div>}

          {/* Leave type */}
          <div>
            <label style={labelStyle}>Leave Type <span style={{ color:'#dc2626' }}>*</span></label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {LEAVE_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setLeaveType(t)}
                  style={{ padding:'10px 14px', borderRadius:8, border:`1.5px solid ${leaveType===t ? G : '#e8e2da'}`, cursor:'pointer',
                    background: leaveType===t ? '#f0fdf4' : '#fff', color: leaveType===t ? G : '#57534e',
                    fontSize:12, fontWeight: leaveType===t ? 600 : 400, fontFamily:'Inter,sans-serif', textAlign:'left' }}>
                  {LEAVE_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={labelStyle}>From Date <span style={{ color:'#dc2626' }}>*</span></label>
              <input type="date" required value={fromDate} onChange={e => { setFromDate(e.target.value); if (!toDate) setToDate(e.target.value); }}
                min={new Date().toISOString().split('T')[0]} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>To Date <span style={{ color:'#dc2626' }}>*</span></label>
              <input type="date" required value={toDate} onChange={e => setToDate(e.target.value)}
                min={fromDate || new Date().toISOString().split('T')[0]} style={inputStyle}/>
            </div>
          </div>

          {fromDate && toDate && (
            <p style={{ fontSize:12, color:'#78716c' }}>
              Duration: {Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000) + 1} day(s)
            </p>
          )}

          {/* Reason */}
          <div>
            <label style={labelStyle}>Reason <span style={{ color:'#dc2626' }}>*</span></label>
            <textarea required value={reason} onChange={e => setReason(e.target.value)} rows={3}
              placeholder="Please provide your reason for leave…"
              style={{ ...inputStyle, resize:'none', lineHeight:1.5 }}/>
          </div>

          {/* Attachment */}
          <div>
            <label style={labelStyle}>Supporting Document (optional)</label>
            <PhotoCapture onPhoto={setAttachment} preview={attachment || undefined} />
          </div>

          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'14px 0', borderRadius:10, border:'none', cursor:loading?'not-allowed':'pointer',
              background:loading ? '#9ca3af' : G, color:'#fff', fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(27,67,50,0.28)' }}>
            {loading ? <><Loader2 size={17} style={{ animation:'spin 0.8s linear infinite' }}/> Submitting…</> : 'Submit Leave Request'}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      ) : (
        <div>
          {leaves.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af' }}>
              <FileText size={32} style={{ marginBottom:10, opacity:0.4 }}/>
              <p style={{ fontSize:14 }}>No leave requests yet</p>
            </div>
          ) : leaves.map(l => {
            const sc = LEAVE_STATUS_COLORS[l.status];
            const days = Math.ceil((new Date(l.to_date).getTime() - new Date(l.from_date).getTime()) / 86400000) + 1;
            return (
              <div key={l.id} style={{ background:'#fff', borderRadius:10, border:'1px solid #e8e2da', padding:'14px 16px', marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#1c1917' }}>{LEAVE_TYPE_LABELS[l.leave_type]}</p>
                    <p style={{ fontSize:12, color:'#78716c' }}>{l.from_date} → {l.to_date} · {days} day{days>1?'s':''}</p>
                  </div>
                  <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:sc.bg, color:sc.text }}>
                    {l.status.replace('_',' ').replace(/^\w/,c=>c.toUpperCase())}
                  </span>
                </div>
                <p style={{ fontSize:12, color:'#57534e', marginBottom: l.review_comment ? 6 : 0 }}>{l.reason}</p>
                {l.review_comment && (
                  <p style={{ fontSize:11, color:'#78716c', background:'#f9f9f9', borderRadius:6, padding:'6px 10px', borderLeft:'2px solid #e8e2da' }}>
                    Remark: {l.review_comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display:'block', fontSize:12, fontWeight:600, color:'#57534e', marginBottom:6 };
const inputStyle: React.CSSProperties = {
  width:'100%', padding:'11px 14px', borderRadius:8, border:'1.5px solid #e8e2da',
  background:'#faf9f7', fontSize:14, color:'#1c1917', fontFamily:'Inter,sans-serif', outline:'none',
};

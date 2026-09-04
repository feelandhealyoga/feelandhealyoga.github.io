import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, LEAVE_TYPE_LABELS, LEAVE_STATUS_COLORS } from '../../../lib/portal-store';
import { CheckCircle, XCircle, X } from 'lucide-react';

const G = '#1b4332';

export function AdminLeaveRequests() {
  const { user, refreshNotifs } = usePortal();
  const [tab, setTab] = useState<'pending'|'all'>('pending');
  const [remark, setRemark] = useState('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [refresh, setRefresh] = useState(0);

  const allUsers = portalDB.getUsers();
  const leaves = portalDB.getLeaves()
    .filter(l => tab === 'pending' ? l.status === 'pending' : true)
    .sort((a,b) => b.created_at.localeCompare(a.created_at));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleReview = (id: string, status: 'approved' | 'rejected') => {
    const leave = portalDB.getLeaves().find(l => l.id === id)!;
    portalDB.reviewLeave(id, status, user.id, remark);
    portalDB.addNotification({
      user_id: leave.teacher_id, type: `leave_${status}`,
      title: status === 'approved' ? '✅ Leave Approved' : '❌ Leave Rejected',
      message: `Your ${LEAVE_TYPE_LABELS[leave.leave_type]} request (${leave.from_date} → ${leave.to_date}) has been ${status}.${remark ? ` Remark: ${remark}` : ''}`,
      reference_id: leave.id,
    });
    refreshNotifs();
    setReviewingId(null); setRemark('');
    showToast(status === 'approved' ? 'Leave approved' : 'Leave rejected');
    setRefresh(r => r + 1);
  };

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:600, margin:'0 auto' }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:16 }}>Leave Requests</h1>

      <div style={{ display:'flex', background:'#f3f4f6', borderRadius:8, padding:3, marginBottom:16 }}>
        {[['pending','Pending'],['all','All']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v as any)}
            style={{ flex:1, padding:'8px 0', borderRadius:6, border:'none', cursor:'pointer', fontSize:13, fontWeight: tab===v ? 600 : 400,
              background: tab===v ? '#fff' : 'transparent', color: tab===v ? G : '#6b7280', fontFamily:'Inter,sans-serif', boxShadow: tab===v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
            {l}
          </button>
        ))}
      </div>

      {leaves.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af', fontSize:14 }}>
          No {tab === 'pending' ? 'pending ' : ''}leave requests
        </div>
      ) : leaves.map(l => {
        const teacher = allUsers.find(u => u.id === l.teacher_id);
        const reviewer = allUsers.find(u => u.id === l.reviewed_by);
        const sc = LEAVE_STATUS_COLORS[l.status];
        const days = Math.ceil((new Date(l.to_date).getTime() - new Date(l.from_date).getTime()) / 86400000) + 1;
        const isReviewing = reviewingId === l.id;

        return (
          <div key={l.id} style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700 }}>
                  {teacher?.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'#1c1917' }}>{teacher?.name}</p>
                  <p style={{ fontSize:11, color:'#78716c' }}>{LEAVE_TYPE_LABELS[l.leave_type]} · {days} day{days>1?'s':''}</p>
                </div>
              </div>
              <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:sc.bg, color:sc.text }}>
                {l.status.replace('_',' ').replace(/^\w/,c=>c.toUpperCase())}
              </span>
            </div>

            <div style={{ background:'#faf9f7', borderRadius:8, padding:'10px 12px', marginBottom:10 }}>
              <p style={{ fontSize:12, color:'#57534e', marginBottom:4 }}>📅 {l.from_date} → {l.to_date}</p>
              <p style={{ fontSize:12, color:'#57534e' }}>📝 {l.reason}</p>
            </div>

            {l.attachment_url && (
              <img src={l.attachment_url} alt="" style={{ width:56, height:56, objectFit:'cover', borderRadius:8, border:'1px solid #e8e2da', marginBottom:10, cursor:'pointer' }}
                onClick={() => window.open(l.attachment_url!)}/>
            )}

            {l.review_comment && (
              <p style={{ fontSize:11, color:'#78716c', background:'#faf9f7', padding:'8px 10px', borderRadius:6, borderLeft:'2px solid #e8e2da', marginBottom:10 }}>
                Remark: {l.review_comment} {reviewer ? `(${reviewer.name})` : ''}
              </p>
            )}

            {l.status === 'pending' && (
              <div>
                {!isReviewing ? (
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => { setReviewingId(l.id); setRemark(''); }}
                      style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, border:'none', cursor:'pointer', background:'#dcfce7', color:'#16a34a', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
                      <CheckCircle size={13}/> Approve
                    </button>
                    <button onClick={() => handleReview(l.id, 'rejected')}
                      style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, border:'none', cursor:'pointer', background:'#fee2e2', color:'#dc2626', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
                      <XCircle size={13}/> Reject
                    </button>
                  </div>
                ) : (
                  <div>
                    <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="Remark (optional)…"
                      style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#faf9f7', fontSize:12, fontFamily:'Inter,sans-serif', outline:'none', resize:'none', marginBottom:8 }}/>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => handleReview(l.id, 'approved')} style={{ flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer', background:'#16a34a', color:'#fff', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>✓ Approve</button>
                      <button onClick={() => handleReview(l.id, 'rejected')} style={{ flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer', background:'#dc2626', color:'#fff', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>✗ Reject</button>
                      <button onClick={() => setReviewingId(null)} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #e8e2da', cursor:'pointer', background:'#fff', color:'#57534e', fontSize:12, fontFamily:'Inter,sans-serif' }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {toast && (
        <div style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', background:'#1c1917', color:'#fff', padding:'10px 20px', borderRadius:99, fontSize:13, fontWeight:500, zIndex:9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

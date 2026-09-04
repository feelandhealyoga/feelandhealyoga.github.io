import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB } from '../../../lib/portal-store';
import { Star, Plus, X, Loader2 } from 'lucide-react';

const G = '#1b4332';
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(2024, i, 1);
  return { value: String(i+1).padStart(2,'0'), label: d.toLocaleString('en-IN', { month:'long' }) };
});

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display:'flex', gap:4 }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)} style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}>
          <Star size={20} fill={i <= value ? '#f59e0b' : 'none'} color={i <= value ? '#f59e0b' : '#d1d5db'}/>
        </button>
      ))}
    </div>
  );
}

export function AdminPerformance() {
  const { user } = usePortal();
  const allUsers = portalDB.getUsers();
  const teachers = allUsers.filter(u => u.role === 'teacher' || u.role === 'senior');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [addingReview, setAddingReview] = useState(false);
  const [toast, setToast] = useState('');
  const [refresh, setRefresh] = useState(0);

  const nowYear = new Date().getFullYear();
  const [form, setForm] = useState({
    month: `${nowYear}-${String(new Date().getMonth()+1).padStart(2,'0')}`,
    attendance_rating: 0, performance_rating: 0, professionalism: 0, punctuality: 0,
    student_feedback: 0, remarks: '', goals_next_month: '',
  });

  const allReviews = portalDB.getReviews();
  const displayed = selectedTeacher
    ? allReviews.filter(r => r.teacher_id === selectedTeacher).sort((a,b) => b.month.localeCompare(a.month))
    : allReviews.sort((a,b) => b.month.localeCompare(a.month));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    portalDB.saveReview({ ...form, teacher_id: selectedTeacher, reviewer_id: user.id });
    // Notify teacher
    portalDB.addNotification({
      user_id: selectedTeacher, type: 'performance_review',
      title: '📊 Performance Review Added',
      message: `Your monthly performance review for ${form.month} has been added by ${user.name}.`,
    });
    setAddingReview(false);
    setRefresh(r => r + 1);
    showToast('Review saved');
  };

  const overallScore = (r: { attendance_rating:number; performance_rating:number; professionalism:number; punctuality:number }) =>
    Math.round((r.attendance_rating + r.performance_rating + r.professionalism + r.punctuality) / 4);

  const overallLabel = (s: number) =>
    s >= 5 ? 'Outstanding' : s >= 4 ? 'Excellent' : s >= 3 ? 'Good' : s >= 2 ? 'Needs Improvement' : 'Poor';

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:640, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G }}>Performance</h1>
        <button onClick={() => setAddingReview(true)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', borderRadius:8, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
          <Plus size={13}/> Add Review
        </button>
      </div>

      {/* Teacher filter */}
      <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}
        style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#fff', fontSize:13, fontFamily:'Inter,sans-serif', color:'#1c1917', marginBottom:16, outline:'none' }}>
        <option value="">All Teachers</option>
        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      {/* Summary cards per teacher */}
      {!selectedTeacher && (
        <div style={{ marginBottom:16 }}>
          {teachers.map(t => {
            const recentReview = allReviews.filter(r => r.teacher_id === t.id).sort((a,b) => b.month.localeCompare(a.month))[0];
            const monthStats = portalDB.getMonthlyStats(t.id, new Date().getFullYear(), new Date().getMonth()+1);
            return (
              <div key={t.id} onClick={() => setSelectedTeacher(t.id)}
                style={{ background:'#fff', borderRadius:10, border:'1px solid #e8e2da', padding:'14px 16px', marginBottom:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700 }}>
                    {t.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#1c1917' }}>{t.name}</p>
                    <p style={{ fontSize:11, color:'#78716c' }}>Attendance: {monthStats.percent}% · Leaves: {monthStats.leave}</p>
                  </div>
                </div>
                {recentReview ? (
                  <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:'#f0fdf4', color:G }}>
                    {overallLabel(overallScore(recentReview))}
                  </span>
                ) : <span style={{ fontSize:11, color:'#9ca3af' }}>Not reviewed</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Reviews list */}
      {selectedTeacher && (
        <button onClick={() => setSelectedTeacher('')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#78716c', fontSize:12, marginBottom:12, padding:0 }}>
          ← All Teachers
        </button>
      )}

      {displayed.map(r => {
        const teacher = allUsers.find(u => u.id === r.teacher_id);
        const reviewer = allUsers.find(u => u.id === r.reviewer_id);
        const overall = overallScore(r);
        return (
          <div key={r.id} style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div>
                {!selectedTeacher && <p style={{ fontSize:12, color:'#78716c', marginBottom:2 }}>{teacher?.name}</p>}
                <p style={{ fontSize:14, fontWeight:700, color:'#1c1917' }}>
                  {new Date(r.month + '-01').toLocaleString('en-IN', { month:'long', year:'numeric' })}
                </p>
              </div>
              <span style={{ padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:700, background:'#f0fdf4', color:G }}>{overallLabel(overall)}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:10 }}>
              {[['Attendance',r.attendance_rating],['Performance',r.performance_rating],['Professionalism',r.professionalism],['Punctuality',r.punctuality]].map(([l,v]) => (
                <div key={l as string} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:'#57534e', width:120 }}>{l}</span>
                  <div style={{ display:'flex', gap:2 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={13} fill={i <= (v as number) ? '#f59e0b' : 'none'} color={i <= (v as number) ? '#f59e0b' : '#d1d5db'}/>)}
                  </div>
                </div>
              ))}
              {r.student_feedback > 0 && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:'#57534e', width:120 }}>Student Feedback</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#f59e0b' }}>⭐ {r.student_feedback}/5</span>
                </div>
              )}
            </div>
            {r.remarks && <p style={{ fontSize:12, color:'#57534e', background:'#faf9f7', borderRadius:8, padding:'8px 10px', marginBottom:8 }}>{r.remarks}</p>}
            {r.goals_next_month && <p style={{ fontSize:12, color:G, background:'#f0fdf4', borderRadius:8, padding:'8px 10px' }}>🎯 {r.goals_next_month}</p>}
            {reviewer && <p style={{ fontSize:10, color:'#9ca3af', marginTop:8 }}>By {reviewer.name}</p>}
          </div>
        );
      })}

      {displayed.length === 0 && <div style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af', fontSize:14 }}>No reviews yet</div>}

      {/* Add Review Modal */}
      {addingReview && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:'24px 20px', width:'100%', maxWidth:440, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:G }}>Add Monthly Review</h2>
              <button onClick={() => setAddingReview(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#78716c' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={lStyle}>Teacher</label>
                <select required value={selectedTeacher || ''} onChange={e => setSelectedTeacher(e.target.value)} style={iStyle}>
                  <option value="">Select teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label style={lStyle}>Month</label>
                <input type="month" required value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} style={iStyle}/>
              </div>
              {[['attendance_rating','Attendance'],['performance_rating','Performance'],['professionalism','Professionalism'],['punctuality','Punctuality']].map(([k,l]) => (
                <div key={k}>
                  <label style={lStyle}>{l}</label>
                  <StarInput value={(form as any)[k]} onChange={v => setForm(f => ({ ...f, [k]: v }))}/>
                </div>
              ))}
              <div>
                <label style={lStyle}>Student Feedback (0-5)</label>
                <input type="number" min="0" max="5" step="0.1" value={form.student_feedback || ''} onChange={e => setForm(f => ({ ...f, student_feedback: Number(e.target.value) }))} style={iStyle} placeholder="4.5"/>
              </div>
              <div>
                <label style={lStyle}>Remarks</label>
                <textarea value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} rows={3} style={{ ...iStyle, resize:'none' }}/>
              </div>
              <div>
                <label style={lStyle}>Goals for Next Month</label>
                <textarea value={form.goals_next_month} onChange={e => setForm(f => ({ ...f, goals_next_month: e.target.value }))} rows={2} style={{ ...iStyle, resize:'none' }}/>
              </div>
              <button type="submit" style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:14, fontWeight:700, fontFamily:'Inter,sans-serif' }}>
                Save Review
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', background:'#1c1917', color:'#fff', padding:'10px 20px', borderRadius:99, fontSize:13, fontWeight:500, zIndex:9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

const lStyle: React.CSSProperties = { display:'block', fontSize:12, fontWeight:600, color:'#57534e', marginBottom:5 };
const iStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#faf9f7', fontSize:13, color:'#1c1917', fontFamily:'Inter,sans-serif', outline:'none' };

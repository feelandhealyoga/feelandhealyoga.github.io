import { usePortal } from '../StaffPortal';
import { portalDB } from '../../../lib/portal-store';
import { ChevronLeft, Star, TrendingUp } from 'lucide-react';

const G = '#1b4332';

function StarRating({ value }: { value: number }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} fill={i <= value ? '#f59e0b' : 'none'} color={i <= value ? '#f59e0b' : '#d1d5db'}/>
      ))}
    </div>
  );
}

export function TeacherPerformance() {
  const { user, navigate } = usePortal();
  const now = new Date();
  const reviews = portalDB.getReviewsByTeacher(user.id).sort((a,b) => b.month.localeCompare(a.month));
  const stats = portalDB.getMonthlyStats(user.id, now.getFullYear(), now.getMonth() + 1);
  const allUsers = portalDB.getUsers();

  const overall = reviews.length > 0 ? Math.round(
    (reviews[0].attendance_rating + reviews[0].performance_rating + reviews[0].professionalism + reviews[0].punctuality) / 4
  ) : null;

  const overallLabel = (score: number | null) => {
    if (!score) return 'Not Reviewed';
    if (score >= 5) return 'Outstanding';
    if (score >= 4) return 'Excellent';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:480, margin:'0 auto' }}>
      <button onClick={() => navigate('teacher-dashboard')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#78716c', fontSize:13, marginBottom:20, padding:0 }}>
        <ChevronLeft size={15}/> Dashboard
      </button>

      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:20 }}>My Performance</h1>

      {/* Overall summary */}
      <div style={{ background:`linear-gradient(135deg,${G},#2d6a4f)`, borderRadius:16, padding:'24px 20px', color:'#fff', marginBottom:20 }}>
        <p style={{ fontSize:11, opacity:0.7, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Overall Performance</p>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:4 }}>
          {overallLabel(overall)}
        </p>
        {overall && <StarRating value={overall}/>}
        <p style={{ fontSize:11, opacity:0.6, marginTop:8 }}>
          {now.toLocaleString('en-IN', { month:'long', year:'numeric' })}
        </p>
      </div>

      {/* This month stats */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:16 }}>
        <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>This Month — Attendance</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { label:'Attendance', value:`${stats.present+stats.late} / ${stats.working}`, sub:`${stats.percent}%`, color:G },
            { label:'Late Marks', value:stats.late, sub:'days', color:'#ea580c' },
            { label:'Leaves Taken', value:stats.leave, sub:'days', color:'#ca8a04' },
            { label:'Absent Days', value:stats.absent, sub:'days', color:'#dc2626' },
          ].map(s => (
            <div key={s.label} style={{ background:'#faf9f7', borderRadius:10, padding:'14px' }}>
              <p style={{ fontSize:11, color:'#78716c', marginBottom:4 }}>{s.label}</p>
              <p style={{ fontSize:20, fontWeight:700, color:s.color }}>{s.value}</p>
              <p style={{ fontSize:10, color:'#9ca3af' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly reviews */}
      <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Monthly Reviews</p>

      {reviews.length === 0 ? (
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'32px', textAlign:'center' }}>
          <TrendingUp size={28} color="#d1d5db" style={{ marginBottom:10 }}/>
          <p style={{ fontSize:14, color:'#9ca3af' }}>No reviews yet</p>
          <p style={{ fontSize:12, color:'#d1d5db', marginTop:4 }}>Your senior teacher will add monthly reviews</p>
        </div>
      ) : reviews.map(r => {
        const reviewer = allUsers.find(u => u.id === r.reviewer_id);
        const overallScore = Math.round((r.attendance_rating + r.performance_rating + r.professionalism + r.punctuality) / 4);
        return (
          <div key={r.id} style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#1c1917' }}>
                {new Date(r.month + '-01').toLocaleString('en-IN', { month:'long', year:'numeric' })}
              </p>
              <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background:'#f0fdf4', color:G }}>
                {overallLabel(overallScore)}
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
              {[
                ['Attendance', r.attendance_rating],
                ['Performance', r.performance_rating],
                ['Professionalism', r.professionalism],
                ['Punctuality', r.punctuality],
              ].map(([label, val]) => (
                <div key={label as string} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:'#57534e', width:110 }}>{label}</span>
                  <StarRating value={val as number}/>
                </div>
              ))}
              {r.student_feedback > 0 && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:'#57534e', width:110 }}>Student Rating</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#f59e0b' }}>⭐ {r.student_feedback} / 5</span>
                </div>
              )}
            </div>
            {r.remarks && (
              <div style={{ background:'#faf9f7', borderRadius:8, padding:'10px 12px', marginBottom:8 }}>
                <p style={{ fontSize:11, color:'#78716c', marginBottom:3 }}>Remarks</p>
                <p style={{ fontSize:12, color:'#57534e', lineHeight:1.5 }}>{r.remarks}</p>
              </div>
            )}
            {r.goals_next_month && (
              <div style={{ background:'#f0fdf4', borderRadius:8, padding:'10px 12px' }}>
                <p style={{ fontSize:11, color:'#78716c', marginBottom:3 }}>Goals for Next Month</p>
                <p style={{ fontSize:12, color:G, lineHeight:1.5 }}>{r.goals_next_month}</p>
              </div>
            )}
            {reviewer && <p style={{ fontSize:10, color:'#9ca3af', marginTop:8 }}>Reviewed by {reviewer.name}</p>}
          </div>
        );
      })}
    </div>
  );
}

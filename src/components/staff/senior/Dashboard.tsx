import { usePortal } from '../StaffPortal';
import { portalDB, STATUS_COLORS, LEAVE_STATUS_COLORS } from '../../../lib/portal-store';
import { Users, Clock, FileText, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const G = '#1b4332';

export function SeniorDashboard() {
  const { user, navigate } = usePortal();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const myTeachers = portalDB.getTeachersUnderSenior(user.id);
  const todayAll = portalDB.getAttendanceByDate(todayStr);
  const batches = portalDB.getBatches();
  const pendingLeaves = portalDB.getPendingLeaves().filter(l =>
    myTeachers.some(t => t.id === l.teacher_id)
  );

  const presentToday = todayAll.filter(a => myTeachers.some(t => t.id === a.teacher_id) && ['present','late'].includes(a.status));
  const absentToday = myTeachers.filter(t => !todayAll.some(a => a.teacher_id === t.id && ['present','late','leave'].includes(a.status)));
  const onLeaveToday = todayAll.filter(a => myTeachers.some(t => t.id === a.teacher_id) && a.status === 'leave');

  const dateStr = now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });

  return (
    <div style={{ padding:'20px 16px 32px', maxWidth:600, margin:'0 auto' }}>
      <p style={{ fontSize:12, color:'#78716c', marginBottom:2 }}>{dateStr}</p>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:G, marginBottom:20 }}>
        Good Morning, {user.name.split(' ')[0]} 🌿
      </h1>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
        {[
          { label:'Teachers', value:myTeachers.length, color:G, bg:'#f0fdf4' },
          { label:'Present', value:presentToday.length, color:'#16a34a', bg:'#dcfce7' },
          { label:'Absent', value:absentToday.length, color:'#dc2626', bg:'#fee2e2' },
          { label:'On Leave', value:onLeaveToday.length, color:'#ca8a04', bg:'#fef9c3' },
        ].map(k => (
          <div key={k.label} style={{ background:k.bg, borderRadius:10, padding:'14px 10px', textAlign:'center', border:`1px solid ${k.color}20` }}>
            <p style={{ fontSize:22, fontWeight:700, color:k.color }}>{k.value}</p>
            <p style={{ fontSize:10, color:'#78716c', marginTop:2 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        <button onClick={() => navigate('senior-team')} style={{ padding:'16px', borderRadius:12, border:'1px solid #e8e2da', background:'#fff', cursor:'pointer', textAlign:'left', fontFamily:'Inter,sans-serif' }}>
          <Users size={20} color={G} style={{ marginBottom:8 }}/>
          <p style={{ fontSize:13, fontWeight:700, color:'#1c1917', marginBottom:2 }}>Team Attendance</p>
          <p style={{ fontSize:11, color:'#78716c' }}>View today's records</p>
        </button>
        <button onClick={() => navigate('senior-leaves')} style={{ position:'relative', padding:'16px', borderRadius:12, border:'1px solid #e8e2da', background:'#fff', cursor:'pointer', textAlign:'left', fontFamily:'Inter,sans-serif' }}>
          {pendingLeaves.length > 0 && (
            <span style={{ position:'absolute', top:10, right:10, background:'#ef4444', color:'#fff', borderRadius:99, width:18, height:18, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {pendingLeaves.length}
            </span>
          )}
          <FileText size={20} color="#f59e0b" style={{ marginBottom:8 }}/>
          <p style={{ fontSize:13, fontWeight:700, color:'#1c1917', marginBottom:2 }}>Leave Requests</p>
          <p style={{ fontSize:11, color:'#78716c' }}>Approve or reject</p>
        </button>
      </div>

      {/* Absent teachers alert */}
      {absentToday.length > 0 && (
        <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
          <p style={{ fontSize:13, fontWeight:600, color:'#dc2626', marginBottom:8 }}>⚠️ Not Marked Today</p>
          {absentToday.map(t => (
            <p key={t.id} style={{ fontSize:12, color:'#78716c' }}>• {t.name}</p>
          ))}
        </div>
      )}

      {/* Today's attendance */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden', marginBottom:16 }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em' }}>Today's Attendance</p>
          <button onClick={() => navigate('senior-team')} style={{ background:'none', border:'none', cursor:'pointer', color:G, fontSize:12, fontWeight:500, display:'flex', alignItems:'center', gap:4 }}>
            View all <ChevronRight size={13}/>
          </button>
        </div>
        {myTeachers.length === 0 ? (
          <div style={{ padding:'24px', textAlign:'center', color:'#9ca3af', fontSize:13 }}>No teachers assigned yet</div>
        ) : myTeachers.map(teacher => {
          const rec = todayAll.find(a => a.teacher_id === teacher.id);
          const sc = rec ? STATUS_COLORS[rec.status] : STATUS_COLORS.not_marked;
          return (
            <div key={teacher.id} style={{ padding:'12px 16px', borderBottom:'1px solid #fafafa', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {teacher.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#1c1917' }}>{teacher.name}</p>
                  <p style={{ fontSize:11, color:'#78716c' }}>
                    {rec?.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : '--'}
                    {rec?.batch_id ? ' · ' + batches.find(b => b.id === rec.batch_id)?.name : ''}
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {rec?.photo_url && (
                  <img src={rec.photo_url} alt="" style={{ width:28, height:28, borderRadius:6, objectFit:'cover', border:'1px solid #e8e2da', cursor:'pointer' }} onClick={() => window.open(rec.photo_url!)}/>
                )}
                <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:sc.bg, color:sc.text }}>
                  {sc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending leaves */}
      {pendingLeaves.length > 0 && (
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em' }}>Pending Leave Requests</p>
            <button onClick={() => navigate('senior-leaves')} style={{ background:'none', border:'none', cursor:'pointer', color:G, fontSize:12, fontWeight:500, display:'flex', alignItems:'center', gap:4 }}>
              View all <ChevronRight size={13}/>
            </button>
          </div>
          {pendingLeaves.slice(0,3).map(l => {
            const teacher = myTeachers.find(t => t.id === l.teacher_id);
            return (
              <div key={l.id} style={{ padding:'12px 16px', borderBottom:'1px solid #fafafa', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#1c1917' }}>{teacher?.name}</p>
                  <p style={{ fontSize:11, color:'#78716c' }}>{l.from_date} → {l.to_date}</p>
                </div>
                <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:'#fef9c3', color:'#ca8a04' }}>Pending</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

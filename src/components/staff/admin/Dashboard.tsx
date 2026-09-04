import { usePortal } from '../StaffPortal';
import { portalDB, STATUS_COLORS } from '../../../lib/portal-store';
import { Users, CheckCircle, XCircle, Clock, FileText, TrendingUp, ChevronRight } from 'lucide-react';

const G = '#1b4332';

export function AdminDashboard() {
  const { navigate } = usePortal();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const allUsers = portalDB.getUsers();
  const teachers = allUsers.filter(u => u.role === 'teacher' || u.role === 'senior');
  const activeTeachers = teachers.filter(t => t.status === 'active');
  const todayAll = portalDB.getAttendanceByDate(todayStr);
  const pendingLeaves = portalDB.getPendingLeaves();
  const batches = portalDB.getBatches();

  const presentToday = todayAll.filter(a => activeTeachers.some(t => t.id === a.teacher_id) && ['present','late'].includes(a.status));
  const onLeaveToday = todayAll.filter(a => a.status === 'leave');
  const absentToday = activeTeachers.filter(t => !todayAll.some(a => a.teacher_id === t.id));
  const attendancePct = activeTeachers.length > 0 ? Math.round((presentToday.length / activeTeachers.length) * 100) : 0;

  const dateStr = now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <div style={{ padding:'20px 16px 32px', maxWidth:720, margin:'0 auto' }}>
      <p style={{ fontSize:12, color:'#78716c', marginBottom:2 }}>{dateStr}</p>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:G, marginBottom:20 }}>Admin Dashboard</h1>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {[
          { label:'Total Teachers', value:activeTeachers.length, color:G, bg:'#f0fdf4', icon:<Users size={16}/> },
          { label:'Present Today', value:presentToday.length, color:'#16a34a', bg:'#dcfce7', icon:<CheckCircle size={16}/> },
          { label:'Absent Today', value:absentToday.length, color:'#dc2626', bg:'#fee2e2', icon:<XCircle size={16}/> },
          { label:'On Leave', value:onLeaveToday.length, color:'#ca8a04', bg:'#fef9c3', icon:<FileText size={16}/> },
          { label:'Pending Leaves', value:pendingLeaves.length, color:'#7c3aed', bg:'#ede9fe', icon:<Clock size={16}/> },
          { label:'Attendance %', value:`${attendancePct}%`, color:G, bg:'#f0fdf4', icon:<TrendingUp size={16}/> },
        ].map(k => (
          <div key={k.label} style={{ background:k.bg, borderRadius:12, padding:'14px 12px', border:`1px solid ${k.color}20` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <span style={{ color:k.color }}>{k.icon}</span>
            </div>
            <p style={{ fontSize:22, fontWeight:700, color:k.color, marginBottom:2 }}>{k.value}</p>
            <p style={{ fontSize:10, color:'#78716c' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Quick nav tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        {([
          ['Manage Teachers', 'admin-teachers', '#1b4332', '#f0fdf4'],
          ['All Attendance', 'admin-attendance', '#0369a1', '#eff6ff'],
          ['Leave Requests', 'admin-leaves', '#7c3aed', '#ede9fe'],
          ['Reports', 'admin-reports', '#c2410c', '#fff7ed'],
        ] as const).map(([label, route, color, bg]) => (
          <button key={route} onClick={() => navigate(route as any)}
            style={{ padding:'16px', borderRadius:12, border:`1px solid ${color}20`, background:bg, cursor:'pointer', textAlign:'left', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <p style={{ fontSize:13, fontWeight:600, color }}>{label}</p>
            <ChevronRight size={14} color={color}/>
          </button>
        ))}
      </div>

      {/* Today's Attendance */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden', marginBottom:16 }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between' }}>
          <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em' }}>Today's Attendance</p>
          <button onClick={() => navigate('admin-attendance')} style={{ background:'none', border:'none', cursor:'pointer', color:G, fontSize:12, fontWeight:500 }}>View all →</button>
        </div>
        {activeTeachers.slice(0,6).map(teacher => {
          const rec = todayAll.find(a => a.teacher_id === teacher.id);
          const sc = rec ? STATUS_COLORS[rec.status] : STATUS_COLORS.not_marked;
          return (
            <div key={teacher.id} style={{ padding:'11px 16px', borderBottom:'1px solid #fafafa', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {teacher.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:500, color:'#1c1917' }}>{teacher.name}</p>
                  <p style={{ fontSize:10, color:'#78716c' }}>
                    {rec?.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : 'Not marked'}
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {rec?.photo_url && <img src={rec.photo_url} alt="" style={{ width:28, height:28, borderRadius:6, objectFit:'cover', border:'1px solid #e8e2da' }}/>}
                <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:sc.bg, color:sc.text }}>{sc.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending leaves */}
      {pendingLeaves.length > 0 && (
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between' }}>
            <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em' }}>Pending Leave Requests</p>
            <button onClick={() => navigate('admin-leaves')} style={{ background:'none', border:'none', cursor:'pointer', color:G, fontSize:12, fontWeight:500 }}>View all →</button>
          </div>
          {pendingLeaves.slice(0,3).map(l => {
            const teacher = allUsers.find(u => u.id === l.teacher_id);
            return (
              <div key={l.id} style={{ padding:'11px 16px', borderBottom:'1px solid #fafafa', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:500, color:'#1c1917' }}>{teacher?.name}</p>
                  <p style={{ fontSize:11, color:'#78716c' }}>{l.from_date} → {l.to_date} · {l.leave_type.replace('_',' ')}</p>
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

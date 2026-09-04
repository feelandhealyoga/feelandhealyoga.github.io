import { usePortal } from '../StaffPortal';
import { portalDB } from '../../../lib/portal-store';
import { Clock, Calendar, FileText, Star, ChevronRight, CheckCircle, AlertCircle, Info } from 'lucide-react';

const G = '#1b4332';

export function TeacherDashboard() {
  const { user, navigate } = usePortal();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const todayAttendance = portalDB.getTodayAttendanceForTeacher(user.id);
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const stats = portalDB.getMonthlyStats(user.id, year, month);
  const pendingLeaves = portalDB.getLeavesByTeacher(user.id).filter(l => l.status === 'pending').length;
  const recentActivity = portalDB.getAttendanceByTeacher(user.id).slice(-5).reverse();
  const batches = portalDB.getBatches();

  const attendanceStatus = todayAttendance?.status || 'not_marked';
  const statusConfig = {
    present:    { label:'Present',    bg:'#dcfce7', color:'#16a34a', icon:<CheckCircle size={14}/> },
    late:       { label:'Late',       bg:'#ffedd5', color:'#ea580c', icon:<Clock size={14}/> },
    leave:      { label:'On Leave',   bg:'#fef9c3', color:'#ca8a04', icon:<Calendar size={14}/> },
    absent:     { label:'Absent',     bg:'#fee2e2', color:'#dc2626', icon:<AlertCircle size={14}/> },
    not_marked: { label:'Not Marked', bg:'#f3f4f6', color:'#6b7280', icon:<Info size={14}/> },
    half_day:   { label:'Half Day',   bg:'#ede9fe', color:'#7c3aed', icon:<Clock size={14}/> },
    holiday:    { label:'Holiday',    bg:'#dbeafe', color:'#1d4ed8', icon:<Star size={14}/> },
  }[attendanceStatus] || { label:'Not Marked', bg:'#f3f4f6', color:'#6b7280', icon:<Info size={14}/> };

  return (
    <div style={{ padding:'20px 16px 32px', maxWidth:480, margin:'0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:12, color:'#78716c', marginBottom:2 }}>{dateStr}</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:G, lineHeight:1.2 }}>
          {greeting}, {user.name.split(' ')[0]} 🌿
        </h1>
      </div>

      {/* Today's Status */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:16 }}>
        <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Today's Status</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:99, background:statusConfig.bg, color:statusConfig.color, fontSize:13, fontWeight:600 }}>
              {statusConfig.icon} {statusConfig.label}
            </span>
            {todayAttendance?.check_in_time && (
              <span style={{ fontSize:12, color:'#78716c' }}>
                at {new Date(todayAttendance.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
              </span>
            )}
          </div>
          {todayAttendance?.batch_id && (
            <span style={{ fontSize:11, color:'#9ca3af' }}>
              {batches.find(b => b.id === todayAttendance.batch_id)?.name}
            </span>
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <button onClick={() => navigate('teacher-attendance')}
          style={{ padding:'20px 16px', borderRadius:12, border:'none', cursor:'pointer', background:G, color:'#fff', textAlign:'left', fontFamily:'Inter,sans-serif', boxShadow:'0 4px 16px rgba(27,67,50,0.25)' }}>
          <Clock size={22} style={{ marginBottom:10, opacity:0.85 }}/>
          <p style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>Mark Attendance</p>
          <p style={{ fontSize:11, opacity:0.7 }}>Tap to check in</p>
        </button>
        <button onClick={() => navigate('teacher-leave')}
          style={{ padding:'20px 16px', borderRadius:12, border:'1px solid #e8e2da', cursor:'pointer', background:'#fff', textAlign:'left', fontFamily:'Inter,sans-serif' }}>
          <FileText size={22} style={{ marginBottom:10, color:'#f59e0b' }}/>
          <p style={{ fontSize:14, fontWeight:700, color:'#1c1917', marginBottom:3 }}>Apply Leave</p>
          <p style={{ fontSize:11, color:'#78716c' }}>Request time off</p>
        </button>
      </div>

      {/* Monthly Stats */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em' }}>This Month</p>
          <button onClick={() => navigate('teacher-history')} style={{ background:'none', border:'none', cursor:'pointer', color:G, fontSize:12, fontWeight:500, display:'flex', alignItems:'center', gap:4 }}>
            View all <ChevronRight size={13}/>
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {[
            { label:'Present', value:stats.present + stats.late, color:'#16a34a' },
            { label:'Leaves', value:stats.leave, color:'#d97706' },
            { label:'Absent', value:stats.absent, color:'#dc2626' },
            { label:'%', value:`${stats.percent}%`, color:G },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center', padding:'10px 4px', background:'#faf9f7', borderRadius:8 }}>
              <p style={{ fontSize:18, fontWeight:700, color:s.color, marginBottom:2 }}>{s.value}</p>
              <p style={{ fontSize:10, color:'#78716c' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Leaves notice */}
      {pendingLeaves > 0 && (
        <div style={{ background:'#fefce8', border:'1px solid #fde047', borderRadius:10, padding:'12px 14px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <FileText size={15} color="#ca8a04"/>
            <p style={{ fontSize:13, color:'#78350f', fontWeight:500 }}>{pendingLeaves} leave request{pendingLeaves>1?'s':''} pending</p>
          </div>
          <button onClick={() => navigate('teacher-leave')} style={{ background:'none', border:'none', cursor:'pointer', color:'#ca8a04', fontSize:12, fontWeight:600 }}>View →</button>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
        {[
          { label:'Attendance History', icon:<Calendar size={15}/>, route:'teacher-history' as const },
          { label:'My Performance', icon:<Star size={15}/>, route:'teacher-performance' as const },
        ].map(item => (
          <button key={item.route} onClick={() => navigate(item.route)}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px', borderRadius:10, border:'1px solid #e8e2da', background:'#fff', cursor:'pointer', color:'#57534e', fontSize:13, fontWeight:500, fontFamily:'Inter,sans-serif' }}>
            <span style={{ color:G }}>{item.icon}</span> {item.label}
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #f3f4f6' }}>
          <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em' }}>Recent Activity</p>
        </div>
        {recentActivity.length === 0 ? (
          <div style={{ padding:'24px', textAlign:'center', color:'#9ca3af', fontSize:13 }}>No activity yet</div>
        ) : recentActivity.map(r => {
          const sc = { present:'#16a34a', late:'#ea580c', leave:'#ca8a04', absent:'#dc2626', not_marked:'#6b7280', half_day:'#7c3aed', holiday:'#1d4ed8' }[r.status] || '#6b7280';
          return (
            <div key={r.id} style={{ padding:'12px 16px', borderBottom:'1px solid #fafafa', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:13, fontWeight:500, color:'#1c1917' }}>
                  {new Date(r.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                </p>
                <p style={{ fontSize:11, color:'#78716c' }}>
                  {batches.find(b => b.id === r.batch_id)?.name || 'General'}
                </p>
              </div>
              <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:sc+'20', color:sc }}>
                {r.status.replace('_',' ').replace(/^\w/, c => c.toUpperCase())}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, STATUS_COLORS, type AttendanceStatus } from '../../../lib/portal-store';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const G = '#1b4332';
const STATUS_DOT: Record<AttendanceStatus, string> = {
  present:'#16a34a', absent:'#dc2626', late:'#ea580c',
  leave:'#ca8a04', half_day:'#7c3aed', holiday:'#1d4ed8', not_marked:'#e5e7eb',
};

export function AttendanceHistory() {
  const { user, navigate } = usePortal();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selected, setSelected] = useState<string | null>(null);

  const records = portalDB.getAttendanceByTeacher(user.id);
  const batches = portalDB.getBatches();

  const recordMap = Object.fromEntries(records.map(r => [r.date, r]));
  const stats = portalDB.getMonthlyStats(user.id, year, month);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const monthName = new Date(year, month - 1).toLocaleString('en-IN', { month:'long', year:'numeric' });

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y+1); } else setMonth(m => m+1); };

  const dateStr = (d: number) => `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const selectedRecord = selected ? recordMap[selected] : null;

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:480, margin:'0 auto' }}>
      <button onClick={() => navigate('teacher-dashboard')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#78716c', fontSize:13, marginBottom:20, padding:0 }}>
        <ChevronLeft size={15}/> Dashboard
      </button>

      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:20 }}>Attendance History</h1>

      {/* Month navigator */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <button onClick={prevMonth} style={{ width:32, height:32, borderRadius:8, border:'1px solid #e8e2da', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><ChevronLeft size={15}/></button>
        <p style={{ fontSize:15, fontWeight:700, color:'#1c1917' }}>{monthName}</p>
        <button onClick={nextMonth} style={{ width:32, height:32, borderRadius:8, border:'1px solid #e8e2da', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><ChevronRight size={15}/></button>
      </div>

      {/* Calendar */}
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:16 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:8 }}>
          {['S','M','T','W','T','F','S'].map((d,i) => (
            <div key={i} style={{ textAlign:'center', fontSize:11, fontWeight:600, color:'#9ca3af', padding:'4px 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {Array(firstDay).fill(null).map((_,i) => <div key={`e${i}`}/>)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const ds = dateStr(day);
            const rec = recordMap[ds];
            const isToday = ds === now.toISOString().split('T')[0];
            const dotColor = rec ? STATUS_DOT[rec.status] : '#e5e7eb';
            const isSel = selected === ds;
            return (
              <button key={day} onClick={() => setSelected(isSel ? null : ds)}
                style={{ aspectRatio:'1', borderRadius:8, border: isSel ? `2px solid ${G}` : '1.5px solid transparent', background: isToday ? '#f0fdf4' : isSel ? '#fafff8' : 'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
                <span style={{ fontSize:12, fontWeight: isToday ? 700 : 400, color: isToday ? G : '#1c1917' }}>{day}</span>
                {rec && <span style={{ width:5, height:5, borderRadius:'50%', background:dotColor, display:'block' }}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
        {[['#16a34a','Present'],['#dc2626','Absent'],['#ea580c','Late'],['#ca8a04','Leave'],['#7c3aed','Half Day'],['#1d4ed8','Holiday']] .map(([c,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:c, display:'block' }}/>
            <span style={{ fontSize:11, color:'#78716c' }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:16 }}>
        {[
          { label:'Present', value:stats.present, color:'#16a34a' },
          { label:'Late', value:stats.late, color:'#ea580c' },
          { label:'Leave', value:stats.leave, color:'#ca8a04' },
          { label:'Absent', value:stats.absent, color:'#dc2626' },
          { label:'%', value:`${stats.percent}%`, color:G },
        ].map(s => (
          <div key={s.label} style={{ textAlign:'center', background:'#fff', borderRadius:8, padding:'10px 4px', border:'1px solid #e8e2da' }}>
            <p style={{ fontSize:15, fontWeight:700, color:s.color }}>{s.value}</p>
            <p style={{ fontSize:9, color:'#78716c' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selectedRecord && (
        <div style={{ background:'#fff', borderRadius:12, border:`1px solid ${STATUS_DOT[selectedRecord.status]}40`, padding:'16px', position:'relative' }}>
          <button onClick={() => setSelected(null)} style={{ position:'absolute', top:12, right:12, background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><X size={15}/></button>
          <p style={{ fontSize:13, fontWeight:700, color:'#1c1917', marginBottom:10 }}>
            {new Date(selectedRecord.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <Row label="Status">
              <span style={{ padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:600, background:STATUS_COLORS[selectedRecord.status].bg, color:STATUS_COLORS[selectedRecord.status].text }}>
                {STATUS_COLORS[selectedRecord.status].label}
              </span>
            </Row>
            {selectedRecord.check_in_time && <Row label="Check In">{new Date(selectedRecord.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</Row>}
            {selectedRecord.batch_id && <Row label="Batch">{batches.find(b => b.id === selectedRecord.batch_id)?.name}</Row>}
            {selectedRecord.note && <Row label="Note">{selectedRecord.note}</Row>}
            {selectedRecord.photo_url && (
              <div style={{ marginTop:8 }}>
                <p style={{ fontSize:11, color:'#78716c', marginBottom:6 }}>Photo</p>
                <img src={selectedRecord.photo_url} alt="Attendance" style={{ width:80, height:80, objectFit:'cover', borderRadius:8, border:'1px solid #e8e2da' }}/>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full list */}
      <div style={{ marginTop:16 }}>
        <p style={{ fontSize:11, fontWeight:600, color:'#78716c', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Full Record</p>
        {records.filter(r => r.date.startsWith(`${year}-${String(month).padStart(2,'0')}`)).sort((a,b) => b.date.localeCompare(a.date)).map(r => (
          <div key={r.id} onClick={() => setSelected(r.date)}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', background:'#fff', borderRadius:8, marginBottom:6, border:'1px solid #e8e2da', cursor:'pointer' }}>
            <div>
              <p style={{ fontSize:13, fontWeight:500, color:'#1c1917' }}>
                {new Date(r.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })}
              </p>
              <p style={{ fontSize:11, color:'#78716c' }}>
                {r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : '--'}
                {' · '}{batches.find(b => b.id === r.batch_id)?.name || 'General'}
              </p>
            </div>
            <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:STATUS_COLORS[r.status].bg, color:STATUS_COLORS[r.status].text }}>
              {STATUS_COLORS[r.status].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <span style={{ fontSize:11, color:'#9ca3af', width:60, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:13, color:'#1c1917' }}>{children}</span>
    </div>
  );
}

import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, STATUS_COLORS } from '../../../lib/portal-store';
import { Search, X } from 'lucide-react';

const G = '#1b4332';

export function TeamAttendance() {
  const { user } = usePortal();
  const [filter, setFilter] = useState<'today'|'week'|'month'>('today');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const myTeachers = portalDB.getTeachersUnderSenior(user.id);
  const batches = portalDB.getBatches();
  const now = new Date();

  const getDateRange = () => {
    const today = now.toISOString().split('T')[0];
    if (filter === 'today') return { from: today, to: today };
    if (filter === 'week') {
      const start = new Date(now); start.setDate(now.getDate() - 6);
      return { from: start.toISOString().split('T')[0], to: today };
    }
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: start.toISOString().split('T')[0], to: today };
  };

  const { from, to } = getDateRange();
  const allRecords = portalDB.getAttendance().filter(r => {
    const isTeacher = myTeachers.some(t => t.id === r.teacher_id);
    const inRange = r.date >= from && r.date <= to;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return isTeacher && inRange && matchesStatus;
  });

  const filteredRecords = allRecords.filter(r => {
    const teacher = myTeachers.find(t => t.id === r.teacher_id);
    return !search || teacher?.name.toLowerCase().includes(search.toLowerCase());
  }).sort((a,b) => b.date.localeCompare(a.date) || b.check_in_time.localeCompare(a.check_in_time));

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:640, margin:'0 auto' }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:16 }}>Team Attendance</h1>

      {/* Period filter */}
      <div style={{ display:'flex', background:'#f3f4f6', borderRadius:8, padding:3, marginBottom:14 }}>
        {[['today','Today'],['week','This Week'],['month','This Month']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v as any)}
            style={{ flex:1, padding:'8px 0', borderRadius:6, border:'none', cursor:'pointer', fontSize:12, fontWeight: filter===v ? 600 : 400,
              background: filter===v ? '#fff' : 'transparent', color: filter===v ? G : '#6b7280',
              fontFamily:'Inter,sans-serif', boxShadow: filter===v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <div style={{ flex:1, position:'relative' }}>
          <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teacher…"
            style={{ width:'100%', padding:'9px 9px 9px 30px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#fff', fontSize:13, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917' }}/>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding:'9px 12px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#fff', fontSize:13, fontFamily:'Inter,sans-serif', color:'#1c1917', cursor:'pointer' }}>
          <option value="all">All Status</option>
          {['present','late','absent','leave','half_day','holiday'].map(s => (
            <option key={s} value={s}>{s.replace('_',' ').replace(/^\w/,c=>c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p style={{ fontSize:12, color:'#78716c', marginBottom:12 }}>{filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}</p>

      {/* Records */}
      {filteredRecords.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px 0', color:'#9ca3af' }}>
          <p style={{ fontSize:14 }}>No attendance records found</p>
        </div>
      ) : filteredRecords.map(r => {
        const teacher = myTeachers.find(t => t.id === r.teacher_id);
        const sc = STATUS_COLORS[r.status];
        const batch = batches.find(b => b.id === r.batch_id);
        return (
          <div key={r.id} style={{ background:'#fff', borderRadius:10, border:'1px solid #e8e2da', padding:'14px 16px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, flexShrink:0 }}>
                {teacher?.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#1c1917', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{teacher?.name}</p>
                <p style={{ fontSize:11, color:'#78716c' }}>
                  {new Date(r.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                  {r.check_in_time ? ' · ' + new Date(r.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : ''}
                  {batch ? ' · ' + batch.name : ''}
                </p>
                {r.note && <p style={{ fontSize:11, color:'#9ca3af', marginTop:1 }}>{r.note}</p>}
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              {r.photo_url && (
                <img src={r.photo_url} alt="" style={{ width:36, height:36, borderRadius:8, objectFit:'cover', border:'1px solid #e8e2da', cursor:'pointer' }}
                  onClick={() => setLightbox(r.photo_url!)}/>
              )}
              <span style={{ padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600, background:sc.bg, color:sc.text, whiteSpace:'nowrap' }}>
                {sc.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', width:36, height:36, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16}/></button>
          <img src={lightbox} alt="Attendance" style={{ maxWidth:'90vw', maxHeight:'85vh', objectFit:'contain', borderRadius:8 }} onClick={e => e.stopPropagation()}/>
        </div>
      )}
    </div>
  );
}

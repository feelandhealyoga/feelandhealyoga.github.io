import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, STATUS_COLORS, type AttendanceStatus } from '../../../lib/portal-store';
import { Plus, Search, X, Edit2, Loader2 } from 'lucide-react';

const G = '#1b4332';
const STATUSES: AttendanceStatus[] = ['present','late','absent','leave','half_day','holiday'];

export function AdminAllAttendance() {
  const { user } = usePortal();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [correcting, setCorrecting] = useState<string | null>(null);
  const [addingManual, setAddingManual] = useState(false);
  const [correctStatus, setCorrectStatus] = useState<AttendanceStatus>('present');
  const [correctNote, setCorrectNote] = useState('');
  const [toast, setToast] = useState('');
  const [refresh, setRefresh] = useState(0);

  const allUsers = portalDB.getUsers();
  const batches = portalDB.getBatches();
  const teachers = allUsers.filter(u => u.role !== 'admin' && u.status === 'active');

  const records = portalDB.getAttendance().filter(r => {
    const teacher = allUsers.find(u => u.id === r.teacher_id);
    const inRange = r.date >= dateFrom && r.date <= dateTo;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch = !search || teacher?.name.toLowerCase().includes(search.toLowerCase());
    return inRange && matchStatus && matchSearch;
  }).sort((a,b) => b.date.localeCompare(a.date));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleCorrect = (id: string) => {
    portalDB.correctAttendance(id, { status: correctStatus, note: correctNote }, user.id);
    setCorrecting(null); setCorrectNote('');
    showToast('Attendance corrected');
    setRefresh(r => r + 1);
  };

  // Manual attendance form
  const [manualForm, setManualForm] = useState({ teacher_id: '', date: new Date().toISOString().split('T')[0], status: 'present' as AttendanceStatus, batch_id: '', note: '' });
  const handleManual = () => {
    if (!manualForm.teacher_id) return;
    portalDB.markAttendance({ ...manualForm, check_in_time: new Date(manualForm.date).toISOString(), is_manual: true });
    setAddingManual(false);
    showToast('Manual attendance added');
    setRefresh(r => r + 1);
  };

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:720, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G }}>All Attendance</h1>
        <button onClick={() => setAddingManual(true)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', borderRadius:8, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
          <Plus size={13}/> Manual Entry
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
        <div style={{ position:'relative', flex:'1', minWidth:140 }}>
          <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teacher…"
            style={{ width:'100%', padding:'8px 8px 8px 28px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#fff', fontSize:12, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917' }}/>
        </div>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          style={{ padding:'8px', borderRadius:8, border:'1.5px solid #e8e2da', fontSize:12, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917' }}/>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          style={{ padding:'8px', borderRadius:8, border:'1.5px solid #e8e2da', fontSize:12, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917' }}/>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding:'8px 10px', borderRadius:8, border:'1.5px solid #e8e2da', fontSize:12, fontFamily:'Inter,sans-serif', color:'#1c1917' }}>
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_COLORS[s].label}</option>)}
        </select>
      </div>

      <p style={{ fontSize:12, color:'#78716c', marginBottom:10 }}>{records.length} record{records.length !== 1 ? 's' : ''}</p>

      {records.map(r => {
        const teacher = allUsers.find(u => u.id === r.teacher_id);
        const sc = STATUS_COLORS[r.status];
        const batch = batches.find(b => b.id === r.batch_id);
        const isCorr = correcting === r.id;
        return (
          <div key={r.id} style={{ background:'#fff', borderRadius:10, border:'1px solid #e8e2da', padding:'12px 14px', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {teacher?.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'#1c1917' }}>{teacher?.name}</p>
                  <p style={{ fontSize:11, color:'#78716c' }}>
                    {new Date(r.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    {r.check_in_time ? ' · ' + new Date(r.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : ''}
                    {batch ? ' · ' + batch.name : ''}
                    {r.is_manual ? ' · Manual' : ''}
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                {r.photo_url && <img src={r.photo_url} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:'cover', border:'1px solid #e8e2da', cursor:'pointer' }} onClick={() => setLightbox(r.photo_url!)}/>}
                <span style={{ padding:'3px 9px', borderRadius:99, fontSize:10, fontWeight:600, background:sc.bg, color:sc.text }}>{sc.label}</span>
                <button onClick={() => { setCorrecting(isCorr ? null : r.id); setCorrectStatus(r.status); setCorrectNote(r.note || ''); }}
                  style={{ padding:'5px', borderRadius:6, border:'1px solid #e8e2da', background:'#fff', cursor:'pointer', color:'#78716c', display:'flex' }}>
                  <Edit2 size={12}/>
                </button>
              </div>
            </div>
            {isCorr && (
              <div style={{ marginTop:10, padding:'10px', background:'#faf9f7', borderRadius:8, border:'1px solid #e8e2da' }}>
                <p style={{ fontSize:11, fontWeight:600, color:'#57534e', marginBottom:8 }}>Correct Attendance</p>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:8 }}>
                  {STATUSES.map(s => (
                    <button key={s} type="button" onClick={() => setCorrectStatus(s)}
                      style={{ padding:'5px 10px', borderRadius:6, border:`1.5px solid ${correctStatus===s ? STATUS_COLORS[s].text : '#e8e2da'}`, background: correctStatus===s ? STATUS_COLORS[s].bg : '#fff', fontSize:11, fontWeight:600, color: correctStatus===s ? STATUS_COLORS[s].text : '#78716c', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                      {STATUS_COLORS[s].label}
                    </button>
                  ))}
                </div>
                <input value={correctNote} onChange={e => setCorrectNote(e.target.value)} placeholder="Correction note…"
                  style={{ width:'100%', padding:'8px 10px', borderRadius:6, border:'1px solid #e8e2da', fontSize:12, fontFamily:'Inter,sans-serif', outline:'none', marginBottom:8 }}/>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => handleCorrect(r.id)}
                    style={{ padding:'7px 16px', borderRadius:6, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
                    Save
                  </button>
                  <button onClick={() => setCorrecting(null)}
                    style={{ padding:'7px 14px', borderRadius:6, border:'1px solid #e8e2da', cursor:'pointer', background:'#fff', color:'#57534e', fontSize:12, fontFamily:'Inter,sans-serif' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Manual entry modal */}
      {addingManual && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:'24px', width:'100%', maxWidth:380 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:G }}>Manual Attendance</h2>
              <button onClick={() => setAddingManual(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#78716c' }}><X size={16}/></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div><label style={labelStyle}>Teacher</label>
                <select value={manualForm.teacher_id} onChange={e => setManualForm(f => ({ ...f, teacher_id: e.target.value }))} style={inputStyle}>
                  <option value="">Select teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Date</label>
                <input type="date" value={manualForm.date} onChange={e => setManualForm(f => ({ ...f, date: e.target.value }))} style={inputStyle}/>
              </div>
              <div><label style={labelStyle}>Status</label>
                <select value={manualForm.status} onChange={e => setManualForm(f => ({ ...f, status: e.target.value as AttendanceStatus }))} style={inputStyle}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_COLORS[s].label}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Batch</label>
                <select value={manualForm.batch_id} onChange={e => setManualForm(f => ({ ...f, batch_id: e.target.value }))} style={inputStyle}>
                  <option value="">None</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Note</label>
                <input value={manualForm.note} onChange={e => setManualForm(f => ({ ...f, note: e.target.value }))} placeholder="Reason for manual entry…" style={inputStyle}/>
              </div>
              <button onClick={handleManual} style={{ width:'100%', padding:'12px', borderRadius:8, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:14, fontWeight:700, fontFamily:'Inter,sans-serif' }}>
                Add Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src={lightbox} alt="Attendance" style={{ maxWidth:'90vw', maxHeight:'85vh', objectFit:'contain', borderRadius:8 }}/>
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

const labelStyle: React.CSSProperties = { display:'block', fontSize:12, fontWeight:600, color:'#57534e', marginBottom:5 };
const inputStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#faf9f7', fontSize:13, color:'#1c1917', fontFamily:'Inter,sans-serif', outline:'none' };

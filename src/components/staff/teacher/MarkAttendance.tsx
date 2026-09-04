import { useState, useEffect } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, MOCK_USERS } from '../../../lib/portal-store';
import { PhotoCapture } from '../shared/PhotoCapture';
import { CheckCircle, Clock, MapPin, Loader2, ChevronLeft } from 'lucide-react';

const G = '#1b4332';

export function MarkAttendance() {
  const { user, navigate, refreshNotifs } = usePortal();
  const [photo, setPhoto] = useState('');
  const [batchId, setBatchId] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [time, setTime] = useState(new Date());

  const settings = portalDB.getSettings();
  const batches = portalDB.getBatches();
  const todayRecord = portalDB.getTodayAttendanceForTeacher(user.id);
  const today = new Date();

  // Update clock every second
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Try to get GPS silently
  useEffect(() => {
    if (settings.require_location) {
      navigator.geolocation?.getCurrentPosition(pos => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, () => {}, { timeout: 5000 });
    }
  }, [settings.require_location]);

  // Determine if attendance would be Late
  const timeStr = `${String(time.getHours()).padStart(2,'0')}:${String(time.getMinutes()).padStart(2,'0')}`;
  const isLate = timeStr > settings.attendance_cutoff_time;
  const status = isLate ? 'late' : 'present';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.require_photo && !photo) { setError('A photo is required to mark attendance.'); return; }
    if (!batchId) { setError('Please select a batch.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const record = portalDB.markAttendance({
      teacher_id: user.id,
      date: today.toISOString().split('T')[0],
      check_in_time: time.toISOString(),
      status, batch_id: batchId, photo_url: photo, note,
      latitude: gps?.lat, longitude: gps?.lng,
      is_manual: false,
    });

    // Notify senior teacher
    if (settings.senior_notification && user.senior_id) {
      portalDB.addNotification({
        user_id: user.senior_id,
        type: 'attendance_marked',
        title: `${user.name} marked attendance`,
        message: `${status === 'late' ? '⏰ Late — ' : '✓ '}${time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })} · ${batches.find(b => b.id === batchId)?.name}`,
        reference_id: record.id,
      });
      refreshNotifs();
    }

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ padding:'40px 16px', maxWidth:420, margin:'0 auto', textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <CheckCircle size={36} color="#16a34a"/>
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:G, marginBottom:8 }}>
          Attendance Marked!
        </h2>
        <p style={{ color:'#78716c', fontSize:14, marginBottom:6 }}>
          {status === 'late' ? '⏰ Marked as Late' : '✓ Present'} · {time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
        </p>
        <p style={{ color:'#9ca3af', fontSize:13, marginBottom:28 }}>
          {today.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
        </p>
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
          <button onClick={() => navigate('teacher-dashboard')}
            style={{ padding:'12px 24px', borderRadius:10, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:14, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
            Go to Dashboard
          </button>
          <button onClick={() => navigate('teacher-history')}
            style={{ padding:'12px 24px', borderRadius:10, border:'1.5px solid #e8e2da', cursor:'pointer', background:'#fff', color:'#57534e', fontSize:14, fontWeight:500, fontFamily:'Inter,sans-serif' }}>
            View History
          </button>
        </div>
      </div>
    );
  }

  if (todayRecord && !loading) {
    return (
      <div style={{ padding:'24px 16px', maxWidth:420, margin:'0 auto' }}>
        <button onClick={() => navigate('teacher-dashboard')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#78716c', fontSize:13, marginBottom:20, padding:0 }}>
          <ChevronLeft size={15}/> Dashboard
        </button>
        <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:12, padding:'20px', textAlign:'center' }}>
          <CheckCircle size={28} color="#16a34a" style={{ marginBottom:10 }}/>
          <p style={{ fontSize:15, fontWeight:700, color:G, marginBottom:4 }}>Already Marked Today</p>
          <p style={{ color:'#78716c', fontSize:13, marginBottom:4 }}>
            {todayRecord.status.replace('_',' ').replace(/^\w/, c => c.toUpperCase())} at{' '}
            {new Date(todayRecord.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
          </p>
          <p style={{ color:'#9ca3af', fontSize:12 }}>Contact admin if correction needed</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:420, margin:'0 auto' }}>
      <button onClick={() => navigate('teacher-dashboard')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#78716c', fontSize:13, marginBottom:20, padding:0 }}>
        <ChevronLeft size={15}/> Dashboard
      </button>

      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:4 }}>Mark Attendance</h1>
      <p style={{ color:'#78716c', fontSize:13, marginBottom:20 }}>
        {today.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
      </p>

      {/* Live time + status */}
      <div style={{ background:isLate ? '#fff7ed' : '#f0fdf4', border:`1px solid ${isLate ? '#fed7aa' : '#86efac'}`, borderRadius:12, padding:'16px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:28, fontWeight:700, color:isLate ? '#ea580c' : G, fontVariantNumeric:'tabular-nums' }}>
            {time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}
          </p>
          <p style={{ fontSize:12, color:'#78716c', marginTop:2 }}>
            Cutoff: {settings.attendance_cutoff_time} — you will be marked{' '}
            <strong style={{ color: isLate ? '#ea580c' : '#16a34a' }}>{isLate ? 'Late' : 'Present'}</strong>
          </p>
        </div>
        <Clock size={28} color={isLate ? '#ea580c' : '#16a34a'}/>
      </div>

      {error && (
        <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#dc2626', fontSize:13 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
        {/* Photo */}
        <div>
          <label style={labelStyle}>Attendance Photo {settings.require_photo && <span style={{ color:'#dc2626' }}>*</span>}</label>
          <PhotoCapture onPhoto={setPhoto} preview={photo || undefined} allowGallery={settings.allow_gallery_upload} />
        </div>

        {/* Batch */}
        <div>
          <label style={labelStyle}>Batch <span style={{ color:'#dc2626' }}>*</span></label>
          <select value={batchId} onChange={e => setBatchId(e.target.value)} required style={selectStyle}>
            <option value="">Select your batch</option>
            {batches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.time}</option>)}
          </select>
        </div>

        {/* GPS */}
        {gps && (
          <div style={{ display:'flex', alignItems:'center', gap:6, color:'#78716c', fontSize:12 }}>
            <MapPin size={13} color="#16a34a"/>
            GPS captured: {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}
          </div>
        )}

        {/* Note */}
        <div>
          <label style={labelStyle}>Note (optional)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Any note for today's attendance…"
            style={{ ...selectStyle, resize:'none', lineHeight:1.5 }}/>
        </div>

        {/* Teacher info summary */}
        <div style={{ background:'#faf9f7', borderRadius:10, padding:'12px 14px', border:'1px solid #e8e2da', fontSize:12, color:'#57534e' }}>
          <p><strong>Teacher:</strong> {user.name}</p>
          <p><strong>Date:</strong> {today.toLocaleDateString('en-IN')}</p>
          <p><strong>Status:</strong> <span style={{ color: isLate ? '#ea580c' : '#16a34a', fontWeight:600 }}>{isLate ? 'Late' : 'Present'}</span></p>
        </div>

        <button type="submit" disabled={loading}
          style={{ width:'100%', padding:'14px 0', borderRadius:10, border:'none', cursor:loading?'not-allowed':'pointer',
            background:loading ? '#9ca3af' : G, color:'#fff', fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            boxShadow: loading ? 'none' : '0 4px 16px rgba(27,67,50,0.28)' }}>
          {loading ? <><Loader2 size={17} style={{ animation:'spin 0.8s linear infinite' }}/> Submitting…</> : '✓ Mark Attendance'}
        </button>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display:'block', fontSize:12, fontWeight:600, color:'#57534e', marginBottom:6 };
const selectStyle: React.CSSProperties = {
  width:'100%', padding:'11px 14px', borderRadius:8, border:'1.5px solid #e8e2da',
  background:'#faf9f7', fontSize:14, color:'#1c1917', fontFamily:'Inter,sans-serif', outline:'none',
};

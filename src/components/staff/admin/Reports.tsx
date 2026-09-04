import { useState } from 'react';
import { portalDB, STATUS_COLORS, LEAVE_TYPE_LABELS, type AttendanceStatus } from '../../../lib/portal-store';
import { Download, FileText, BarChart2, Users } from 'lucide-react';

const G = '#1b4332';

function csvDownload(filename: string, rows: string[][]) {
  const content = rows.map(r => r.map(c => `"${(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function AdminReports() {
  const [type, setType] = useState<'attendance'|'leave'|'performance'>('attendance');
  const [dateFrom, setDateFrom] = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]; });
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [teacherFilter, setTeacherFilter] = useState('');

  const allUsers = portalDB.getUsers();
  const teachers = allUsers.filter(u => u.role !== 'admin' && u.status === 'active');
  const batches = portalDB.getBatches();

  const getAttendanceData = () => {
    return portalDB.getAttendance().filter(r => {
      const inRange = r.date >= dateFrom && r.date <= dateTo;
      const matchT = !teacherFilter || r.teacher_id === teacherFilter;
      return inRange && matchT;
    }).sort((a,b) => b.date.localeCompare(a.date));
  };

  const getLeaveData = () => {
    return portalDB.getLeaves().filter(l => {
      const inRange = l.from_date >= dateFrom && l.to_date <= dateTo;
      const matchT = !teacherFilter || l.teacher_id === teacherFilter;
      return inRange && matchT;
    });
  };

  const getPerformanceData = () => {
    const month = dateFrom.slice(0,7);
    return portalDB.getReviews().filter(r => r.month >= dateFrom.slice(0,7));
  };

  const exportAttendance = () => {
    const data = getAttendanceData();
    const headers = ['Date','Teacher','Status','Check In Time','Batch','Note','Manual'];
    const rows = data.map(r => [
      r.date,
      allUsers.find(u => u.id === r.teacher_id)?.name || '',
      STATUS_COLORS[r.status].label,
      r.check_in_time ? new Date(r.check_in_time).toLocaleString('en-IN') : '',
      batches.find(b => b.id === r.batch_id)?.name || '',
      r.note || '',
      r.is_manual ? 'Yes' : 'No',
    ]);
    csvDownload(`attendance_${dateFrom}_${dateTo}.csv`, [headers, ...rows]);
  };

  const exportLeaves = () => {
    const data = getLeaveData();
    const headers = ['Teacher','Leave Type','From','To','Days','Reason','Status','Reviewed By','Remark'];
    const rows = data.map(l => {
      const days = Math.ceil((new Date(l.to_date).getTime() - new Date(l.from_date).getTime()) / 86400000) + 1;
      return [
        allUsers.find(u => u.id === l.teacher_id)?.name || '',
        LEAVE_TYPE_LABELS[l.leave_type],
        l.from_date, l.to_date, String(days), l.reason, l.status,
        allUsers.find(u => u.id === l.reviewed_by)?.name || '',
        l.review_comment || '',
      ];
    });
    csvDownload(`leaves_${dateFrom}_${dateTo}.csv`, [headers, ...rows]);
  };

  const exportPerformance = () => {
    const data = getPerformanceData();
    const headers = ['Teacher','Month','Attendance','Performance','Professionalism','Punctuality','Student Feedback','Remarks'];
    const rows = data.map(r => [
      allUsers.find(u => u.id === r.teacher_id)?.name || '',
      r.month, String(r.attendance_rating), String(r.performance_rating),
      String(r.professionalism), String(r.punctuality), String(r.student_feedback), r.remarks,
    ]);
    csvDownload(`performance_${dateFrom.slice(0,7)}.csv`, [headers, ...rows]);
  };

  const handleExport = () => {
    if (type === 'attendance') exportAttendance();
    else if (type === 'leave') exportLeaves();
    else exportPerformance();
  };

  const attendanceData = getAttendanceData();
  const leaveData = getLeaveData();
  const perfData = getPerformanceData();

  // Attendance summary
  const summary = attendanceData.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:720, margin:'0 auto' }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:16 }}>Reports</h1>

      {/* Report type */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        {([['attendance','Attendance',<BarChart2 size={14}/>],['leave','Leave',<FileText size={14}/>],['performance','Performance',<Users size={14}/>]] as const).map(([v,l,icon]) => (
          <button key={v} onClick={() => setType(v)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, border:`1.5px solid ${type===v ? G : '#e8e2da'}`, background: type===v ? '#f0fdf4' : '#fff', cursor:'pointer', color: type===v ? G : '#57534e', fontSize:13, fontWeight: type===v ? 600 : 400, fontFamily:'Inter,sans-serif' }}>
            {icon} {l}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          style={{ padding:'8px 10px', borderRadius:8, border:'1.5px solid #e8e2da', fontSize:13, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917' }}/>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          style={{ padding:'8px 10px', borderRadius:8, border:'1.5px solid #e8e2da', fontSize:13, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917' }}/>
        <select value={teacherFilter} onChange={e => setTeacherFilter(e.target.value)}
          style={{ padding:'8px 10px', borderRadius:8, border:'1.5px solid #e8e2da', fontSize:13, fontFamily:'Inter,sans-serif', color:'#1c1917', flex:1 }}>
          <option value="">All Teachers</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button onClick={handleExport}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
          <Download size={14}/> Export CSV
        </button>
      </div>

      {/* Attendance Report */}
      {type === 'attendance' && (
        <>
          {/* Summary */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
            {(['present','late','absent','leave'] as AttendanceStatus[]).map(s => (
              <div key={s} style={{ background:STATUS_COLORS[s].bg, borderRadius:10, padding:'12px', textAlign:'center', border:`1px solid ${STATUS_COLORS[s].text}20` }}>
                <p style={{ fontSize:20, fontWeight:700, color:STATUS_COLORS[s].text }}>{summary[s] || 0}</p>
                <p style={{ fontSize:10, color:'#78716c' }}>{STATUS_COLORS[s].label}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize:12, color:'#78716c', marginBottom:10 }}>{attendanceData.length} records</p>
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'#faf9f7' }}>
                    {['Date','Teacher','Status','Time','Batch'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:600, color:'#57534e', borderBottom:'1px solid #e8e2da', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.slice(0, 50).map(r => {
                    const sc = STATUS_COLORS[r.status];
                    return (
                      <tr key={r.id} style={{ borderBottom:'1px solid #fafafa' }}>
                        <td style={{ padding:'10px 12px', color:'#1c1917' }}>{r.date}</td>
                        <td style={{ padding:'10px 12px', color:'#1c1917' }}>{allUsers.find(u => u.id === r.teacher_id)?.name}</td>
                        <td style={{ padding:'10px 12px' }}>
                          <span style={{ padding:'2px 8px', borderRadius:99, fontSize:10, fontWeight:600, background:sc.bg, color:sc.text }}>{sc.label}</span>
                        </td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>
                          {r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : '--'}
                        </td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{batches.find(b => b.id === r.batch_id)?.name || '--'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {type === 'leave' && (
        <>
          <p style={{ fontSize:12, color:'#78716c', marginBottom:10 }}>{leaveData.length} leave requests</p>
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'#faf9f7' }}>
                    {['Teacher','Type','From','To','Days','Status'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:600, color:'#57534e', borderBottom:'1px solid #e8e2da', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaveData.map(l => {
                    const days = Math.ceil((new Date(l.to_date).getTime() - new Date(l.from_date).getTime()) / 86400000) + 1;
                    const statusColors = { pending:'#ca8a04', approved:'#16a34a', rejected:'#dc2626', info_requested:'#2563eb' };
                    return (
                      <tr key={l.id} style={{ borderBottom:'1px solid #fafafa' }}>
                        <td style={{ padding:'10px 12px', color:'#1c1917' }}>{allUsers.find(u => u.id === l.teacher_id)?.name}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{LEAVE_TYPE_LABELS[l.leave_type]}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{l.from_date}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{l.to_date}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{days}</td>
                        <td style={{ padding:'10px 12px' }}>
                          <span style={{ color: statusColors[l.status], fontWeight:600 }}>
                            {l.status.replace('_',' ').replace(/^\w/,c=>c.toUpperCase())}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {type === 'performance' && (
        <>
          <p style={{ fontSize:12, color:'#78716c', marginBottom:10 }}>{perfData.length} reviews</p>
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ background:'#faf9f7' }}>
                    {['Teacher','Month','Attend.','Perf.','Prof.','Punct.','Rating'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:600, color:'#57534e', borderBottom:'1px solid #e8e2da', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {perfData.map(r => {
                    const overall = Math.round((r.attendance_rating + r.performance_rating + r.professionalism + r.punctuality) / 4);
                    return (
                      <tr key={r.id} style={{ borderBottom:'1px solid #fafafa' }}>
                        <td style={{ padding:'10px 12px', color:'#1c1917' }}>{allUsers.find(u => u.id === r.teacher_id)?.name}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{r.month}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{'⭐'.repeat(r.attendance_rating)}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{'⭐'.repeat(r.performance_rating)}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{'⭐'.repeat(r.professionalism)}</td>
                        <td style={{ padding:'10px 12px', color:'#78716c' }}>{'⭐'.repeat(r.punctuality)}</td>
                        <td style={{ padding:'10px 12px', fontWeight:700, color:G }}>
                          {overall >= 4 ? '🟢' : overall >= 3 ? '🟡' : '🔴'} {overall}/5
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

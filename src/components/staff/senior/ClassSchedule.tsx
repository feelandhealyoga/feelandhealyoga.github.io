import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, type ClassSession, type ClassType } from '../../../lib/portal-store';
import { Plus, X, Calendar, Clock, User, Users, Trash2, CheckCircle, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

const G = '#1b4332';

const STATUS_COLORS = {
  scheduled: { bg: '#eff6ff', text: '#2563eb', label: 'Scheduled' },
  completed:  { bg: '#dcfce7', text: '#16a34a', label: 'Completed' },
  cancelled:  { bg: '#fee2e2', text: '#dc2626', label: 'Cancelled' },
};

function ClassCard({ cls, onComplete, onDelete, onEdit, batches }: {
  cls: ClassSession;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (cls: ClassSession) => void;
  batches: ReturnType<typeof portalDB.getBatches>;
}) {
  const sc = STATUS_COLORS[cls.status];
  const batch = batches.find(b => b.id === cls.batch_id);
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e2da', padding: '14px 16px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: cls.type === 'personal' ? '#fef9c3' : '#f0fdf4', color: cls.type === 'personal' ? '#ca8a04' : G }}>
            {cls.type === 'personal' ? '👤 Personal' : '👥 Group'}
          </span>
          <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text }}>
            {sc.label}
          </span>
        </div>
        {cls.status === 'scheduled' && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onComplete(cls.id)}
              style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 600, fontFamily: 'Inter,sans-serif' }}>
              ✓ Done
            </button>
            <button onClick={() => onDelete(cls.id)}
              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #fecaca', cursor: 'pointer', background: '#fff', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <Clock size={12} color="#9ca3af" />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1c1917' }}>{cls.time_start} – {cls.time_end}</span>
      </div>

      {cls.type === 'group' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <Users size={12} color="#9ca3af" />
          <span style={{ fontSize: 12, color: '#57534e' }}>{batch?.name || cls.batch_name || 'Group Class'}</span>
        </div>
      )}

      {cls.type === 'personal' && cls.student_name && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <User size={12} color="#9ca3af" />
            <span style={{ fontSize: 12, color: '#57534e', fontWeight: 600 }}>{cls.student_name}</span>
          </div>
          {cls.student_phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={12} color="#9ca3af" />
              <span style={{ fontSize: 11, color: '#78716c' }}>{cls.student_phone}</span>
            </div>
          )}
        </div>
      )}

      {cls.location && (
        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>📍 {cls.location}</p>
      )}
      {cls.notes && (
        <p style={{ fontSize: 11, color: '#78716c', marginTop: 4, fontStyle: 'italic' }}>{cls.notes}</p>
      )}
      {cls.completion_note && (
        <p style={{ fontSize: 11, color: G, marginTop: 4, background: '#f0fdf4', borderRadius: 6, padding: '4px 8px' }}>✓ {cls.completion_note}</p>
      )}
    </div>
  );
}

function AssignModal({ onSave, onClose, editClass }: {
  onSave: (data: any) => void;
  onClose: () => void;
  editClass?: ClassSession;
}) {
  const batches = portalDB.getBatches();
  const [type, setType] = useState<ClassType>(editClass?.type || 'personal');
  const [form, setForm] = useState({
    date: editClass?.date || new Date().toISOString().split('T')[0],
    time_start: editClass?.time_start || '06:00',
    time_end: editClass?.time_end || '07:00',
    batch_id: editClass?.batch_id || '',
    batch_name: editClass?.batch_name || '',
    student_name: editClass?.student_name || '',
    student_phone: editClass?.student_phone || '',
    location: editClass?.location || '',
    notes: editClass?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'personal' && !form.student_name.trim()) return;
    if (type === 'group' && !form.batch_id && !form.batch_name.trim()) return;
    onSave({ type, ...form });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}>
      <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: '24px 20px 32px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: G }}>{editClass ? 'Edit Class' : 'Assign Class'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716c' }}><X size={18} /></button>
        </div>

        {/* Type selector */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 3, marginBottom: 16 }}>
          {(['personal', 'group'] as ClassType[]).map(t => (
            <button key={t} type="button" onClick={() => setType(t)}
              style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: type === t ? 600 : 400,
                background: type === t ? '#fff' : 'transparent', color: type === t ? G : '#6b7280',
                fontFamily: 'Inter,sans-serif', boxShadow: type === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {t === 'personal' ? '👤 Personal Session' : '👥 Group Class'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Date */}
          <div>
            <label style={lStyle}>Date <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={iStyle} />
          </div>

          {/* Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={lStyle}>Start Time <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="time" required value={form.time_start} onChange={e => setForm(f => ({ ...f, time_start: e.target.value }))} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>End Time <span style={{ color: '#dc2626' }}>*</span></label>
              <input type="time" required value={form.time_end} onChange={e => setForm(f => ({ ...f, time_end: e.target.value }))} style={iStyle} />
            </div>
          </div>

          {/* Group fields */}
          {type === 'group' && (
            <div>
              <label style={lStyle}>Batch / Class Name <span style={{ color: '#dc2626' }}>*</span></label>
              <select value={form.batch_id} onChange={e => {
                const batch = batches.find(b => b.id === e.target.value);
                setForm(f => ({ ...f, batch_id: e.target.value, batch_name: batch?.name || '' }));
              }} style={iStyle}>
                <option value="">Select batch or type below</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.time}</option>)}
              </select>
              {!form.batch_id && (
                <input value={form.batch_name} onChange={e => setForm(f => ({ ...f, batch_name: e.target.value }))}
                  placeholder="Or type custom class name…" style={{ ...iStyle, marginTop: 6 }} />
              )}
            </div>
          )}

          {/* Personal fields */}
          {type === 'personal' && (
            <>
              <div>
                <label style={lStyle}>Student Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input required value={form.student_name} onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))}
                  placeholder="e.g. Anjali Sharma" style={iStyle} />
              </div>
              <div>
                <label style={lStyle}>Student Phone</label>
                <input type="tel" value={form.student_phone} onChange={e => setForm(f => ({ ...f, student_phone: e.target.value }))}
                  placeholder="+91 9876543210" style={iStyle} />
              </div>
            </>
          )}

          {/* Common */}
          <div>
            <label style={lStyle}>Location</label>
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Studio A, Online, Home visit" style={iStyle} />
          </div>
          <div>
            <label style={lStyle}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
              placeholder="Any special instructions…" style={{ ...iStyle, resize: 'none', lineHeight: 1.5 }} />
          </div>

          <button type="submit"
            style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer', background: G, color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Inter,sans-serif', boxShadow: '0 4px 16px rgba(27,67,50,0.28)' }}>
            {editClass ? 'Save Changes' : 'Assign Class'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function ClassSchedule() {
  const { user, navigate, refreshNotifs } = usePortal();
  const allUsers = portalDB.getUsers();
  const myTeachers = portalDB.getTeachersUnderSenior(user.id);
  const batches = portalDB.getBatches();

  // Default to Prajakta (only teacher)
  const [selectedTeacher, setSelectedTeacher] = useState(myTeachers[0]?.id || '');
  const [view, setView] = useState<'week' | 'all'>('week');
  const [showModal, setShowModal] = useState(false);
  const [editClass, setEditClass] = useState<ClassSession | undefined>();
  const [toast, setToast] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [completeModal, setCompleteModal] = useState<{ id: string } | null>(null);
  const [completeNote, setCompleteNote] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  // Build week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7 + i);
    return d.toISOString().split('T')[0];
  });
  const weekLabel = `${new Date(weekDays[0]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${new Date(weekDays[6]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const allClasses = portalDB.getClassesByTeacher(selectedTeacher);
  const weekClasses = allClasses.filter(c => weekDays.includes(c.date))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time_start.localeCompare(b.time_start));
  const displayClasses = view === 'week' ? weekClasses : allClasses.sort((a, b) => b.date.localeCompare(a.date));

  const handleAssign = (data: any) => {
    if (editClass) {
      portalDB.updateClass(editClass.id, { ...data });
      showToast('Class updated');
    } else {
      const cls = portalDB.assignClass({ ...data, teacher_id: selectedTeacher, assigned_by: user.id });
      // Notify teacher
      portalDB.addNotification({
        user_id: selectedTeacher, type: 'class_assigned',
        title: `📅 New ${data.type === 'personal' ? 'Personal Session' : 'Group Class'} Assigned`,
        message: `${data.date} · ${data.time_start}–${data.time_end}${data.student_name ? ` · ${data.student_name}` : ''}`,
        reference_id: cls.id,
      });
      refreshNotifs();
      showToast('Class assigned');
    }
    setShowModal(false);
    setEditClass(undefined);
    setRefresh(r => r + 1);
  };

  const handleComplete = () => {
    if (!completeModal) return;
    portalDB.completeClass(completeModal.id, completeNote);
    setCompleteModal(null);
    setCompleteNote('');
    setRefresh(r => r + 1);
    showToast('Class marked as completed');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this class?')) return;
    portalDB.deleteClass(id);
    setRefresh(r => r + 1);
    showToast('Class removed');
  };

  const teacher = allUsers.find(u => u.id === selectedTeacher);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayClasses = allClasses.filter(c => c.date === todayStr);
  const personalCount = allClasses.filter(c => c.type === 'personal' && c.status === 'scheduled').length;
  const groupCount = allClasses.filter(c => c.type === 'group' && c.status === 'scheduled').length;

  return (
    <div style={{ padding: '20px 16px 40px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: G }}>Class Schedule</h1>
        <button onClick={() => { setEditClass(undefined); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: G, color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Inter,sans-serif', boxShadow: '0 4px 12px rgba(27,67,50,0.25)' }}>
          <Plus size={14} /> Assign Class
        </button>
      </div>

      {/* Teacher selector */}
      {myTeachers.length > 1 && (
        <div style={{ marginBottom: 14 }}>
          <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} style={{ width: '100%', ...iStyle }}>
            {myTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: "Today's Classes", value: todayClasses.length, color: G, bg: '#f0fdf4' },
          { label: 'Personal (upcoming)', value: personalCount, color: '#ca8a04', bg: '#fef9c3' },
          { label: 'Group (upcoming)', value: groupCount, color: '#2563eb', bg: '#eff6ff' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '12px 8px', background: s.bg, borderRadius: 10, border: `1px solid ${s.color}20` }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 9, color: '#78716c', marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* View toggle + week navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 3 }}>
          {[['week', 'Week'], ['all', 'All']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v as any)}
              style={{ padding: '7px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: view === v ? 600 : 400,
                background: view === v ? '#fff' : 'transparent', color: view === v ? G : '#6b7280',
                fontFamily: 'Inter,sans-serif', boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {l}
            </button>
          ))}
        </div>
        {view === 'week' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setWeekOffset(w => w - 1)}
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e8e2da', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12, color: '#57534e', whiteSpace: 'nowrap' }}>{weekLabel}</span>
            <button onClick={() => setWeekOffset(w => w + 1)}
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e8e2da', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Week view — grouped by day */}
      {view === 'week' ? (
        weekDays.map(date => {
          const dayClasses = weekClasses.filter(c => c.date === date);
          const isToday = date === todayStr;
          const dayLabel = new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
          return (
            <div key={date} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: isToday ? G : '#57534e' }}>
                  {isToday ? '📅 Today — ' : ''}{dayLabel}
                </p>
                {dayClasses.length === 0 && <span style={{ fontSize: 11, color: '#d1d5db' }}>No classes</span>}
              </div>
              {dayClasses.map(cls => (
                <ClassCard key={cls.id} cls={cls} batches={batches}
                  onComplete={id => setCompleteModal({ id })}
                  onDelete={handleDelete}
                  onEdit={cls => { setEditClass(cls); setShowModal(true); }} />
              ))}
            </div>
          );
        })
      ) : (
        <>
          {displayClasses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
              <Calendar size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No classes assigned yet</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Tap "Assign Class" to add one</p>
            </div>
          ) : displayClasses.map(cls => (
            <ClassCard key={cls.id} cls={cls} batches={batches}
              onComplete={id => setCompleteModal({ id })}
              onDelete={handleDelete}
              onEdit={cls => { setEditClass(cls); setShowModal(true); }} />
          ))}
        </>
      )}

      {/* Assign/Edit Modal */}
      {showModal && (
        <AssignModal
          editClass={editClass}
          onSave={handleAssign}
          onClose={() => { setShowModal(false); setEditClass(undefined); }} />
      )}

      {/* Complete modal */}
      {completeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 360 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 14 }}>Mark as Completed</h3>
            <textarea value={completeNote} onChange={e => setCompleteNote(e.target.value)} rows={3}
              placeholder="Add a completion note (optional)…"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e8e2da', fontSize: 13, fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'none', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleComplete}
                style={{ flex: 1, padding: 11, borderRadius: 8, border: 'none', cursor: 'pointer', background: G, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>
                ✓ Confirm
              </button>
              <button onClick={() => setCompleteModal(null)}
                style={{ padding: '11px 16px', borderRadius: 8, border: '1px solid #e8e2da', cursor: 'pointer', background: '#fff', color: '#57534e', fontSize: 13, fontFamily: 'Inter,sans-serif' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: '#1c1917', color: '#fff', padding: '10px 20px', borderRadius: 99, fontSize: 13, fontWeight: 500, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

const lStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#57534e', marginBottom: 5 };
const iStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e8e2da', background: '#faf9f7', fontSize: 13, color: '#1c1917', fontFamily: 'Inter,sans-serif', outline: 'none' };

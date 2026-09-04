import { useState } from 'react';
import { usePortal } from '../StaffPortal';
import { portalDB, MOCK_BATCHES, type User } from '../../../lib/portal-store';
import { Plus, Edit2, UserX, UserCheck, Search, X, Loader2 } from 'lucide-react';

const G = '#1b4332';
const ROLES = ['teacher', 'senior', 'admin'] as const;

function UserForm({ user, onSave, onClose }: { user?: User; onSave: (u: Partial<User>) => void; onClose: () => void }) {
  const allUsers = portalDB.getUsers();
  const seniors = allUsers.filter(u => u.role === 'senior');
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    role: user?.role || 'teacher' as any, senior_id: user?.senior_id || '',
    joining_date: user?.joining_date || new Date().toISOString().split('T')[0],
    batch_ids: user?.batch_ids || [] as string[],
    status: user?.status || 'active' as any,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onSave(form);
    setLoading(false);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:'24px 20px', width:'100%', maxWidth:440, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:G }}>{user ? 'Edit Teacher' : 'Add Teacher'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#78716c' }}><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {[['Name','name','text',true],['Email','email','email',true],['Phone','phone','tel',false]] .map(([l,k,t,r]) => (
            <div key={k as string}>
              <label style={labelStyle}>{l as string} {r && <span style={{ color:'#dc2626' }}>*</span>}</label>
              <input type={t as string} required={!!r} value={(form as any)[k as string]} onChange={e => setForm(f => ({ ...f, [k as string]: e.target.value }))} style={inputStyle}/>
            </div>
          ))}
          <div>
            <label style={labelStyle}>Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))} style={inputStyle}>
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
            </select>
          </div>
          {form.role === 'teacher' && (
            <div>
              <label style={labelStyle}>Senior Teacher</label>
              <select value={form.senior_id} onChange={e => setForm(f => ({ ...f, senior_id: e.target.value }))} style={inputStyle}>
                <option value="">None</option>
                {seniors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={labelStyle}>Joining Date</label>
            <input type="date" value={form.joining_date} onChange={e => setForm(f => ({ ...f, joining_date: e.target.value }))} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} style={inputStyle}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'13px', borderRadius:10, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:14, fontWeight:700, fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {loading ? <><Loader2 size={15} style={{ animation:'spin 0.8s linear infinite' }}/> Saving…</> : (user ? 'Save Changes' : 'Add Teacher')}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function AdminTeachers() {
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [adding, setAdding] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState('');

  const allUsers = portalDB.getUsers();
  const teachers = allUsers.filter(u => u.role !== 'admin');

  const filtered = teachers.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSave = (form: Partial<User>) => {
    if (editUser) {
      portalDB.updateUser(editUser.id, form);
      showToast('Teacher updated');
    } else {
      portalDB.addUser({ ...form, id: 'u-' + Date.now(), batch_ids: [], status: 'active' } as User);
      showToast('Teacher added');
    }
    setEditUser(null);
    setAdding(false);
    setRefresh(r => r + 1);
  };

  const toggleStatus = (u: User) => {
    portalDB.updateUser(u.id, { status: u.status === 'active' ? 'inactive' : 'active' });
    showToast(u.status === 'active' ? 'Teacher deactivated' : 'Teacher reactivated');
    setRefresh(r => r + 1);
  };

  const getRoleColor = (role: string) => ({ teacher:'#0369a1', senior:'#7c3aed', admin:'#dc2626' }[role] || G);
  const getRoleBg = (role: string) => ({ teacher:'#eff6ff', senior:'#ede9fe', admin:'#fee2e2' }[role] || '#f0fdf4');

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:720, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G }}>Teachers</h1>
        <button onClick={() => setAdding(true)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, border:'none', cursor:'pointer', background:G, color:'#fff', fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
          <Plus size={14}/> Add Teacher
        </button>
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:16 }}>
        <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }}/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          style={{ width:'100%', padding:'10px 10px 10px 34px', borderRadius:8, border:'1.5px solid #e8e2da', background:'#fff', fontSize:13, fontFamily:'Inter,sans-serif', outline:'none', color:'#1c1917', boxSizing:'border-box' }}/>
      </div>

      <p style={{ fontSize:12, color:'#78716c', marginBottom:12 }}>{filtered.length} teacher{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.map(t => {
        const senior = allUsers.find(u => u.id === t.senior_id);
        return (
          <div key={t.id} style={{ background:'#fff', borderRadius:10, border:'1px solid #e8e2da', padding:'14px 16px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, opacity: t.status === 'inactive' ? 0.6 : 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, minWidth:0 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700, flexShrink:0 }}>
                {t.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#1c1917', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.name}</p>
                  <span style={{ padding:'1px 7px', borderRadius:99, fontSize:10, fontWeight:600, background:getRoleBg(t.role), color:getRoleColor(t.role), flexShrink:0 }}>
                    {t.role.charAt(0).toUpperCase()+t.role.slice(1)}
                  </span>
                  {t.status === 'inactive' && <span style={{ padding:'1px 7px', borderRadius:99, fontSize:10, fontWeight:600, background:'#f3f4f6', color:'#6b7280', flexShrink:0 }}>Inactive</span>}
                </div>
                <p style={{ fontSize:11, color:'#78716c', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {t.email}{senior ? ` · Senior: ${senior.name}` : ''}
                </p>
              </div>
            </div>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              <button onClick={() => setEditUser(t)}
                style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #e8e2da', background:'#fff', cursor:'pointer', color:'#57534e', display:'flex', alignItems:'center' }}>
                <Edit2 size={13}/>
              </button>
              <button onClick={() => toggleStatus(t)}
                style={{ padding:'6px 10px', borderRadius:6, border:`1px solid ${t.status === 'active' ? '#fecaca' : '#bbf7d0'}`, background: t.status === 'active' ? '#fee2e2' : '#dcfce7', cursor:'pointer', color: t.status === 'active' ? '#dc2626' : '#16a34a', display:'flex', alignItems:'center' }}>
                {t.status === 'active' ? <UserX size={13}/> : <UserCheck size={13}/>}
              </button>
            </div>
          </div>
        );
      })}

      {(adding || editUser) && (
        <UserForm user={editUser || undefined} onSave={handleSave} onClose={() => { setAdding(false); setEditUser(null); }}/>
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
const inputStyle: React.CSSProperties = {
  width:'100%', padding:'10px 12px', borderRadius:8, border:'1.5px solid #e8e2da',
  background:'#faf9f7', fontSize:13, color:'#1c1917', fontFamily:'Inter,sans-serif', outline:'none',
};

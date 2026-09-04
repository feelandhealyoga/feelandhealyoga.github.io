import { useState } from 'react';
import { portalDB, type PortalSettings } from '../../../lib/portal-store';
import { Save, Clock, Camera, MapPin, Bell, FileCheck, Shield } from 'lucide-react';

const G = '#1b4332';

export function AdminSettings() {
  const [settings, setSettings] = useState<PortalSettings>(() => portalDB.getSettings());
  const [saved, setSaved] = useState(false);

  const update = (key: keyof PortalSettings, value: any) =>
    setSettings(s => ({ ...s, [key]: value }));

  const handleSave = () => {
    portalDB.saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding:'20px 16px 40px', maxWidth:520, margin:'0 auto' }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:G, marginBottom:24 }}>Settings</h1>

      {/* Attendance */}
      <Section title="Attendance Rules" icon={<Clock size={15} color={G}/>}>
        <Field label="Attendance Cut-Off Time" hint="Attendance before this time = Present, after = Late">
          <input type="time" value={settings.attendance_cutoff_time} onChange={e => update('attendance_cutoff_time', e.target.value)} style={inputStyle}/>
        </Field>
        <Field label="Late Rule (minutes after cut-off)" hint="How many minutes after cut-off to mark as late">
          <input type="number" min="0" max="120" value={settings.late_rule_minutes} onChange={e => update('late_rule_minutes', Number(e.target.value))} style={{ ...inputStyle, width:80 }}/>
        </Field>
        <Field label="Attendance Reminder Time" hint="Time to send reminder if not marked">
          <input type="time" value={settings.attendance_reminder_time} onChange={e => update('attendance_reminder_time', e.target.value)} style={inputStyle}/>
        </Field>
      </Section>

      {/* Photo */}
      <Section title="Photo Settings" icon={<Camera size={15} color={G}/>}>
        <Toggle label="Require Photo" hint="Teachers must upload a photo when marking attendance" value={settings.require_photo} onChange={v => update('require_photo', v)}/>
        <Toggle label="Allow Gallery Upload" hint="Teachers can upload from camera roll (not just live camera)" value={settings.allow_gallery_upload} onChange={v => update('allow_gallery_upload', v)}/>
      </Section>

      {/* Location */}
      <Section title="Location" icon={<MapPin size={15} color={G}/>}>
        <Toggle label="Require Location" hint="Capture GPS coordinates when marking attendance" value={settings.require_location} onChange={v => update('require_location', v)}/>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={<Bell size={15} color={G}/>}>
        <Toggle label="Senior Teacher Notification" hint="Notify senior teacher when attendance is marked" value={settings.senior_notification} onChange={v => update('senior_notification', v)}/>
      </Section>

      {/* Leave */}
      <Section title="Leave Policy" icon={<FileCheck size={15} color={G}/>}>
        <Toggle label="Leave Approval Required" hint="Leave requests must be approved (else auto-approved)" value={settings.leave_approval_required} onChange={v => update('leave_approval_required', v)}/>
      </Section>

      {/* Demo info */}
      <div style={{ background:'#fef9c3', border:'1px solid #fde047', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
          <Shield size={14} color="#ca8a04" style={{ flexShrink:0, marginTop:1 }}/>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:'#78350f', marginBottom:4 }}>Default Login Credentials</p>
            <p style={{ fontSize:11, color:'#92400e' }}>Admin: admin@feelandhealyoga.com / Admin@1234</p>
            <p style={{ fontSize:11, color:'#92400e' }}>Senior: priyanka@feelandhealyoga.com / Teacher@1234</p>
            <p style={{ fontSize:11, color:'#92400e' }}>Teacher: ananya@feelandhealyoga.com / Teacher@1234</p>
            <p style={{ fontSize:11, color:'#92400e', marginTop:4 }}>Change these after connecting Supabase for production use.</p>
          </div>
        </div>
      </div>

      <button onClick={handleSave}
        style={{ width:'100%', padding:'14px', borderRadius:10, border:'none', cursor:'pointer', background: saved ? '#16a34a' : G, color:'#fff', fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background 0.3s' }}>
        <Save size={16}/> {saved ? 'Saved! ✓' : 'Save Settings'}
      </button>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e8e2da', padding:'16px', marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, paddingBottom:10, borderBottom:'1px solid #f3f4f6' }}>
        {icon}
        <p style={{ fontSize:13, fontWeight:700, color:'#1c1917' }}>{title}</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10 }}>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:500, color:'#1c1917', marginBottom:2 }}>{label}</p>
          {hint && <p style={{ fontSize:11, color:'#9ca3af' }}>{hint}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Field label={label} hint={hint}>
      <button onClick={() => onChange(!value)} style={{ position:'relative', width:44, height:24, borderRadius:99, border:'none', cursor:'pointer', background: value ? G : '#d1d5db', transition:'background 0.2s', flexShrink:0, padding:0 }}>
        <span style={{ position:'absolute', top:2, left: value ? 22 : 2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.15)' }}/>
      </button>
    </Field>
  );
}

const inputStyle: React.CSSProperties = {
  padding:'7px 10px', borderRadius:8, border:'1.5px solid #e8e2da',
  background:'#faf9f7', fontSize:13, color:'#1c1917', fontFamily:'Inter,sans-serif', outline:'none',
};

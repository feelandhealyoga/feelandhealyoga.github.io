import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { usePortal } from '../StaffPortal';
import { portalDB, type Notification } from '../../../lib/portal-store';

const G = '#1b4332';

export function NotificationBell() {
  const { user, notifications, refreshNotifs } = usePortal();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setNotifs(portalDB.getNotifications(user.id));
    }
  }, [open, user.id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = (id: string) => {
    portalDB.markNotifRead(id, user.id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    refreshNotifs();
  };

  const markAllRead = () => {
    portalDB.markAllRead(user.id);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    refreshNotifs();
  };

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h/24)}d ago`;
  };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ position:'relative', background:'none', border:'none', cursor:'pointer', color:'#57534e', padding:6, display:'flex', borderRadius:8 }}>
        <Bell size={19}/>
        {notifications > 0 && (
          <span style={{ position:'absolute', top:2, right:2, width:16, height:16, borderRadius:'50%', background:'#ef4444', color:'#fff', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {notifications > 9 ? '9+' : notifications}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:320, background:'#fff', borderRadius:12, border:'1px solid #e8e2da', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:200, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Bell size={15} color={G}/>
              <span style={{ fontSize:14, fontWeight:700, color:'#1c1917' }}>Notifications</span>
              {notifications > 0 && <span style={{ background:'#fee2e2', color:'#dc2626', borderRadius:99, padding:'1px 7px', fontSize:10, fontWeight:700 }}>{notifications} new</span>}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {notifications > 0 && <button onClick={markAllRead} style={{ background:'none', border:'none', cursor:'pointer', fontSize:11, color:G, fontWeight:500 }}>Mark all read</button>}
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af' }}><X size={14}/></button>
            </div>
          </div>

          <div style={{ maxHeight:320, overflowY:'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding:'32px 16px', textAlign:'center', color:'#9ca3af' }}>
                <Bell size={28} style={{ marginBottom:8, opacity:0.4 }}/>
                <p style={{ fontSize:13 }}>No notifications yet</p>
              </div>
            ) : notifs.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)}
                style={{ padding:'12px 16px', borderBottom:'1px solid #f9f9f9', cursor:'pointer', background: n.read ? 'transparent' : '#fafff8', transition:'background 0.15s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight: n.read ? 400 : 600, color:'#1c1917', marginBottom:2 }}>{n.title}</p>
                    <p style={{ fontSize:12, color:'#78716c', lineHeight:1.4 }}>{n.message}</p>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                    <span style={{ fontSize:10, color:'#9ca3af' }}>{relativeTime(n.created_at)}</span>
                    {!n.read && <span style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', display:'block' }}/>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

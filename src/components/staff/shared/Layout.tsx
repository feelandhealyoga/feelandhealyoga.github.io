import { usePortal, type Route } from '../StaffPortal';
import { NotificationBell } from './NotificationBell';
import {
  LayoutDashboard, Clock, Calendar, FileText, Star, Award,
  Users, ClipboardList, BarChart2, Settings, LogOut, Menu, X,
  CheckSquare, TrendingUp, Bell
} from 'lucide-react';
import { useState } from 'react';

const G = '#1b4332';
const BG = '#faf9f7';
const BORDER = '#e8e2da';

interface NavItem { label: string; route: Route; icon: React.ReactNode; }

function getNavItems(role: string): NavItem[] {
  if (role === 'teacher') return [
    { label: 'Dashboard',   route: 'teacher-dashboard',   icon: <LayoutDashboard size={18}/> },
    { label: 'Attendance',  route: 'teacher-attendance',  icon: <Clock size={18}/> },
    { label: 'History',     route: 'teacher-history',     icon: <Calendar size={18}/> },
    { label: 'Leave',       route: 'teacher-leave',       icon: <FileText size={18}/> },
    { label: 'Performance', route: 'teacher-performance', icon: <Star size={18}/> },
  ];
  if (role === 'senior') return [
    { label: 'Dashboard',   route: 'senior-dashboard',    icon: <LayoutDashboard size={18}/> },
    { label: 'My Attend.',  route: 'teacher-attendance',  icon: <Clock size={18}/> },
    { label: 'Team',        route: 'senior-team',         icon: <Users size={18}/> },
    { label: 'Leaves',      route: 'senior-leaves',       icon: <FileText size={18}/> },
    { label: 'Performance', route: 'teacher-performance', icon: <Star size={18}/> },
  ];
  // admin
  return [
    { label: 'Dashboard',   route: 'admin-dashboard',     icon: <LayoutDashboard size={18}/> },
    { label: 'Attendance',  route: 'admin-attendance',    icon: <CheckSquare size={18}/> },
    { label: 'Teachers',    route: 'admin-teachers',      icon: <Users size={18}/> },
    { label: 'Leaves',      route: 'admin-leaves',        icon: <FileText size={18}/> },
    { label: 'Performance', route: 'admin-performance',   icon: <TrendingUp size={18}/> },
    { label: 'Reports',     route: 'admin-reports',       icon: <BarChart2 size={18}/> },
    { label: 'Settings',    route: 'admin-settings',      icon: <Settings size={18}/> },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, route, navigate, logout, notifications } = usePortal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getNavItems(user.role);
  const pageTitle = navItems.find(n => n.route === route)?.label || 'Portal';

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const roleLabel = { teacher: 'Teacher', senior: 'Senior Teacher', admin: 'Admin' }[user.role];

  return (
    <div style={{ display:'flex', height:'100dvh', background:BG, overflow:'hidden' }}>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{
        display:'none', flexDirection:'column', width:220, background:'#fff',
        borderRight:`1px solid ${BORDER}`, padding:'20px 0', flexShrink:0,
        overflowY:'auto',
      }} className="portal-sidebar">
        {/* Logo */}
        <div style={{ padding:'0 20px 20px', borderBottom:`1px solid ${BORDER}`, marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:16 }}>🌿</span>
            </div>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:G, lineHeight:1.2 }}>Feel & Heal Yoga</p>
              <p style={{ fontSize:10, color:'#78716c' }}>Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:'8px 12px' }}>
          {navItems.map(item => {
            const active = route === item.route;
            return (
              <button key={item.route} onClick={() => navigate(item.route)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                  borderRadius:8, border:'none', cursor:'pointer', textAlign:'left', marginBottom:2,
                  background: active ? '#f0fdf4' : 'transparent',
                  color: active ? G : '#57534e', fontWeight: active ? 600 : 400, fontSize:13,
                  fontFamily:'Inter,sans-serif',
                }}>
                <span style={{ color: active ? G : '#9ca3af' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding:'12px', borderTop:`1px solid ${BORDER}`, marginTop:'auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, padding:'8px 12px', background:BG, borderRadius:8 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700, flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:12, fontWeight:600, color:'#1c1917', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</p>
              <p style={{ fontSize:10, color:'#78716c' }}>{roleLabel}</p>
            </div>
          </div>
          <button onClick={logout}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, border:'none', cursor:'pointer', background:'transparent', color:'#ef4444', fontSize:13, fontFamily:'Inter,sans-serif' }}>
            <LogOut size={15}/> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Header */}
        <header style={{ background:'#fff', borderBottom:`1px solid ${BORDER}`, padding:'0 16px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(true)}
              style={{ display:'flex', alignItems:'center', background:'none', border:'none', cursor:'pointer', color:'#57534e', padding:4 }}
              className="portal-mobile-menu-btn">
              <Menu size={20}/>
            </button>
            <h1 style={{ fontSize:15, fontWeight:700, color:'#1c1917' }}>{pageTitle}</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <NotificationBell />
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:'auto', padding:'0' }}>
          {children}
        </main>

        {/* ── BOTTOM NAV (mobile) ── */}
        <nav style={{ background:'#fff', borderTop:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-around', padding:'8px 0 max(8px,env(safe-area-inset-bottom))', flexShrink:0 }} className="portal-bottom-nav">
          {navItems.slice(0, 5).map(item => {
            const active = route === item.route;
            return (
              <button key={item.route} onClick={() => navigate(item.route)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'4px 12px', background:'none', border:'none', cursor:'pointer',
                  color: active ? G : '#9ca3af', fontFamily:'Inter,sans-serif' }}>
                {item.icon}
                <span style={{ fontSize:9, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:300 }} />
          <div style={{ position:'fixed', top:0, left:0, bottom:0, width:260, background:'#fff', zIndex:301, display:'flex', flexDirection:'column', padding:'20px 0', boxShadow:'4px 0 24px rgba(0,0,0,0.12)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 20px', borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:15 }}>🌿</span>
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:G }}>Feel & Heal Yoga</p>
                  <p style={{ fontSize:10, color:'#78716c' }}>Staff Portal</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#78716c' }}><X size={18}/></button>
            </div>
            <nav style={{ flex:1, padding:'12px', overflowY:'auto' }}>
              {navItems.map(item => {
                const active = route === item.route;
                return (
                  <button key={item.route} onClick={() => { navigate(item.route); setMobileOpen(false); }}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:8, border:'none', cursor:'pointer', textAlign:'left', marginBottom:2,
                      background: active ? '#f0fdf4' : 'transparent', color: active ? G : '#57534e', fontWeight: active ? 600 : 400, fontSize:14, fontFamily:'Inter,sans-serif' }}>
                    <span style={{ color: active ? G : '#9ca3af' }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div style={{ padding:'12px 16px', borderTop:`1px solid ${BORDER}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${G},#2d6a4f)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700 }}>{initials}</div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#1c1917' }}>{user.name}</p>
                  <p style={{ fontSize:11, color:'#78716c' }}>{roleLabel}</p>
                </div>
              </div>
              <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:8, border:'none', cursor:'pointer', background:'#fef2f2', color:'#dc2626', fontSize:13, fontFamily:'Inter,sans-serif', fontWeight:500 }}>
                <LogOut size={15}/> Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          .portal-sidebar { display: flex !important; }
          .portal-mobile-menu-btn { display: none !important; }
          .portal-bottom-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}

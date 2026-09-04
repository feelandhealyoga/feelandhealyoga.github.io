import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { portalDB, type User, type Role } from '../../lib/portal-store';
import { AuthGate } from './AuthGate';
import { Layout } from './shared/Layout';
import { TeacherDashboard } from './teacher/Dashboard';
import { MarkAttendance } from './teacher/MarkAttendance';
import { AttendanceHistory } from './teacher/AttendanceHistory';
import { ApplyLeave } from './teacher/ApplyLeave';
import { TeacherPerformance } from './teacher/Performance';
import { SeniorDashboard } from './senior/Dashboard';
import { TeamAttendance } from './senior/TeamAttendance';
import { SeniorLeaveRequests } from './senior/LeaveRequests';
import { AdminDashboard } from './admin/Dashboard';
import { AdminTeachers } from './admin/Teachers';
import { AdminAllAttendance } from './admin/AllAttendance';
import { AdminLeaveRequests } from './admin/LeaveRequests';
import { AdminPerformance } from './admin/Performance';
import { AdminReports } from './admin/Reports';
import { AdminSettings } from './admin/Settings';

export type Route =
  | 'teacher-dashboard' | 'teacher-attendance' | 'teacher-history' | 'teacher-leave' | 'teacher-performance'
  | 'senior-dashboard' | 'senior-team' | 'senior-leaves'
  | 'admin-dashboard' | 'admin-teachers' | 'admin-attendance' | 'admin-leaves' | 'admin-performance' | 'admin-reports' | 'admin-settings';

interface PortalCtx {
  user: User;
  route: Route;
  navigate: (r: Route) => void;
  logout: () => void;
  notifications: number;
  refreshNotifs: () => void;
}

export const PortalContext = createContext<PortalCtx>(null as any);
export const usePortal = () => useContext(PortalContext);

const defaultRoute = (role: Role): Route => {
  if (role === 'admin') return 'admin-dashboard';
  if (role === 'senior') return 'senior-dashboard';
  return 'teacher-dashboard';
};

export default function StaffPortal() {
  const [user, setUser] = useState<User | null>(() => portalDB.getSession());
  const [route, setRoute] = useState<Route>(() => {
    const sess = portalDB.getSession();
    return sess ? defaultRoute(sess.role) : 'teacher-dashboard';
  });
  const [unread, setUnread] = useState(0);

  const refreshNotifs = useCallback(() => {
    if (user) setUnread(portalDB.getUnreadCount(user.id));
  }, [user]);

  useEffect(() => { refreshNotifs(); }, [user, route, refreshNotifs]);

  const navigate = (r: Route) => { setRoute(r); window.scrollTo(0,0); };

  const login = (u: User) => {
    setUser(u);
    setRoute(defaultRoute(u.role));
  };

  const logout = () => {
    portalDB.logout();
    setUser(null);
  };

  if (!user) return <AuthGate onLogin={login} />;

  const ctx: PortalCtx = { user, route, navigate, logout, notifications: unread, refreshNotifs };

  return (
    <PortalContext.Provider value={ctx}>
      <Layout>
        <RouteRenderer route={route} role={user.role} />
      </Layout>
    </PortalContext.Provider>
  );
}

function RouteRenderer({ route, role }: { route: Route; role: Role }) {
  // Teacher routes
  if (role === 'teacher' || role === 'senior') {
    if (route === 'teacher-dashboard') return <TeacherDashboard />;
    if (route === 'teacher-attendance') return <MarkAttendance />;
    if (route === 'teacher-history') return <AttendanceHistory />;
    if (route === 'teacher-leave') return <ApplyLeave />;
    if (route === 'teacher-performance') return <TeacherPerformance />;
  }
  // Senior routes
  if (role === 'senior') {
    if (route === 'senior-dashboard') return <SeniorDashboard />;
    if (route === 'senior-team') return <TeamAttendance />;
    if (route === 'senior-leaves') return <SeniorLeaveRequests />;
  }
  // Admin routes
  if (role === 'admin') {
    if (route === 'admin-dashboard') return <AdminDashboard />;
    if (route === 'admin-teachers') return <AdminTeachers />;
    if (route === 'admin-attendance') return <AdminAllAttendance />;
    if (route === 'admin-leaves') return <AdminLeaveRequests />;
    if (route === 'admin-performance') return <AdminPerformance />;
    if (route === 'admin-reports') return <AdminReports />;
    if (route === 'admin-settings') return <AdminSettings />;
  }
  // Fallback to dashboard
  return <div className="p-8 text-center text-gray-400">Page not found</div>;
}

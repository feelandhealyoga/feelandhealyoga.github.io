// ═══════════════════════════════════════════════════════════
// PORTAL DATA STORE
// Works with localStorage mock data. Wire to Supabase when keys are added.
// ═══════════════════════════════════════════════════════════

export type Role = 'teacher' | 'senior' | 'admin';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'half_day' | 'holiday' | 'not_marked';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'info_requested';
export type LeaveType = 'full_day' | 'half_day' | 'emergency' | 'sick' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  senior_id?: string;
  avatar?: string;
  joining_date: string;
  batch_ids: string[];
  status: 'active' | 'inactive';
}

export interface Batch {
  id: string;
  name: string;
  time: string;
  days: string;
  type: 'morning' | 'afternoon' | 'evening';
}

export interface AttendanceRecord {
  id: string;
  teacher_id: string;
  date: string;
  check_in_time: string;
  status: AttendanceStatus;
  batch_id?: string;
  photo_url?: string;
  note?: string;
  latitude?: number;
  longitude?: number;
  is_manual: boolean;
  corrected_by?: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  teacher_id: string;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  reason: string;
  attachment_url?: string;
  status: LeaveStatus;
  reviewed_by?: string;
  review_comment?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  reference_id?: string;
  read: boolean;
  created_at: string;
}

export interface PerformanceReview {
  id: string;
  teacher_id: string;
  reviewer_id: string;
  month: string;
  attendance_rating: number;
  performance_rating: number;
  professionalism: number;
  punctuality: number;
  student_feedback: number;
  remarks: string;
  goals_next_month: string;
  created_at: string;
}

export interface PortalSettings {
  attendance_cutoff_time: string;
  late_rule_minutes: number;
  require_photo: boolean;
  require_location: boolean;
  allow_gallery_upload: boolean;
  attendance_reminder_time: string;
  senior_notification: boolean;
  leave_approval_required: boolean;
}

// ─── MOCK DATA ───────────────────────────────────────────
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@feelandhealyoga.com': 'Admin@1234',
  'priyanka@feelandhealyoga.com': 'Teacher@1234',
  'prajakta@feelandhealyoga.com': 'Teacher@1234',
};

export const MOCK_USERS: User[] = [
  {
    id: 'u-admin-1',
    name: 'Admin',
    email: 'admin@feelandhealyoga.com',
    phone: '+919920155875',
    role: 'admin',
    joining_date: '2022-01-01',
    batch_ids: [],
    status: 'active',
  },
  {
    id: 'u-teacher-1',
    name: 'Priyanka',
    email: 'priyanka@feelandhealyoga.com',
    phone: '+919876543210',
    role: 'teacher',
    joining_date: '2022-03-01',
    batch_ids: ['b1', 'b2'],
    status: 'active',
  },
  {
    id: 'u-teacher-2',
    name: 'Prajakta',
    email: 'prajakta@feelandhealyoga.com',
    phone: '+919765432109',
    role: 'teacher',
    joining_date: '2023-06-01',
    batch_ids: ['b3', 'b4'],
    status: 'active',
  },
];

export const MOCK_BATCHES: Batch[] = [
  { id: 'b1', name: 'Morning Batch', time: '6:00–7:00 AM', days: 'Mon, Tue, Thu, Fri', type: 'morning' },
  { id: 'b2', name: 'Morning Batch 2', time: '8:00–9:00 AM', days: 'Mon, Tue, Thu, Fri', type: 'morning' },
  { id: 'b3', name: 'Weight Loss', time: '11:00 AM–12:00 PM', days: 'Mon, Tue, Thu, Fri', type: 'afternoon' },
  { id: 'b4', name: 'Evening Weight Loss', time: '5:30–6:30 PM', days: 'Daily', type: 'evening' },
  { id: 'b5', name: 'Evening Yoga', time: '7:30–8:30 PM', days: 'Daily', type: 'evening' },
  { id: 'b6', name: 'Kids Yoga', time: '6:00–7:00 AM', days: 'Mon, Thu, Fri', type: 'morning' },
];

function today() { return new Date().toISOString().split('T')[0]; }
function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().split('T')[0]; }
function uid() { return Math.random().toString(36).slice(2,11); }

// Generate sample attendance for last 30 days
function generateSampleAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const teachers = ['u-teacher-1', 'u-teacher-2'];
  const statuses: AttendanceStatus[] = ['present','present','present','present','late','present','present'];
  for (let i = 0; i < 25; i++) {
    const date = daysAgo(i);
    for (const tid of teachers) {
      const status = i === 3 ? 'leave' : i === 7 ? 'absent' : statuses[Math.floor(Math.random()*statuses.length)];
      if (i > 0) {
        records.push({
          id: uid(), teacher_id: tid, date, status,
          check_in_time: new Date(date + 'T0' + (5 + Math.floor(Math.random()*3)) + ':' + String(Math.floor(Math.random()*60)).padStart(2,'0') + ':00').toISOString(),
          batch_id: tid === 'u-teacher-1' ? 'b1' : 'b2',
          is_manual: false, created_at: date + 'T06:00:00Z',
        });
      }
    }
  }
  return records;
}

// ─── STORAGE CLASS ───────────────────────────────────────
const LS_KEYS = {
  users: 'fh_portal_users_v2',
  attendance: 'fh_portal_attendance_v2',
  leaves: 'fh_portal_leaves_v2',
  notifications: 'fh_portal_notifications_v2',
  reviews: 'fh_portal_reviews_v2',
  settings: 'fh_portal_settings_v2',
  session: 'fh_portal_session_v2',
};

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── PORTAL DB ────────────────────────────────────────────
export const portalDB = {
  // AUTH
  login(email: string, password: string): User | null {
    const pass = MOCK_PASSWORDS[email.toLowerCase()];
    if (!pass || pass !== password) return null;
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.status !== 'active') return null;
    save(LS_KEYS.session, user);
    return user;
  },
  logout() { localStorage.removeItem(LS_KEYS.session); },
  getSession(): User | null { return load<User | null>(LS_KEYS.session, null); },

  // USERS
  getUsers(): User[] { return load<User[]>(LS_KEYS.users, MOCK_USERS); },
  saveUsers(users: User[]) { save(LS_KEYS.users, users); },
  getUserById(id: string) { return this.getUsers().find(u => u.id === id); },
  getTeachersUnderSenior(seniorId: string) { return this.getUsers().filter(u => u.senior_id === seniorId && u.role === 'teacher'); },
  addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    // Add password
    MOCK_PASSWORDS[user.email] = 'Teacher@1234';
  },
  updateUser(id: string, data: Partial<User>) {
    const users = this.getUsers().map(u => u.id === id ? { ...u, ...data } : u);
    this.saveUsers(users);
  },

  // ATTENDANCE
  getAttendance(): AttendanceRecord[] {
    return load<AttendanceRecord[]>(LS_KEYS.attendance, generateSampleAttendance());
  },
  saveAttendance(records: AttendanceRecord[]) { save(LS_KEYS.attendance, records); },
  getAttendanceByTeacher(teacherId: string): AttendanceRecord[] {
    return this.getAttendance().filter(r => r.teacher_id === teacherId);
  },
  getAttendanceByDate(date: string): AttendanceRecord[] {
    return this.getAttendance().filter(r => r.date === date);
  },
  getTodayAttendanceForTeacher(teacherId: string): AttendanceRecord | null {
    return this.getAttendance().find(r => r.teacher_id === teacherId && r.date === today()) || null;
  },
  markAttendance(record: Omit<AttendanceRecord, 'id' | 'created_at'>): AttendanceRecord {
    const all = this.getAttendance();
    const existing = all.findIndex(r => r.teacher_id === record.teacher_id && r.date === record.date);
    const newRecord = { ...record, id: uid(), created_at: new Date().toISOString() };
    if (existing >= 0) { all[existing] = newRecord; } else { all.push(newRecord); }
    this.saveAttendance(all);
    return newRecord;
  },
  correctAttendance(id: string, data: Partial<AttendanceRecord>, correctedBy: string) {
    const all = this.getAttendance().map(r => r.id === id ? { ...r, ...data, corrected_by: correctedBy, is_manual: true } : r);
    this.saveAttendance(all);
  },

  // LEAVE REQUESTS
  getLeaves(): LeaveRequest[] { return load<LeaveRequest[]>(LS_KEYS.leaves, []); },
  saveLeaves(leaves: LeaveRequest[]) { save(LS_KEYS.leaves, leaves); },
  getLeavesByTeacher(teacherId: string): LeaveRequest[] {
    return this.getLeaves().filter(l => l.teacher_id === teacherId);
  },
  getPendingLeaves(): LeaveRequest[] { return this.getLeaves().filter(l => l.status === 'pending'); },
  submitLeave(leave: Omit<LeaveRequest, 'id' | 'created_at' | 'status'>): LeaveRequest {
    const all = this.getLeaves();
    const newLeave: LeaveRequest = { ...leave, id: uid(), status: 'pending', created_at: new Date().toISOString() };
    all.push(newLeave);
    this.saveLeaves(all);
    return newLeave;
  },
  reviewLeave(id: string, status: 'approved' | 'rejected', reviewedBy: string, comment?: string) {
    const all = this.getLeaves().map(l => l.id === id
      ? { ...l, status, reviewed_by: reviewedBy, review_comment: comment || '', reviewed_at: new Date().toISOString() }
      : l
    );
    this.saveLeaves(all);
  },

  // NOTIFICATIONS
  getNotifications(userId: string): Notification[] {
    return load<Notification[]>(LS_KEYS.notifications, []).filter(n => n.user_id === userId)
      .sort((a,b) => b.created_at.localeCompare(a.created_at));
  },
  addNotification(notif: Omit<Notification, 'id' | 'created_at' | 'read'>) {
    const all = load<Notification[]>(LS_KEYS.notifications, []);
    all.push({ ...notif, id: uid(), read: false, created_at: new Date().toISOString() });
    save(LS_KEYS.notifications, all);
  },
  markNotifRead(id: string, userId: string) {
    const all = load<Notification[]>(LS_KEYS.notifications, []).map(n =>
      n.id === id && n.user_id === userId ? { ...n, read: true } : n
    );
    save(LS_KEYS.notifications, all);
  },
  markAllRead(userId: string) {
    const all = load<Notification[]>(LS_KEYS.notifications, []).map(n =>
      n.user_id === userId ? { ...n, read: true } : n
    );
    save(LS_KEYS.notifications, all);
  },
  getUnreadCount(userId: string) {
    return load<Notification[]>(LS_KEYS.notifications, []).filter(n => n.user_id === userId && !n.read).length;
  },

  // PERFORMANCE REVIEWS
  getReviews(): PerformanceReview[] { return load<PerformanceReview[]>(LS_KEYS.reviews, []); },
  getReviewsByTeacher(teacherId: string) { return this.getReviews().filter(r => r.teacher_id === teacherId); },
  saveReview(review: Omit<PerformanceReview, 'id' | 'created_at'>): PerformanceReview {
    const all = this.getReviews();
    const existing = all.findIndex(r => r.teacher_id === review.teacher_id && r.month === review.month);
    const newR = { ...review, id: uid(), created_at: new Date().toISOString() };
    if (existing >= 0) { all[existing] = newR; } else { all.push(newR); }
    save(LS_KEYS.reviews, all);
    return newR;
  },

  // SETTINGS
  getSettings(): PortalSettings {
    return load<PortalSettings>(LS_KEYS.settings, {
      attendance_cutoff_time: '07:10',
      late_rule_minutes: 10,
      require_photo: true,
      require_location: false,
      allow_gallery_upload: true,
      attendance_reminder_time: '07:00',
      senior_notification: true,
      leave_approval_required: true,
    });
  },
  saveSettings(s: PortalSettings) { save(LS_KEYS.settings, s); },

  // HELPERS
  getBatches(): Batch[] { return MOCK_BATCHES; },
  getBatchById(id: string) { return MOCK_BATCHES.find(b => b.id === id); },

  getMonthlyStats(teacherId: string, year: number, month: number) {
    const records = this.getAttendanceByTeacher(teacherId).filter(r => {
      const [y,m] = r.date.split('-').map(Number);
      return y === year && m === month;
    });
    const present = records.filter(r => r.status === 'present').length;
    const late = records.filter(r => r.status === 'late').length;
    const leave = records.filter(r => r.status === 'leave').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const total = present + late + leave + absent;
    const working = 26; // configurable
    return { present, late, leave, absent, total, working, percent: total ? Math.round(((present+late)/total)*100) : 0 };
  },

  todayStr() { return today(); },
  generateId() { return uid(); },
};

// Helper to get user display name
export function getUserName(id: string | undefined, users: User[]): string {
  if (!id) return 'Unknown';
  return users.find(u => u.id === id)?.name || 'Unknown';
}

// Leave type labels
export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  full_day: 'Full Day', half_day: 'Half Day',
  emergency: 'Emergency', sick: 'Sick Leave', other: 'Other',
};

// Status colors
export const STATUS_COLORS: Record<AttendanceStatus, { bg: string; text: string; label: string }> = {
  present:    { bg: '#dcfce7', text: '#15803d', label: 'Present' },
  absent:     { bg: '#fee2e2', text: '#dc2626', label: 'Absent' },
  late:       { bg: '#ffedd5', text: '#ea580c', label: 'Late' },
  leave:      { bg: '#fef9c3', text: '#ca8a04', label: 'Leave' },
  half_day:   { bg: '#ede9fe', text: '#7c3aed', label: 'Half Day' },
  holiday:    { bg: '#dbeafe', text: '#1d4ed8', label: 'Holiday' },
  not_marked: { bg: '#f3f4f6', text: '#6b7280', label: 'Not Marked' },
};

export const LEAVE_STATUS_COLORS: Record<LeaveStatus, { bg: string; text: string }> = {
  pending:          { bg: '#fef3c7', text: '#d97706' },
  approved:         { bg: '#dcfce7', text: '#16a34a' },
  rejected:         { bg: '#fee2e2', text: '#dc2626' },
  info_requested:   { bg: '#dbeafe', text: '#2563eb' },
};

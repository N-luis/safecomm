export interface StatCardData {
  id: string;
  title: string;
  value: number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface Case {
  id: string;
  residentName: string;
  caseType: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  barangay: string;
  assignedTo: string;
  description: string;
}

export interface Report {
  id: string;
  title: string;
  category: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  submittedBy: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Resident {
  id: string;
  name: string;
  age: number;
  gender: string;
  barangay: string;
  contactNumber: string;
  email: string;
  status: 'Active' | 'Inactive';
  riskLevel: 'Low' | 'Medium' | 'High';
  registeredDate: string;
}

export interface Activity {
  id: string;
  type: 'case' | 'report' | 'alert' | 'notification' | 'update';
  message: string;
  timestamp: string;
  user?: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  reports?: number;
  cases?: number;
  resolved?: number;
  risk?: number;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

export interface DashboardStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleDarkMode: () => void;
}

export interface ApiMessage {
  id: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
  sender: { id: string; name: string; email: string; role?: string };
  recipient: { id: string; name: string; email: string; role?: string };
  replies?: { id: string; body: string; createdAt: string; sender: { id: string; name: string; email: string } }[];
}

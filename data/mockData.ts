import { Case, Report, Resident, Activity, ChartDataPoint, Notification } from '@/types';

export const mockCases: Case[] = [
  { id: 'C001', residentName: 'Maria Santos', caseType: 'Domestic Violence', status: 'Open', riskLevel: 'High', date: '2024-01-15', barangay: 'Brgy. Rizal', assignedTo: 'Officer Cruz', description: 'Reported domestic altercation requiring immediate intervention.' },
  { id: 'C002', residentName: 'Juan dela Cruz', caseType: 'Child Neglect', status: 'In Progress', riskLevel: 'Critical', date: '2024-01-14', barangay: 'Brgy. Bonifacio', assignedTo: 'Officer Reyes', description: 'Child welfare case involving minors at risk.' },
  { id: 'C003', residentName: 'Ana Reyes', caseType: 'Elder Abuse', status: 'Resolved', riskLevel: 'Medium', date: '2024-01-13', barangay: 'Brgy. Mabini', assignedTo: 'Officer Lim', description: 'Elderly resident reported abuse by caretaker.' },
  { id: 'C004', residentName: 'Pedro Garcia', caseType: 'Substance Abuse', status: 'In Progress', riskLevel: 'High', date: '2024-01-12', barangay: 'Brgy. Luna', assignedTo: 'Officer Tan', description: 'Referral for substance abuse rehabilitation program.' },
  { id: 'C005', residentName: 'Rosa Mendoza', caseType: 'Mental Health', status: 'Open', riskLevel: 'Medium', date: '2024-01-11', barangay: 'Brgy. Rizal', assignedTo: 'Officer Cruz', description: 'Mental health assessment and support services required.' },
  { id: 'C006', residentName: 'Carlos Bautista', caseType: 'Community Conflict', status: 'Closed', riskLevel: 'Low', date: '2024-01-10', barangay: 'Brgy. Aguinaldo', assignedTo: 'Officer Santos', description: 'Neighbor dispute resolved through mediation.' },
  { id: 'C007', residentName: 'Lorna Villanueva', caseType: 'Economic Crisis', status: 'In Progress', riskLevel: 'High', date: '2024-01-09', barangay: 'Brgy. Bonifacio', assignedTo: 'Officer Reyes', description: 'Family facing severe economic hardship, assistance needed.' },
  { id: 'C008', residentName: 'Marco Aquino', caseType: 'Domestic Violence', status: 'Open', riskLevel: 'Critical', date: '2024-01-08', barangay: 'Brgy. Mabini', assignedTo: 'Officer Lim', description: 'Urgent case requiring immediate protective measures.' },
  { id: 'C009', residentName: 'Elena Ramos', caseType: 'Child Abuse', status: 'Resolved', riskLevel: 'High', date: '2024-01-07', barangay: 'Brgy. Luna', assignedTo: 'Officer Tan', description: 'Child abuse case successfully resolved with family intervention.' },
  { id: 'C010', residentName: 'Roberto Pascual', caseType: 'Senior Welfare', status: 'In Progress', riskLevel: 'Low', date: '2024-01-06', barangay: 'Brgy. Aguinaldo', assignedTo: 'Officer Santos', description: 'Senior citizen requiring welfare support and monitoring.' },
];

export const mockReports: Report[] = [
  { id: 'R001', title: 'Monthly Incident Summary - January', category: 'Incident Report', status: 'Approved', submittedBy: 'Officer Cruz', date: '2024-01-31', priority: 'High' },
  { id: 'R002', title: 'Child Welfare Assessment Q1', category: 'Assessment', status: 'Under Review', submittedBy: 'Officer Reyes', date: '2024-01-28', priority: 'High' },
  { id: 'R003', title: 'Community Risk Analysis - Brgy. Rizal', category: 'Risk Assessment', status: 'Pending', submittedBy: 'Officer Lim', date: '2024-01-25', priority: 'Medium' },
  { id: 'R004', title: 'Domestic Violence Statistics', category: 'Statistical Report', status: 'Approved', submittedBy: 'Officer Tan', date: '2024-01-22', priority: 'High' },
  { id: 'R005', title: 'Substance Abuse Intervention Report', category: 'Intervention', status: 'Rejected', submittedBy: 'Officer Santos', date: '2024-01-20', priority: 'Medium' },
];

export const mockResidents: Resident[] = [
  { id: 'RES001', name: 'Maria Santos', age: 34, gender: 'Female', barangay: 'Brgy. Rizal', contactNumber: '09171234567', email: 'maria@example.com', status: 'Active', riskLevel: 'High', registeredDate: '2023-06-15' },
  { id: 'RES002', name: 'Juan dela Cruz', age: 45, gender: 'Male', barangay: 'Brgy. Bonifacio', contactNumber: '09182345678', email: 'juan@example.com', status: 'Active', riskLevel: 'Medium', registeredDate: '2023-07-20' },
  { id: 'RES003', name: 'Ana Reyes', age: 67, gender: 'Female', barangay: 'Brgy. Mabini', contactNumber: '09193456789', email: 'ana@example.com', status: 'Active', riskLevel: 'Low', registeredDate: '2023-08-10' },
  { id: 'RES004', name: 'Pedro Garcia', age: 28, gender: 'Male', barangay: 'Brgy. Luna', contactNumber: '09204567890', email: 'pedro@example.com', status: 'Inactive', riskLevel: 'High', registeredDate: '2023-09-05' },
  { id: 'RES005', name: 'Rosa Mendoza', age: 52, gender: 'Female', barangay: 'Brgy. Rizal', contactNumber: '09215678901', email: 'rosa@example.com', status: 'Active', riskLevel: 'Medium', registeredDate: '2023-10-12' },
];

export const mockActivities: Activity[] = [
  { id: 'A001', type: 'case', message: 'New critical case opened for Marco Aquino in Brgy. Mabini', timestamp: '2 min ago', user: 'Officer Lim', color: '#ef4444' },
  { id: 'A002', type: 'alert', message: 'High risk alert issued for Brgy. Bonifacio district', timestamp: '15 min ago', color: '#f97316' },
  { id: 'A003', type: 'report', message: 'Monthly incident summary report approved', timestamp: '1 hour ago', user: 'Admin', color: '#22c55e' },
  { id: 'A004', type: 'notification', message: 'Resident Elena Ramos case successfully resolved', timestamp: '2 hours ago', user: 'Officer Tan', color: '#3b82f6' },
  { id: 'A005', type: 'update', message: 'Case C002 status updated to In Progress', timestamp: '3 hours ago', user: 'Officer Reyes', color: '#8b5cf6' },
  { id: 'A006', type: 'case', message: 'New domestic violence report filed in Brgy. Rizal', timestamp: '4 hours ago', user: 'Officer Cruz', color: '#ef4444' },
  { id: 'A007', type: 'notification', message: 'System maintenance scheduled for Sunday 2 AM', timestamp: '5 hours ago', color: '#6b7280' },
  { id: 'A008', type: 'alert', message: 'Community risk level elevated in Brgy. Luna', timestamp: '6 hours ago', color: '#f97316' },
];

export const mockNotifications: Notification[] = [
  { id: 'N001', title: 'Critical Case Alert', message: 'New critical case requires immediate attention in Brgy. Mabini', type: 'error', timestamp: '2 min ago', read: false },
  { id: 'N002', title: 'Report Approved', message: 'Your monthly incident report has been approved', type: 'success', timestamp: '1 hour ago', read: false },
  { id: 'N003', title: 'Risk Level Warning', message: 'Elevated risk detected in Brgy. Bonifacio', type: 'warning', timestamp: '2 hours ago', read: false },
  { id: 'N004', title: 'Case Update', message: 'Case C005 has been assigned to your team', type: 'info', timestamp: '3 hours ago', read: true },
  { id: 'N005', title: 'System Update', message: 'Dashboard analytics updated with latest data', type: 'info', timestamp: '5 hours ago', read: true },
];

export const monthlyReportsData: ChartDataPoint[] = [
  { name: 'Jan', reports: 42, cases: 28, resolved: 20 },
  { name: 'Feb', reports: 53, cases: 35, resolved: 28 },
  { name: 'Mar', reports: 48, cases: 31, resolved: 25 },
  { name: 'Apr', reports: 61, cases: 42, resolved: 35 },
  { name: 'May', reports: 55, cases: 38, resolved: 30 },
  { name: 'Jun', reports: 67, cases: 45, resolved: 40 },
  { name: 'Jul', reports: 72, cases: 50, resolved: 44 },
  { name: 'Aug', reports: 58, cases: 39, resolved: 33 },
  { name: 'Sep', reports: 65, cases: 44, resolved: 38 },
  { name: 'Oct', reports: 78, cases: 55, resolved: 48 },
  { name: 'Nov', reports: 69, cases: 47, resolved: 42 },
  { name: 'Dec', reports: 83, cases: 58, resolved: 52 },
];

export const barangayIncidentsData: ChartDataPoint[] = [
  { name: 'Brgy. Rizal', value: 45 },
  { name: 'Brgy. Bonifacio', value: 38 },
  { name: 'Brgy. Mabini', value: 52 },
  { name: 'Brgy. Luna', value: 29 },
  { name: 'Brgy. Aguinaldo', value: 33 },
  { name: 'Brgy. Del Pilar', value: 24 },
  { name: 'Brgy. Burgos', value: 41 },
];

export const caseTypesData = [
  { name: 'Domestic Violence', value: 32, color: '#ef4444' },
  { name: 'Child Welfare', value: 24, color: '#f97316' },
  { name: 'Elder Abuse', value: 15, color: '#eab308' },
  { name: 'Substance Abuse', value: 18, color: '#8b5cf6' },
  { name: 'Mental Health', value: 11, color: '#3b82f6' },
];

export const riskAnalysisData: ChartDataPoint[] = [
  { name: 'Jan', risk: 35, value: 35 },
  { name: 'Feb', risk: 42, value: 42 },
  { name: 'Mar', risk: 38, value: 38 },
  { name: 'Apr', risk: 55, value: 55 },
  { name: 'May', risk: 48, value: 48 },
  { name: 'Jun', risk: 62, value: 62 },
  { name: 'Jul', risk: 58, value: 58 },
  { name: 'Aug', risk: 45, value: 45 },
  { name: 'Sep', risk: 51, value: 51 },
  { name: 'Oct', risk: 67, value: 67 },
  { name: 'Nov', risk: 59, value: 59 },
  { name: 'Dec', risk: 72, value: 72 },
];

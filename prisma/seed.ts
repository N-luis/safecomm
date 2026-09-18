import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma/client';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');

  const adminHash = await bcrypt.hash('admin123', 10);
  const officerHash = await bcrypt.hash('officer123', 10);
  const vawcHash = await bcrypt.hash('vawc1234', 10);
  const sysAdminHash = await bcrypt.hash('admin2024', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@safcom.gov.ph' },
    update: {},
    create: { email: 'admin@safcom.gov.ph', name: 'Barangay Captain Reyes', password: adminHash, role: 'admin' },
  });

  await prisma.user.upsert({
    where: { email: 'sysadmin@safcom.gov.ph' },
    update: {},
    create: { email: 'sysadmin@safcom.gov.ph', name: 'System Admin', password: sysAdminHash, role: 'system_admin' },
  });

  // VAWC Officers — dedicated accounts for the VAWC module
  const vawcOfficers = await Promise.all([
    prisma.user.upsert({ where: { email: 'vawc.garcia@safcom.gov.ph' }, update: {}, create: { email: 'vawc.garcia@safcom.gov.ph', name: 'VAWC Officer Garcia', password: vawcHash, role: 'vawc_officer', barangay: 'Brgy. Rizal', phone: '09171110001' } }),
    prisma.user.upsert({ where: { email: 'vawc.dela@safcom.gov.ph' }, update: {}, create: { email: 'vawc.dela@safcom.gov.ph', name: 'VAWC Officer Dela Cruz', password: vawcHash, role: 'vawc_officer', barangay: 'Brgy. Bonifacio', phone: '09171110002' } }),
    prisma.user.upsert({ where: { email: 'vawc.flores@safcom.gov.ph' }, update: {}, create: { email: 'vawc.flores@safcom.gov.ph', name: 'VAWC Officer Flores', password: vawcHash, role: 'vawc_officer', barangay: 'Brgy. Mabini', phone: '09171110003' } }),
  ]);

  const officers = await Promise.all([
    prisma.user.upsert({ where: { email: 'cruz@safcom.gov.ph' }, update: {}, create: { email: 'cruz@safcom.gov.ph', name: 'Officer Cruz', password: officerHash, role: 'officer', barangay: 'Brgy. Rizal' } }),
    prisma.user.upsert({ where: { email: 'reyes@safcom.gov.ph' }, update: {}, create: { email: 'reyes@safcom.gov.ph', name: 'Officer Reyes', password: officerHash, role: 'officer', barangay: 'Brgy. Bonifacio' } }),
    prisma.user.upsert({ where: { email: 'lim@safcom.gov.ph' }, update: {}, create: { email: 'lim@safcom.gov.ph', name: 'Officer Lim', password: officerHash, role: 'officer', barangay: 'Brgy. Mabini' } }),
    prisma.user.upsert({ where: { email: 'tan@safcom.gov.ph' }, update: {}, create: { email: 'tan@safcom.gov.ph', name: 'Officer Tan', password: officerHash, role: 'officer', barangay: 'Brgy. Luna' } }),
    prisma.user.upsert({ where: { email: 'santos@safcom.gov.ph' }, update: {}, create: { email: 'santos@safcom.gov.ph', name: 'Officer Santos', password: officerHash, role: 'officer', barangay: 'Brgy. Aguinaldo' } }),
  ]);

  // Suppress unused variable warning
  void vawcOfficers;

  const residentData = [
    { num: 'RES-001', first: 'Maria', last: 'Santos', age: 34, gender: 'Female', barangay: 'Brgy. Rizal', address: '123 Rizal St.', contact: '09171234567', email: 'maria@email.com', status: 'Active', risk: 'High' },
    { num: 'RES-002', first: 'Juan', last: 'dela Cruz', age: 45, gender: 'Male', barangay: 'Brgy. Bonifacio', address: '456 Bonifacio Ave.', contact: '09182345678', email: 'juan@email.com', status: 'Active', risk: 'Medium' },
    { num: 'RES-003', first: 'Ana', last: 'Reyes', age: 67, gender: 'Female', barangay: 'Brgy. Mabini', address: '789 Mabini Rd.', contact: '09193456789', email: 'ana@email.com', status: 'Active', risk: 'Low' },
    { num: 'RES-004', first: 'Pedro', last: 'Garcia', age: 28, gender: 'Male', barangay: 'Brgy. Luna', address: '321 Luna Blvd.', contact: '09204567890', email: 'pedro@email.com', status: 'Inactive', risk: 'High' },
    { num: 'RES-005', first: 'Rosa', last: 'Mendoza', age: 52, gender: 'Female', barangay: 'Brgy. Rizal', address: '654 Rizal Ext.', contact: '09215678901', email: 'rosa@email.com', status: 'Active', risk: 'Medium' },
    { num: 'RES-006', first: 'Carlos', last: 'Bautista', age: 39, gender: 'Male', barangay: 'Brgy. Aguinaldo', address: '987 Aguinaldo St.', contact: '09226789012', email: 'carlos@email.com', status: 'Active', risk: 'Low' },
    { num: 'RES-007', first: 'Lorna', last: 'Villanueva', age: 41, gender: 'Female', barangay: 'Brgy. Bonifacio', address: '147 Bonifacio St.', contact: '09237890123', email: 'lorna@email.com', status: 'Active', risk: 'High' },
    { num: 'RES-008', first: 'Marco', last: 'Aquino', age: 33, gender: 'Male', barangay: 'Brgy. Mabini', address: '258 Mabini Ave.', contact: '09248901234', email: 'marco@email.com', status: 'Active', risk: 'Critical' },
    { num: 'RES-009', first: 'Elena', last: 'Ramos', age: 29, gender: 'Female', barangay: 'Brgy. Luna', address: '369 Luna St.', contact: '09259012345', email: 'elena@email.com', status: 'Active', risk: 'Medium' },
    { num: 'RES-010', first: 'Roberto', last: 'Pascual', age: 72, gender: 'Male', barangay: 'Brgy. Aguinaldo', address: '741 Aguinaldo Rd.', contact: '09260123456', email: 'roberto@email.com', status: 'Active', risk: 'Low' },
    { num: 'RES-011', first: 'Lisa', last: 'Fernandez', age: 25, gender: 'Female', barangay: 'Brgy. Del Pilar', address: '852 Del Pilar St.', contact: '09271234567', email: 'lisa@email.com', status: 'Active', risk: 'Medium' },
    { num: 'RES-012', first: 'Antonio', last: 'Torres', age: 48, gender: 'Male', barangay: 'Brgy. Burgos', address: '963 Burgos Ave.', contact: '09282345678', email: 'antonio@email.com', status: 'Active', risk: 'High' },
  ];

  const residents = await Promise.all(
    residentData.map((r) =>
      prisma.resident.upsert({
        where: { residentNumber: r.num },
        update: {},
        create: { residentNumber: r.num, firstName: r.first, lastName: r.last, age: r.age, gender: r.gender, barangay: r.barangay, address: r.address, contactNumber: r.contact, email: r.email, status: r.status, riskLevel: r.risk },
      })
    )
  );

  const caseData = [
    { num: 'C-2024-001', resName: 'Maria Santos', type: 'Domestic Violence', status: 'Open', risk: 'High', barangay: 'Brgy. Rizal', desc: 'Reported domestic altercation requiring immediate intervention.', officerIdx: 0, resIdx: 0, daysAgo: 10 },
    { num: 'C-2024-002', resName: 'Juan dela Cruz', type: 'Child Neglect', status: 'In Progress', risk: 'Critical', barangay: 'Brgy. Bonifacio', desc: 'Child welfare case involving minors at risk.', officerIdx: 1, resIdx: 1, daysAgo: 11 },
    { num: 'C-2024-003', resName: 'Ana Reyes', type: 'Elder Abuse', status: 'Resolved', risk: 'Medium', barangay: 'Brgy. Mabini', desc: 'Elderly resident reported abuse by caretaker.', officerIdx: 2, resIdx: 2, daysAgo: 12 },
    { num: 'C-2024-004', resName: 'Pedro Garcia', type: 'Substance Abuse', status: 'In Progress', risk: 'High', barangay: 'Brgy. Luna', desc: 'Referral for substance abuse rehabilitation program.', officerIdx: 3, resIdx: 3, daysAgo: 13 },
    { num: 'C-2024-005', resName: 'Rosa Mendoza', type: 'Mental Health', status: 'Open', risk: 'Medium', barangay: 'Brgy. Rizal', desc: 'Mental health assessment and support services required.', officerIdx: 0, resIdx: 4, daysAgo: 14 },
    { num: 'C-2024-006', resName: 'Carlos Bautista', type: 'Community Conflict', status: 'Closed', risk: 'Low', barangay: 'Brgy. Aguinaldo', desc: 'Neighbor dispute resolved through mediation.', officerIdx: 4, resIdx: 5, daysAgo: 15 },
    { num: 'C-2024-007', resName: 'Lorna Villanueva', type: 'Economic Crisis', status: 'In Progress', risk: 'High', barangay: 'Brgy. Bonifacio', desc: 'Family facing severe economic hardship.', officerIdx: 1, resIdx: 6, daysAgo: 16 },
    { num: 'C-2024-008', resName: 'Marco Aquino', type: 'Domestic Violence', status: 'Open', risk: 'Critical', barangay: 'Brgy. Mabini', desc: 'Urgent case requiring immediate protective measures.', officerIdx: 2, resIdx: 7, daysAgo: 17 },
    { num: 'C-2024-009', resName: 'Elena Ramos', type: 'Child Abuse', status: 'Resolved', risk: 'High', barangay: 'Brgy. Luna', desc: 'Child abuse case successfully resolved.', officerIdx: 3, resIdx: 8, daysAgo: 18 },
    { num: 'C-2024-010', resName: 'Roberto Pascual', type: 'Senior Welfare', status: 'In Progress', risk: 'Low', barangay: 'Brgy. Aguinaldo', desc: 'Senior citizen welfare support and monitoring.', officerIdx: 4, resIdx: 9, daysAgo: 19 },
    { num: 'C-2024-011', resName: 'Lisa Fernandez', type: 'Mental Health', status: 'Open', risk: 'Medium', barangay: 'Brgy. Del Pilar', desc: 'Anxiety and depression assessment required.', officerIdx: 0, resIdx: 10, daysAgo: 20 },
    { num: 'C-2024-012', resName: 'Antonio Torres', type: 'Domestic Violence', status: 'In Progress', risk: 'High', barangay: 'Brgy. Burgos', desc: 'Multiple domestic incident reports filed.', officerIdx: 1, resIdx: 11, daysAgo: 21 },
  ];

  const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

  const cases = await Promise.all(
    caseData.map((c) =>
      prisma.case.upsert({
        where: { caseNumber: c.num },
        update: {},
        create: {
          caseNumber: c.num, residentName: c.resName, caseType: c.type,
          status: c.status, riskLevel: c.risk, barangay: c.barangay, description: c.desc,
          assignedToId: officers[c.officerIdx].id, residentId: residents[c.resIdx].id,
          filedAt: daysAgo(c.daysAgo),
          resolvedAt: (c.status === 'Resolved' || c.status === 'Closed') ? new Date() : null,
        },
      })
    )
  );

  await Promise.all([
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-001' }, update: {}, create: { reportNumber: 'RPT-2024-001', title: 'Monthly Incident Summary - January', category: 'Incident Report', status: 'Approved', priority: 'High', content: 'January: 42 incidents, 28 cases opened, 20 resolved.', submittedById: officers[0].id } }),
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-002' }, update: {}, create: { reportNumber: 'RPT-2024-002', title: 'Child Welfare Assessment Q1', category: 'Assessment', status: 'Under Review', priority: 'High', content: 'Q1 child welfare assessment covering 15 barangays.', submittedById: officers[1].id } }),
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-003' }, update: {}, create: { reportNumber: 'RPT-2024-003', title: 'Community Risk Analysis - Brgy. Rizal', category: 'Risk Assessment', status: 'Pending', priority: 'Medium', content: 'Risk factors: poverty index 0.42, unemployment 18%.', submittedById: officers[2].id } }),
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-004' }, update: {}, create: { reportNumber: 'RPT-2024-004', title: 'Domestic Violence Statistics Q1', category: 'Statistical Report', status: 'Approved', priority: 'High', content: 'DV cases up 12% vs Q4 2023.', submittedById: officers[3].id } }),
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-005' }, update: {}, create: { reportNumber: 'RPT-2024-005', title: 'Substance Abuse Intervention Report', category: 'Intervention', status: 'Rejected', priority: 'Medium', content: '8 referrals: 5 completed, 3 withdrew.', submittedById: officers[4].id } }),
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-006' }, update: {}, create: { reportNumber: 'RPT-2024-006', title: 'Senior Citizen Welfare Program Q1', category: 'Program Report', status: 'Approved', priority: 'Low', content: '47 seniors enrolled, 92% satisfaction rate.', submittedById: officers[0].id } }),
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-007' }, update: {}, create: { reportNumber: 'RPT-2024-007', title: 'Mental Health Crisis Intervention', category: 'Intervention', status: 'Under Review', priority: 'High', content: '12 crisis interventions, 10 de-escalated.', submittedById: officers[1].id } }),
    prisma.report.upsert({ where: { reportNumber: 'RPT-2024-008' }, update: {}, create: { reportNumber: 'RPT-2024-008', title: 'Barangay Risk Index February', category: 'Risk Assessment', status: 'Approved', priority: 'Medium', content: 'Risk index increased in Brgy. Mabini (6.8→7.2).', submittedById: officers[2].id } }),
  ]);

  if ((await prisma.notification.count()) === 0) {
    await Promise.all([
      // Broadcast notifications — visible to ALL users (userId: null)
      prisma.notification.create({ data: { title: 'Critical Case Alert', message: 'New critical case requires immediate attention in Brgy. Mabini', type: 'error', read: false, userId: null } }),
      prisma.notification.create({ data: { title: 'Risk Level Warning', message: 'Elevated risk detected in Brgy. Bonifacio — increase patrol frequency', type: 'warning', read: false, userId: null } }),
      prisma.notification.create({ data: { title: 'System Maintenance Complete', message: 'SafeComm platform maintenance finished. All services are operational.', type: 'success', read: false, userId: null } }),
      // Admin-only notifications
      prisma.notification.create({ data: { title: 'Report Approved', message: 'Monthly incident report approved by review committee', type: 'success', read: false, userId: admin.id } }),
      prisma.notification.create({ data: { title: 'System Update', message: 'Dashboard analytics refreshed with latest data', type: 'info', read: true, userId: admin.id } }),
      // Blotter officer notifications
      prisma.notification.create({ data: { title: 'Case Assigned', message: 'Case C-2024-005 has been assigned to your queue for processing', type: 'info', read: false, userId: officers[0].id } }),
      prisma.notification.create({ data: { title: 'Case Assigned', message: 'Case C-2024-005 has been assigned to your queue for processing', type: 'info', read: false, userId: officers[1].id } }),
      prisma.notification.create({ data: { title: 'Case Assigned', message: 'Case C-2024-005 has been assigned to your queue for processing', type: 'info', read: false, userId: officers[2].id } }),
      prisma.notification.create({ data: { title: 'Case Assigned', message: 'Case C-2024-005 has been assigned to your queue for processing', type: 'info', read: false, userId: officers[3].id } }),
      prisma.notification.create({ data: { title: 'Case Assigned', message: 'Case C-2024-005 has been assigned to your queue for processing', type: 'info', read: false, userId: officers[4].id } }),
    ]);
  }

  if ((await prisma.alert.count()) === 0) {
    await Promise.all([
      prisma.alert.create({ data: { title: 'High Risk Area', message: 'Elevated crime activity in Brgy. Mabini', level: 'critical', barangay: 'Brgy. Mabini', active: true } }),
      prisma.alert.create({ data: { title: 'Weather Advisory', message: 'Typhoon warning — seek shelter', level: 'warning', active: true } }),
      prisma.alert.create({ data: { title: 'Community Meeting', message: 'Mandatory barangay meeting this Saturday', level: 'info', barangay: 'Brgy. Rizal', active: true } }),
    ]);
  }

  await Promise.all([
    prisma.activity.create({ data: { type: 'case', message: 'New critical case C-2024-008 opened for Marco Aquino', color: '#ef4444', userId: officers[2].id, caseId: cases[7].id } }),
    prisma.activity.create({ data: { type: 'alert', message: 'High risk alert issued for Brgy. Bonifacio district', color: '#f97316', userId: admin.id } }),
    prisma.activity.create({ data: { type: 'report', message: 'Monthly incident summary report approved', color: '#22c55e', userId: admin.id } }),
    prisma.activity.create({ data: { type: 'notification', message: 'Case C-2024-009 (Elena Ramos) successfully resolved', color: '#3b82f6', userId: officers[3].id, caseId: cases[8].id } }),
    prisma.activity.create({ data: { type: 'update', message: 'Case C-2024-002 status updated to In Progress', color: '#8b5cf6', userId: officers[1].id, caseId: cases[1].id } }),
    prisma.activity.create({ data: { type: 'case', message: 'New domestic violence report filed in Brgy. Rizal', color: '#ef4444', userId: officers[0].id, caseId: cases[0].id } }),
    prisma.activity.create({ data: { type: 'notification', message: 'System maintenance completed', color: '#6b7280', userId: admin.id } }),
    prisma.activity.create({ data: { type: 'alert', message: 'Community risk level elevated in Brgy. Luna', color: '#f97316', userId: admin.id } }),
  ]);

  await Promise.all([
    prisma.message.create({ data: { subject: 'Case C-2024-001 Assignment', body: 'Good morning Admin,\n\nI wanted to update you on Case C-2024-001 (Maria Santos - Domestic Violence). I have conducted an initial interview and the situation requires urgent intervention. I am requesting authorization to proceed with protective custody evaluation.\n\nPlease advise on next steps.\n\nRespectfully,\nOfficer Cruz', senderId: officers[0].id, recipientId: admin.id, read: false, createdAt: daysAgo(0) } }),
    prisma.message.create({ data: { subject: 'Monthly Report Submission', body: 'Dear Admin,\n\nPlease find the monthly report for Brgy. Bonifacio attached. This month we recorded 8 new cases, 5 resolved, and 3 ongoing interventions. The dominant case type remains Child Neglect at 40%.\n\nKind regards,\nOfficer Reyes', senderId: officers[1].id, recipientId: admin.id, read: false, createdAt: daysAgo(1) } }),
    prisma.message.create({ data: { subject: 'Request for Additional Resources', body: 'Admin,\n\nOur team in Brgy. Mabini is currently handling 4 critical cases simultaneously. We urgently need additional manpower or temporary reassignment of at least 2 officers to manage the caseload effectively. The Elder Abuse case (C-2024-003) needs daily monitoring.\n\n- Officer Lim', senderId: officers[2].id, recipientId: admin.id, read: true, createdAt: daysAgo(2) } }),
    prisma.message.create({ data: { subject: 'Training Completion Certificate', body: 'Hi Admin,\n\nI have successfully completed the Mental Health First Aid training as required. Certificate number: MHFA-2024-0892. Please update my personnel file accordingly.\n\nThank you,\nOfficer Tan', senderId: officers[3].id, recipientId: admin.id, read: true, createdAt: daysAgo(3) } }),
    prisma.message.create({ data: { subject: 'Welfare Check - Resident RES-004', body: 'Good day Admin,\n\nI conducted a welfare check on Resident Pedro Garcia (RES-004) as scheduled. He was found in good condition but still exhibiting signs of substance dependency. I have coordinated with the rehabilitation center for a follow-up visit next week.\n\nOfficer Santos', senderId: officers[4].id, recipientId: admin.id, read: true, createdAt: daysAgo(4) } }),
    prisma.message.create({ data: { subject: 'Re: Case Assignment Update', body: 'Officer Cruz,\n\nThank you for your prompt update on Case C-2024-001. I have reviewed the situation and authorize you to proceed with the protective custody evaluation. Please coordinate with the DSWD representative and document all proceedings.\n\nI will be monitoring this case closely. Please send daily updates until the situation stabilizes.\n\nAdmin', senderId: admin.id, recipientId: officers[0].id, read: true, createdAt: daysAgo(0) } }),
  ]);

  console.log('\n✅ Seed complete!');
  console.log('   Barangay Captain → admin@safcom.gov.ph        / admin123');
  console.log('   System Admin     → sysadmin@safcom.gov.ph    / admin2024');
  console.log('   Blotter Officer  → cruz@safcom.gov.ph         / officer123');
  console.log('   VAWC Officer     → vawc.garcia@safcom.gov.ph  / vawc1234');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

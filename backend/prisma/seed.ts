/**
 * backend/prisma/seed.ts
 *
 * Comprehensive seed for the RBAC School Management System.
 * Populates all 4 administrative domains:
 *   - Registrar   → Subjects, Enrollments (with grades)
 *   - SAO         → Incidents, Clearances
 *   - Librarian   → LibraryRecords (loans + overdue fines)
 *   - Admin       → Staff accounts
 *
 * Run: npm run prisma:seed
 */

import {
  PrismaClient,
  Role,
  EnrollmentStatus,
  IncidentSeverity,
  IncidentStatus,
  ClearanceStatus,
  LoanStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const PASSWORD = 'password123';

// ─────────────────────────────────────────────────────────────────────────────
// 1.  HELPER: date offset from today
// ─────────────────────────────────────────────────────────────────────────────
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  STATIC DATA DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const STAFF = [
  { email: 'admin@school.edu', name: 'System Administrator', role: Role.ADMIN },
  { email: 'registrar@school.edu', name: 'Eleanor Vance', role: Role.REGISTRAR },
  { email: 'sao@school.edu', name: 'Officer Ronald Davies', role: Role.SAO },
  { email: 'librarian@school.edu', name: 'Gwen Finch', role: Role.LIBRARIAN },
];

const STUDENTS = [
  { email: 'alex.johnson@school.edu', name: 'Alex Johnson' },
  { email: 'samantha.clark@school.edu', name: 'Samantha Clark' },
  { email: 'david.lee@school.edu', name: 'David Lee' },
  { email: 'leo.miller@school.edu', name: 'Leo Miller' },
  { email: 'chloe.bennett@school.edu', name: 'Chloe Bennett' },
  { email: 'john.doe@school.edu', name: 'John Doe' },
  { email: 'maria.santos@school.edu', name: 'Maria Santos' },
  { email: 'ethan.park@school.edu', name: 'Ethan Park' },
  { email: 'isabella.reyes@school.edu', name: 'Isabella Reyes' },
  { email: 'noah.cruz@school.edu', name: 'Noah Cruz' },
];

/** Shorthand: student@school.edu still maps to Alex Johnson for quick login */
const LEGACY_STUDENT_EMAIL = 'student@school.edu';

const SUBJECTS = [
  { code: 'CS101', title: 'Introduction to Computer Science', schedule: 'MWF 9:00–10:30 AM', units: 3, instructor: 'Dr. Alan Turing' },
  { code: 'MATH201', title: 'Discrete Mathematics', schedule: 'TTH 1:00–2:30 PM', units: 3, instructor: 'Prof. Katherine Johnson' },
  { code: 'ENG102', title: 'Technical Writing & Comms', schedule: 'MWF 11:00–12:00 PM', units: 3, instructor: 'Prof. Mary Shelley' },
  { code: 'SCI301', title: 'Physics for Engineers', schedule: 'TTH 7:30–9:00 AM', units: 4, instructor: 'Dr. Marie Curie' },
  { code: 'HUM110', title: 'Ethics and Society', schedule: 'MWF 2:00–3:00 PM', units: 2, instructor: 'Prof. Aristotle Ramos' },
];

// Each student gets 2–3 subjects (by zero-based index into SUBJECTS array)
// Format: [subjectIndex, midterm, final]
type CourseAssignment = [number, number | null, number | null];
const STUDENT_COURSES: CourseAssignment[][] = [
  [[0, 92, 88], [1, 85, 90], [2, 78, 82]],         // Alex
  [[0, 75, 80], [3, 88, 91]],                        // Samantha
  [[1, 60, 55], [2, 72, 68], [4, 90, 95]],           // David
  [[0, 95, 97], [2, 88, 85]],                        // Leo
  [[1, 70, 74], [3, 82, 79], [4, 88, 92]],           // Chloe
  [[0, 55, 60], [1, 65, 70]],                        // John
  [[2, 91, 94], [3, 87, 83], [4, 76, 80]],           // Maria
  [[0, 80, 85], [4, 72, 68]],                        // Ethan
  [[1, 93, 96], [2, 89, 91], [3, 85, 88]],           // Isabella
  [[0, 45, 50], [3, 60, 55]],                        // Noah (academic risk)
];

type IncidentDef = {
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  daysAgoReported: number;
};
// Incidents indexed to student positions (0-based)
const INCIDENT_MAP: Record<number, IncidentDef[]> = {
  5: [ // John Doe
    {
      title: 'Unauthorized Poster Dissemination',
      description: 'Student posted unsanctioned campaign materials on campus bulletin boards without SAO approval.',
      severity: IncidentSeverity.MEDIUM,
      status: IncidentStatus.UNDER_REVIEW,
      daysAgoReported: 14,
    },
  ],
  9: [ // Noah Cruz
    {
      title: 'Academic Dishonesty – Plagiarism',
      description: 'Submitted a research paper containing sections copied verbatim from an unattributed source.',
      severity: IncidentSeverity.HIGH,
      status: IncidentStatus.OPEN,
      daysAgoReported: 7,
    },
    {
      title: 'Repeated Tardiness',
      description: 'Arrived late to SCI301 seven times in the current semester.',
      severity: IncidentSeverity.LOW,
      status: IncidentStatus.RESOLVED,
      daysAgoReported: 30,
    },
  ],
  3: [ // Leo Miller
    {
      title: 'Noise Violation – Library',
      description: 'Student was warned twice for disruptive conversation in the quiet study zone.',
      severity: IncidentSeverity.LOW,
      status: IncidentStatus.DISMISSED,
      daysAgoReported: 21,
    },
  ],
};

type ClearanceDef = { department: string; status: ClearanceStatus; remarks?: string };
// Clearances for students who need sign-off
const CLEARANCE_MAP: Record<number, ClearanceDef[]> = {
  5: [ // John Doe — pending SAO, pending Library
    { department: 'SAO', status: ClearanceStatus.PENDING, remarks: 'Awaiting incident resolution before sign-off' },
    { department: 'LIBRARY', status: ClearanceStatus.APPROVED, remarks: 'No outstanding library obligations' },
    { department: 'REGISTRAR', status: ClearanceStatus.APPROVED, remarks: 'All grades submitted' },
  ],
  9: [ // Noah Cruz — multiple holds
    { department: 'SAO', status: ClearanceStatus.PENDING, remarks: 'Plagiarism case under investigation' },
    { department: 'REGISTRAR', status: ClearanceStatus.PENDING, remarks: 'Failing grade in SCI301 — adviser review required' },
    { department: 'LIBRARY', status: ClearanceStatus.APPROVED },
  ],
  7: [ // Ethan Park — library hold
    { department: 'LIBRARY', status: ClearanceStatus.PENDING, remarks: 'Overdue fine of ₱180 unsettled' },
    { department: 'SAO', status: ClearanceStatus.APPROVED },
    { department: 'REGISTRAR', status: ClearanceStatus.APPROVED },
  ],
};

type LoanDef = {
  bookTitle: string;
  bookIsbn?: string;
  borrowedDaysAgo: number;
  dueDaysFromBorrow: number;
  status: LoanStatus;
  fineAmount: number;
  finePaid: boolean;
};
const LOAN_MAP: Record<number, LoanDef[]> = {
  0: [ // Alex Johnson — clean active loan
    {
      bookTitle: 'Clean Architecture',
      bookIsbn: '978-0134494166',
      borrowedDaysAgo: 5,
      dueDaysFromBorrow: 14,
      status: LoanStatus.ACTIVE,
      fineAmount: 0,
      finePaid: false,
    },
  ],
  5: [ // John Doe — returned on time
    {
      bookTitle: 'The Pragmatic Programmer',
      bookIsbn: '978-0135957059',
      borrowedDaysAgo: 25,
      dueDaysFromBorrow: 14,
      status: LoanStatus.RETURNED,
      fineAmount: 0,
      finePaid: false,
    },
  ],
  7: [ // Ethan Park — overdue with unpaid fine
    {
      bookTitle: 'Introduction to Algorithms (CLRS)',
      bookIsbn: '978-0262046305',
      borrowedDaysAgo: 28,
      dueDaysFromBorrow: 14,
      status: LoanStatus.OVERDUE,
      fineAmount: 180,
      finePaid: false,
    },
  ],
  9: [ // Noah Cruz — overdue with partial fine
    {
      bookTitle: 'Structure and Interpretation of Computer Programs',
      bookIsbn: '978-0262510875',
      borrowedDaysAgo: 35,
      dueDaysFromBorrow: 14,
      status: LoanStatus.OVERDUE,
      fineAmount: 280,
      finePaid: false,
    },
    {
      bookTitle: 'Discrete Mathematics and Its Applications',
      bookIsbn: '978-1259676512',
      borrowedDaysAgo: 10,
      dueDaysFromBorrow: 14,
      status: LoanStatus.ACTIVE,
      fineAmount: 0,
      finePaid: false,
    },
  ],
  2: [ // David Lee — returned on time
    {
      bookTitle: 'Physics for Scientists and Engineers',
      bookIsbn: '978-1133947271',
      borrowedDaysAgo: 20,
      dueDaysFromBorrow: 14,
      status: LoanStatus.RETURNED,
      fineAmount: 0,
      finePaid: false,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3.  MAIN SEED
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║          MYCAMPUSDAYS — Database Seed Script             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // ── STEP 1: Clean slate ────────────────────────────────────────────────────
  console.log('▸ [1/6] Cleaning existing records...');
  await prisma.libraryRecord.deleteMany();
  await prisma.clearance.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ All tables cleared.\n');

  // ── STEP 2: Hash password ──────────────────────────────────────────────────
  console.log('▸ [2/6] Hashing shared password...');
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  console.log('  ✓ bcrypt hash ready (cost=12).\n');

  // ── STEP 3: Staff accounts ─────────────────────────────────────────────────
  console.log('▸ [3/6] Creating staff accounts...');
  for (const s of STAFF) {
    await prisma.user.create({ data: { ...s, passwordHash } });
    console.log(`  + [${s.role.padEnd(9)}] ${s.email}`);
  }
  console.log();

  // ── STEP 4: Student accounts ───────────────────────────────────────────────
  console.log('▸ [4/6] Creating 10 student accounts...');

  // Keep the legacy email pointing to Alex Johnson for backward compat
  const studentUsers: { id: string; email: string; name: string }[] = [];

  for (let i = 0; i < STUDENTS.length; i++) {
    const s = STUDENTS[i];
    const user = await prisma.user.create({
      data: {
        email: s.email,
        name: s.name,
        role: Role.STUDENT,
        passwordHash,
      },
    });
    studentUsers.push({ id: user.id, email: user.email, name: user.name });
    console.log(`  + [STUDENT   ] ${s.email}`);
  }

  // Also upsert the legacy alias so existing front-end quick-fill still works
  await prisma.user.upsert({
    where: { email: LEGACY_STUDENT_EMAIL },
    update: { name: 'Alex Johnson', role: Role.STUDENT, passwordHash },
    create: { email: LEGACY_STUDENT_EMAIL, name: 'Alex Johnson', role: Role.STUDENT, passwordHash },
  });
  console.log(`  + [STUDENT   ] ${LEGACY_STUDENT_EMAIL} (legacy alias → Alex Johnson)`);
  console.log();

  // ── STEP 5: Registrar data — Subjects + Enrollments ───────────────────────
  console.log('▸ [5/6] Seeding Registrar domain (Subjects + Enrollments)...');

  const subjectRecords = await Promise.all(
    SUBJECTS.map((sub) =>
      prisma.subject.create({ data: sub })
    )
  );
  console.log(`  ✓ ${subjectRecords.length} subjects created.`);

  let enrollmentCount = 0;
  for (let si = 0; si < studentUsers.length; si++) {
    const student = studentUsers[si];
    const courses = STUDENT_COURSES[si];

    for (const [subIdx, midterm, final] of courses) {
      const subject = subjectRecords[subIdx];
      const isCompleted =
        midterm !== null && final !== null && final >= 60;

      await prisma.enrollment.create({
        data: {
          userId: student.id,
          subjectId: subject.id,
          status: isCompleted ? EnrollmentStatus.ENROLLED : EnrollmentStatus.ENROLLED,
          midtermGrade: midterm ?? undefined,
          finalGrade: final ?? undefined,
          remarks:
            final !== null && final < 60
              ? 'For remediation — adviser conference required'
              : null,
        },
      });
      enrollmentCount++;
    }
  }
  console.log(`  ✓ ${enrollmentCount} enrollment records created.\n`);

  // ── STEP 6: SAO domain — Incidents + Clearances ───────────────────────────
  console.log('▸ [6a] Seeding SAO domain (Incidents + Clearances)...');

  let incidentCount = 0;
  let clearanceCount = 0;

  for (const [idxStr, defs] of Object.entries(INCIDENT_MAP)) {
    const idx = Number(idxStr);
    const student = studentUsers[idx];
    for (const def of defs) {
      await prisma.incident.create({
        data: {
          studentId: student.id,
          title: def.title,
          description: def.description,
          severity: def.severity,
          status: def.status,
          dateReported: daysAgo(def.daysAgoReported),
          resolvedAt:
            def.status === IncidentStatus.RESOLVED || def.status === IncidentStatus.DISMISSED
              ? daysAgo(def.daysAgoReported - 5)
              : null,
        },
      });
      incidentCount++;
    }
  }

  for (const [idxStr, defs] of Object.entries(CLEARANCE_MAP)) {
    const idx = Number(idxStr);
    const student = studentUsers[idx];
    for (const def of defs) {
      await prisma.clearance.create({
        data: {
          studentId: student.id,
          department: def.department,
          status: def.status,
          remarks: def.remarks ?? null,
          issuedAt: def.status === ClearanceStatus.APPROVED ? daysAgo(3) : null,
        },
      });
      clearanceCount++;
    }
  }

  console.log(`  ✓ ${incidentCount} incidents + ${clearanceCount} clearance records created.\n`);

  // ── STEP 6b: Librarian domain — Library Records ───────────────────────────
  console.log('▸ [6b] Seeding Librarian domain (LibraryRecords)...');

  let loanCount = 0;
  for (const [idxStr, loans] of Object.entries(LOAN_MAP)) {
    const idx = Number(idxStr);
    const student = studentUsers[idx];
    for (const loan of loans) {
      const borrowed = daysAgo(loan.borrowedDaysAgo);
      const due = new Date(borrowed);
      due.setDate(due.getDate() + loan.dueDaysFromBorrow);

      const returnedAt =
        loan.status === LoanStatus.RETURNED
          ? new Date(due.getTime() - 2 * 24 * 60 * 60 * 1000) // returned 2 days early
          : null;

      await prisma.libraryRecord.create({
        data: {
          studentId: student.id,
          bookTitle: loan.bookTitle,
          bookIsbn: loan.bookIsbn ?? null,
          borrowedAt: borrowed,
          dueDate: due,
          returnedAt,
          status: loan.status,
          fineAmount: loan.fineAmount,
          finePaid: loan.finePaid,
        },
      });
      loanCount++;
    }
  }
  console.log(`  ✓ ${loanCount} library loan records created.\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // Final Summary
  // ─────────────────────────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  SEED COMPLETE — Student Login Credentials');
  console.log('══════════════════════════════════════════════════════════════');

  const tableData = [
    ...STUDENTS.map((s) => ({ Name: s.name, Email: s.email, Password: PASSWORD })),
    { Name: 'Alex Johnson (alias)', Email: LEGACY_STUDENT_EMAIL, Password: PASSWORD },
  ];
  console.table(tableData);

  console.log('\n  Staff Accounts:');
  console.table(
    STAFF.map((s) => ({ Role: s.role, Email: s.email, Password: PASSWORD }))
  );

  console.log('\n  🔐 All accounts share the password:', PASSWORD);
  console.log('  ✅ Database is ready. Start your servers!\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap
// ─────────────────────────────────────────────────────────────────────────────
main()
  .catch((e) => {
    console.error('\n❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/registrar/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const getRegistrarDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalStudents, enrollments] = await Promise.all([
      (prisma as any).user.count({ where: { role: 'STUDENT' } }),
      (prisma as any).enrollment.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, name: true, email: true } },
          subject: { select: { courseCode: true, courseTitle: true } },
        },
      }),
    ]);

    const recentEnrollments = enrollments.map((e: any, idx: number) => ({
      studentId: `STU-${String(1000 + idx).padStart(4, '0')}`,
      name: e.student?.name ?? 'Unknown',
      course: e.subject?.courseTitle ?? 'Unknown Subject',
      year: '—',
      status: e.status === 'ENROLLED' ? 'Enrolled' : e.status,
    }));

    res.status(200).json({
      status: 'success',
      metrics: {
        totalRegisteredStudents: totalStudents,
        pendingEnrollments: enrollments.filter((e: any) => e.status === 'PENDING').length,
        transcriptsRequested: 0,
        graduationCandidates: Math.floor(totalStudents * 0.15),
      },
      recentEnrollments,
    });
  } catch (err) {
    console.error('getRegistrarDashboard error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load registrar dashboard' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/registrar/enrollments
// ─────────────────────────────────────────────────────────────────────────────
export const getEnrollments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await (prisma as any).enrollment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true } },
        subject: { select: { courseCode: true, courseTitle: true, units: true } },
      },
    });

    const enrollments = rows.map((e: any) => ({
      id: e.id,
      studentName: e.student?.name ?? 'Unknown',
      email: e.student?.email ?? '',
      subject: e.subject?.courseCode ?? 'N/A',
      title: e.subject?.courseTitle ?? 'Unknown Subject',
      units: e.subject?.units ?? 0,
      midterm: e.midtermGrade ?? null,
      final: e.finalGrade ?? null,
      status: e.status,
      remarks: e.remarks ?? null,
    }));

    res.status(200).json({ status: 'success', enrollments });
  } catch (err) {
    console.error('getEnrollments error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load enrollment records' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/registrar/enrollments/:id/approve
// ─────────────────────────────────────────────────────────────────────────────
export const approveEnrollment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedEnrollment = await (prisma as any).enrollment.update({
      where: { id },
      data: { status: 'ENROLLED' },
      include: {
        student: { select: { id: true, name: true, email: true } },
        subject: true,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Enrollment successfully approved',
      enrollment: updatedEnrollment,
    });
  } catch (err) {
    console.error('approveEnrollment error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to approve enrollment' });
  }
};
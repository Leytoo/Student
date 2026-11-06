import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/sao/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const getSaoDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [incidentCount, pendingClearances, studentClearances] = await Promise.all([
      (prisma as any).incident.count({ where: { status: { not: 'RESOLVED' } } }),
      (prisma as any).clearance.count({ where: { status: 'PENDING', department: 'SAO' } }),
      (prisma as any).clearance.findMany({
        take: 10,
        where: { department: 'SAO' },
        orderBy: { createdAt: 'desc' },
        include: { student: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    const clearances = studentClearances.map((c: any) => ({
      id:           c.id,
      studentId:    c.student?.id    ?? '',
      name:         c.student?.name  ?? 'Unknown',
      organization: 'SAO Domain',
      status:       c.status,
      remarks:      c.remarks ?? null,
    }));

    res.status(200).json({
      status: 'success',
      metrics: {
        activeClubs:          24,
        pendingClearances,
        disciplineIncidents:  incidentCount,
        upcomingCampusEvents: 5,
      },
      clearances,
    });
  } catch (err) {
    console.error('getSaoDashboard error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load SAO dashboard' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/sao/clearances
// ─────────────────────────────────────────────────────────────────────────────
export const getClearances = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await (prisma as any).clearance.findMany({
      orderBy: { createdAt: 'desc' },
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    const clearances = rows.map((c: any) => ({
      id:         c.id,
      studentId:  c.student?.id    ?? '',
      name:       c.student?.name  ?? 'Unknown',
      email:      c.student?.email ?? '',
      department: c.department,
      status:     c.status,
      remarks:    c.remarks ?? null,
      issuedAt:   c.issuedAt ?? null,
    }));

    res.status(200).json({ status: 'success', clearances });
  } catch (err) {
    console.error('getClearances error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load clearance records' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/sao/discipline
// ─────────────────────────────────────────────────────────────────────────────
export const getDisciplineIncidents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await (prisma as any).incident.findMany({
      orderBy: { dateReported: 'desc' },
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    const incidents = rows.map((inc: any, idx: number) => ({
      id:           `DISC-${String(100 + idx).padStart(3, '0')}`,
      studentId:    inc.student?.id    ?? '',
      student:      inc.student?.name  ?? 'Unknown',
      email:        inc.student?.email ?? '',
      offense:      inc.title,
      description:  inc.description,
      severity:     inc.severity,
      status:       inc.status,
      dateReported: inc.dateReported,
      resolvedAt:   inc.resolvedAt ?? null,
    }));

    res.status(200).json({ status: 'success', incidents });
  } catch (err) {
    console.error('getDisciplineIncidents error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load discipline records' });
  }
};


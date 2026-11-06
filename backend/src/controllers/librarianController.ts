import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/librarian/dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const getLibrarianDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalStudents, activeLoans, overdueLoans, recentLoans] = await Promise.all([
      (prisma as any).user.count({ where: { role: 'STUDENT' } }),
      (prisma as any).libraryRecord.count({ where: { status: 'ACTIVE' } }),
      (prisma as any).libraryRecord.count({ where: { status: 'OVERDUE' } }),
      (prisma as any).libraryRecord.findMany({
        take: 10,
        orderBy: { borrowedAt: 'desc' },
        include: { student: { select: { id: true, name: true, email: true } } },
      }),
    ]);

    const loans = recentLoans.map((r: any, idx: number) => ({
      id:        `LN-${String(700 + idx).padStart(3, '0')}`,
      bookTitle: r.bookTitle,
      borrower:  `${r.student?.name ?? 'Unknown'}`,
      dueDate:   r.dueDate?.toISOString().split('T')[0] ?? 'N/A',
      status:    r.status === 'ACTIVE' ? 'On Loan' : r.status === 'OVERDUE' ? 'Overdue' : 'Returned',
      fine:      r.fineAmount > 0 ? `₱${r.fineAmount}` : null,
    }));

    res.status(200).json({
      status: 'success',
      metrics: {
        totalCatalogBooks:  18450,
        checkedOutBooks:    activeLoans,
        overdueReturns:     overdueLoans,
        activeLibraryCards: totalStudents,
      },
      recentLoans: loans,
    });
  } catch (err) {
    console.error('getLibrarianDashboard error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load librarian dashboard' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/librarian/loans
// ─────────────────────────────────────────────────────────────────────────────
export const getLoans = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await (prisma as any).libraryRecord.findMany({
      orderBy: { borrowedAt: 'desc' },
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    const loans = rows.map((r: any) => ({
      id:          r.id,
      bookTitle:   r.bookTitle,
      bookIsbn:    r.bookIsbn ?? null,
      borrowerName: r.student?.name  ?? 'Unknown',
      email:        r.student?.email ?? '',
      borrowedAt:   r.borrowedAt?.toISOString().split('T')[0] ?? '',
      dueDate:      r.dueDate?.toISOString().split('T')[0]    ?? '',
      returnedAt:   r.returnedAt?.toISOString().split('T')[0] ?? null,
      status:       r.status,
      fineAmount:   r.fineAmount,
      finePaid:     r.finePaid,
    }));

    res.status(200).json({ status: 'success', loans });
  } catch (err) {
    console.error('getLoans error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load loan records' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/librarian/overdue
// ─────────────────────────────────────────────────────────────────────────────
export const getOverdueLoans = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await (prisma as any).libraryRecord.findMany({
      where:   { status: 'OVERDUE' },
      orderBy: { dueDate: 'asc' },
      include: { student: { select: { id: true, name: true, email: true } } },
    });

    const overdue = rows.map((r: any) => ({
      id:           r.id,
      bookTitle:    r.bookTitle,
      borrowerName: r.student?.name  ?? 'Unknown',
      email:        r.student?.email ?? '',
      dueDate:      r.dueDate?.toISOString().split('T')[0] ?? '',
      daysOverdue:  Math.max(0, Math.floor((Date.now() - new Date(r.dueDate).getTime()) / 86400000)),
      fineAmount:   r.fineAmount,
      finePaid:     r.finePaid,
    }));

    res.status(200).json({ status: 'success', overdue });
  } catch (err) {
    console.error('getOverdueLoans error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load overdue records' });
  }
};


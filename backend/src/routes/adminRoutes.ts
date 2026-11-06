import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { toggleUserStatus } from '../controllers/adminController.js'; // <-- Added import

const router = Router();

// Strict RBAC boundary: only ADMIN can access
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userCountsByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });

    res.status(200).json({
      status: 'success',
      role: req.user?.role,
      data: {
        systemStatus: 'Healthy',
        serverUptime: process.uptime(),
        roleDistribution: userCountsByRole,
        auditLogs: [
          { id: 1, action: 'USER_LOGIN', user: 'admin@school.edu', ip: '127.0.0.1', timestamp: new Date().toISOString() },
          { id: 2, action: 'ENROLLMENT_APPROVED', user: 'registrar@school.edu', ip: '127.0.0.1', timestamp: new Date().toISOString() },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve admin telemetry' });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', users });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch users' });
  }
});

// NEW: Toggle User Account Status Route
router.put('/users/:id/toggle-status', toggleUserStatus);

router.get('/audit', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    logs: [
      { id: 101, event: 'AUTH_SUCCESS', actor: 'admin@school.edu', role: 'ADMIN', ip: '127.0.0.1', outcome: 'GRANTED', timestamp: '2026-11-06T23:14:10Z' },
      { id: 102, event: 'RBAC_EVALUATION', actor: 'student@school.edu', role: 'STUDENT', ip: '127.0.0.1', outcome: '403_REJECTED', target: '/api/registrar/dashboard', timestamp: '2026-11-06T23:15:22Z' },
      { id: 103, event: 'CLEARANCE_SIGNOFF', actor: 'sao@school.edu', role: 'SAO', ip: '127.0.0.1', outcome: 'APPROVED', target: 'STU-4402', timestamp: '2026-11-06T23:16:01Z' },
    ],
  });
});

export default router;
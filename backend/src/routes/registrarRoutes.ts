import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    getRegistrarDashboard,
    getEnrollments,
    approveEnrollment
} from '../controllers/registrarController.js';

const router = Router();

// Strict RBAC boundary: only REGISTRAR can access these endpoints
router.use(authenticateToken);
router.use(requireRole('REGISTRAR'));

// Data routes
router.get('/dashboard', getRegistrarDashboard);
router.get('/enrollments', getEnrollments);

// Action route
router.put('/enrollments/:id/approve', approveEnrollment);

export default router;
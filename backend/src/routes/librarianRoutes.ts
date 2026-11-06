import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  getLibrarianDashboard,
  getLoans,
  getOverdueLoans,
} from '../controllers/librarianController.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('LIBRARIAN'));

router.get('/dashboard', getLibrarianDashboard);
router.get('/loans',     getLoans);
router.get('/overdue',   getOverdueLoans);

export default router;

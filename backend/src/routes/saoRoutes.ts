import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  getSaoDashboard,
  getClearances,
  getDisciplineIncidents,
} from '../controllers/saoController.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('SAO'));

router.get('/dashboard',  getSaoDashboard);
router.get('/clearances', getClearances);
router.get('/discipline', getDisciplineIncidents);

export default router;

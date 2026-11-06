import { Router } from 'express';
import {
  getStudentDashboardData,
  getStudentGrades,
  getStudentCourses,
} from '../controllers/studentController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Strict RBAC boundary: only authenticated users with the STUDENT role can access
router.use(authenticateToken);
router.use(requireRole('STUDENT'));

// GET /api/student/dashboard
router.get('/dashboard', getStudentDashboardData);

// GET /api/student/grades
router.get('/grades', getStudentGrades);

// GET /api/student/courses
router.get('/courses', getStudentCourses);

export default router;

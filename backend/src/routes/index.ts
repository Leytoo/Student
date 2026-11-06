import { Router } from 'express';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import registrarRoutes from './registrarRoutes.js';
import saoRoutes from './saoRoutes.js';
import librarianRoutes from './librarianRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// Mount individual domain route modules
router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/registrar', registrarRoutes);
router.use('/sao', saoRoutes);
router.use('/librarian', librarianRoutes);
router.use('/admin', adminRoutes);

export default router;


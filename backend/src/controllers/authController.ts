import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { JwtPayloadUser, UserRole } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Authenticates user credentials directly against PostgreSQL via Prisma.
 * Returns a signed JWT containing user ID and role upon successful verification.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required',
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query user record directly from PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Account is deactivated. Please contact an administrator.',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
      return;
    }

    const payload: JwtPayloadUser = {
      id: user.id,
      role: user.role as UserRole,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: payload,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during authentication',
    });
  }
};

/**
 * Returns current authenticated user information from the decoded JWT.
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
    return;
  }

  res.status(200).json({
    user: req.user,
  });
};

/**
 * Registers a new user account directly into PostgreSQL.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Email, password, and name are required',
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      res.status(409).json({
        error: 'Conflict',
        message: 'A user with this email address already exists',
      });
      return;
    }

    // Hash password with salt rounds = 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user to PostgreSQL casting role to UserRole
    const userRole = (role ? role.toUpperCase() : 'STUDENT') as UserRole;

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: name.trim(),
        role: userRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during user registration',
    });
  }
};

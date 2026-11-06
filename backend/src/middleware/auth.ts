import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type UserRole = 'STUDENT' | 'REGISTRAR' | 'SAO' | 'LIBRARIAN' | 'ADMIN';

export interface JwtPayloadUser {
  id: string;
  role: UserRole;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production';

/**
 * Middleware to authenticate and decode the incoming Bearer JWT.
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token missing or malformed',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
    return;
  }
};

/**
 * Middleware factory to enforce strict Role-Based Access Control (RBAC).
 * Immediately returns 403 Forbidden if the authenticated user's role does not match.
 */
export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required prior to role verification',
      });
      return;
    }

    if (!rolesArray.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
};


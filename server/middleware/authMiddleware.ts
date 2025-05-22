import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage'; // To fetch full user details if needed

// Define a custom property 'user' on Express's Request type
// This avoids TypeScript errors when trying to access req.user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string }; // Adjust based on what you store in JWT
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-for-now'; // Use same secret as in routes.ts, ideally from env

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string; iat: number; exp: number }; // Cast to expected decoded type

      // Get user from the token payload
      // You could also fetch the user from DB for freshness, but payload is often enough
      // For example: req.user = await storage.getUser(decoded.userId);
      // For now, just use the decoded payload if it contains necessary user info
      if (decoded.userId && decoded.username) {
        req.user = { id: decoded.userId, username: decoded.username };
      } else {
        // If JWT payload is not as expected
        return res.status(401).json({ message: 'Not authorized, token payload invalid' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

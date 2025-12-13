import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!);
    req.user = decoded as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
export default authMiddleware;

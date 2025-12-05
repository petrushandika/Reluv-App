import * as jwt from 'jsonwebtoken';
import {
  Injectable,
  NestMiddleware,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import CONFIG from '../../configs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!CONFIG.JWT_SECRET) {
      throw new InternalServerErrorException('JWT secret is not configured.');
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Malformed token' });
    }

    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
      res.locals.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  }
}

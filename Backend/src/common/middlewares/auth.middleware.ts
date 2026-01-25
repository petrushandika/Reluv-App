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
    const path = req.path;
    const method = req.method;

    if (
      (path.startsWith('/api/v1/auth/register') && method === 'POST') ||
      (path.startsWith('/api/v1/auth/login') && method === 'POST') ||
      (path.startsWith('/api/v1/auth/confirm') && method === 'GET') ||
      path.startsWith('/api/v1/auth/google') ||
      path.startsWith('/api/v1/auth/facebook') ||
      (path.startsWith('/api/v1/auth/forgot') && method === 'POST') ||
      (path.startsWith('/api/v1/auth/reset') && method === 'POST') ||
      (path.startsWith('/api/v1/auth/verification') && method === 'POST')
    ) {
      return next();
    }

    if (path.startsWith('/api/v1/store') && method === 'GET') {
      return next();
    }

    if (path.startsWith('/api/v1/products') && method === 'GET') {
      return next();
    }

    if (path.startsWith('/api/v1/categories') && method === 'GET') {
      return next();
    }

    if (path.match(/^\/api\/v1\/products\/\d+\/reviews$/) && method === 'GET') {
      return next();
    }

    if (
      path.startsWith('/api/v1/shipping-rates/check') ||
      path.startsWith('/api/v1/geocode/reverse') ||
      path.startsWith('/api/v1/maps/search-areas')
    ) {
      return next();
    }

    if (
      path.startsWith('/api/v1/payments/midtrans-notification') && method === 'POST' ||
      path.startsWith('/api/v1/shipments/biteship-webhook') && method === 'POST'
    ) {
      return next();
    }

    if (
      (path.startsWith('/api/v1/vouchers') ||
       path.startsWith('/api/v1/discounts') ||
       path.startsWith('/api/v1/promotions') ||
       path.startsWith('/api/v1/badges')) && method === 'GET'
    ) {
      return next();
    }

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

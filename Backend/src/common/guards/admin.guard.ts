import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return user && user.role === UserRole.ADMIN;
  }
}

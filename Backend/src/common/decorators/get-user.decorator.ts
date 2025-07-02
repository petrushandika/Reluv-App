import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

type SafeUser = Omit<User, 'password'>;

export const GetUser = createParamDecorator(
  (data: keyof SafeUser, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    const user = request.user as SafeUser;

    return data ? user?.[data] : user;
  },
);

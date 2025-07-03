import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { FacebookService } from './facebook.service';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth/facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Get()
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req: RequestWithUser) {
    return this.facebookService.login(req.user);
  }
}

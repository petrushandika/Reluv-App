import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { FacebookService } from './facebook.service';
import { ConfigService } from '@nestjs/config';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth/facebook')
export class FacebookController {
  constructor(
    private readonly facebookService: FacebookService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const { token } = this.facebookService.login(req.user);
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'https://fe-reluv-app.vercel.app';

    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
}

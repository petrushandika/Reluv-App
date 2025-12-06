import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const { token } = this.googleService.login(req.user);
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://fe-reluv-app.vercel.app';

    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
}

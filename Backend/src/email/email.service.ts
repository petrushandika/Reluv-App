import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://your-frontend-app.com/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome! Please Confirm Your Email',
      template: './verification',
      context: {
        name: user.firstName,
        url,
      },
    });
  }

  async sendPasswordReset(user: User, token: string) {
    const url = `http://your-frontend-app.com/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your Password Reset Request',
      template: './forgot-password',
      context: {
        name: user.firstName,
        url,
      },
    });
  }
}

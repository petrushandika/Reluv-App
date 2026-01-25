import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync } from 'fs';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: configService.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
        template: {
          dir: (() => {
            // Priority list of directories to check
            const possibleDirs = [
              join(process.cwd(), 'dist', 'templates'),
              join(process.cwd(), 'templates'),
              join(process.cwd(), 'src', 'templates'),
              join(__dirname, '..', 'templates'),
              join(__dirname, '..', '..', 'templates'),
            ];

            for (const dir of possibleDirs) {
              if (
                existsSync(dir) &&
                existsSync(join(dir, 'verification.hbs'))
              ) {
                return dir;
              }
            }

            // Fallback to original logic if none found
            return join(__dirname, '..', 'templates');
          })(),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { ResetDto } from './dto/reset.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, firstName, lastName } =
      registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const tokenDetails = this._createVerificationToken();

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        verificationToken: tokenDetails.hashedToken,
        verificationTokenExpiry: tokenDetails.expiry,
        profile: { create: {} },
        cart: { create: {} },
      },
    });

    await this.emailService.sendUserConfirmation(user, tokenDetails.token);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async confirm(token: string): Promise<{ message: string }> {
    if (!token || token.trim().length === 0) {
      throw new UnauthorizedException('Token is required.');
    }

    const user = await this._validateAndFindUserByToken(token);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return { message: 'Email successfully verified.' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async forgot(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        message:
          'If a user with that email exists, a password reset link has been sent.',
      };
    }

    const tokenDetails = this._createVerificationToken();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: tokenDetails.hashedToken,
        verificationTokenExpiry: tokenDetails.expiry,
      },
    });

    await this.emailService.sendPasswordReset(user, tokenDetails.token);

    return {
      message:
        'If a user with that email exists, a password reset link has been sent.',
    };
  }

  async reset(resetDto: ResetDto) {
    const { token, newPassword, confirmNewPassword } = resetDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this._validateAndFindUserByToken(token);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return { message: 'Password has been reset successfully.' };
  }

  private _createVerificationToken() {
    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    return { token, hashedToken, expiry };
  }

  private async _validateAndFindUserByToken(token: string): Promise<User> {
    if (!token || token.trim().length === 0) {
      throw new UnauthorizedException('Token is required.');
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      const expiredUser = await this.prisma.user.findFirst({
        where: {
          verificationToken: hashedToken,
        },
      });

      if (expiredUser) {
        throw new UnauthorizedException(
          'Token has expired. Please request a new verification email.',
        );
      }

      throw new UnauthorizedException('Token is invalid.');
    }

    return user;
  }
}

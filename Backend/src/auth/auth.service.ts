import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';

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
      throw new ConflictException('Password and confirm password do not match');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = randomBytes(32).toString('hex');
    const hashedVerificationToken = createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        verificationToken: hashedVerificationToken,
        verificationTokenExpiry,
        profile: { create: {} },
        cart: { create: {} },
      },
    });

    await this.emailService.sendUserConfirmation(user, verificationToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async confirm(token: string): Promise<{ message: string }> {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token is invalid or has expired.');
    }

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
      throw new NotFoundException('User not found');
    }

    const resetToken = randomBytes(32).toString('hex');
    const verificationToken = createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { message: 'Password reset link has been sent to your email.' };
  }

  async reset(token: string, newPassword: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token is invalid or has expired');
    }

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
}

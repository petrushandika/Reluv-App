import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Res,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { VerificationDto } from './dto/verification.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists',
  })
  register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('confirm')
  @ApiOperation({ summary: 'Confirm email verification' })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Email verification token',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to frontend with verification status',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid or expired token',
  })
  async confirm(
    @Query(new ValidationPipe()) query: ConfirmDto,
    @Res() res: Response,
  ) {
    let frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://fe-reluv-app.vercel.app';

    frontendUrl = frontendUrl.replace(/\/$/, '');

    try {
      await this.authService.confirm(query.token);
      return res.redirect(`${frontendUrl}/login?verified=true`);
    } catch (error) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          error.message || 'Token is invalid or has expired.',
        )}`,
      );
    }
  }

  @Post('forgot')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Email not found',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Rate limit exceeded',
  })
  forgot(@Body(new ValidationPipe()) forgotDto: ForgotDto) {
    return this.authService.forgot(forgotDto.email);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid or expired token',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Rate limit exceeded',
  })
  reset(@Body(new ValidationPipe()) resetDto: ResetDto) {
    return this.authService.reset(resetDto);
  }

  @Post('verification')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({ type: VerificationDto })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Email not found',
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Rate limit exceeded',
  })
  verification(@Body(new ValidationPipe()) verificationDto: VerificationDto) {
    return this.authService.verification(verificationDto.email);
  }
}

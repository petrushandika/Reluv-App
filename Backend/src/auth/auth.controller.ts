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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('confirm')
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
  forgot(@Body(new ValidationPipe()) forgotDto: ForgotDto) {
    return this.authService.forgot(forgotDto.email);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  reset(@Body(new ValidationPipe()) resetDto: ResetDto) {
    return this.authService.reset(resetDto);
  }

  @Post('verification')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  verification(
    @Body(new ValidationPipe()) verificationDto: VerificationDto,
  ) {
    return this.authService.verification(verificationDto.email);
  }
}

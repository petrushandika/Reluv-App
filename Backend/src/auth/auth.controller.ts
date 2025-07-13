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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { ConfirmDto } from './dto/confirm.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
    await this.authService.confirm(query.token);
    return res.redirect('http://localhost:3000/');
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgot(@Body(new ValidationPipe()) forgotDto: ForgotDto) {
    return this.authService.forgot(forgotDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  reset(@Body(new ValidationPipe()) resetDto: ResetDto) {
    return this.authService.reset(resetDto.token, resetDto.newPassword);
  }
}

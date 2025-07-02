import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot')
  @HttpCode(HttpStatus.OK)
  forgot(@Body() forgotDto: ForgotDto) {
    return this.authService.forgot(forgotDto.email);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  reset(@Body() resetDto: ResetDto) {
    return this.authService.reset(resetDto.token, resetDto.newPassword);
  }
}

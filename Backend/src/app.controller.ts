import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  getHello() {
    return {
      message: 'Welcome to Reluv API',
      version: '1.0.0',
      status: 'running',
    };
  }
}

import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @HttpCode(HttpStatus.OK)
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  getSettings() {
    return this.adminService.getSettings();
  }
}

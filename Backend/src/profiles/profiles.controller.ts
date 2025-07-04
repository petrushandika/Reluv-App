import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  getProfile(@GetUser() user: User) {
    return this.profilesService.getProfile(user.id);
  }

  @Patch('me')
  updateProfile(
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(user.id, updateProfileDto);
  }
}

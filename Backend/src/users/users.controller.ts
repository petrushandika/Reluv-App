import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findMe(@GetUser() user: User) {
    return this.usersService.findMe(user.id);
  }

  @Patch('me')
  updateMe(
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateMe(user.id, updateUserDto);
  }

  @Patch('me/profile')
  updateMyProfile(
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.usersService.updateMyProfile(user.id, updateUserProfileDto);
  }
}

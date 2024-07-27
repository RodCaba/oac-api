import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from 'src/users/dto/create-user.dto';
import { SignupResponseDto } from 'src/auth/dto/signup.dto';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() payload: CreateAdminDto,
  ): Promise<SignupResponseDto | null> {
    return await this.authService.signUp(payload);
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  async signIn(@Req() req: Request) {
    return req.user;
  }
}

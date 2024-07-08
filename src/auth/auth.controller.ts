import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignupResponseDto } from 'src/auth/dto/signup.dto';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() payload: CreateUserDto,
  ): Promise<SignupResponseDto | null> {
    return await this.authService.signUp(payload);
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.validateUser(email, password);
  }
}

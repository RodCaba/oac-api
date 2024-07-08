import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupResponseDto } from 'src/auth/dto/signup.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private saltRounds = 15;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(payload: CreateUserDto): Promise<SignupResponseDto | null> {
    const hashedPassword = await bcrypt.hash(payload.password, this.saltRounds);
    const data = { ...payload, password: hashedPassword };
    const user = await this.usersService.create(data);

    return {
      success: true,
      message: 'User created successfully',
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) return null;

    const payload = { sub: user._id, email: user.email };

    return await this.jwtService.signAsync(payload);
  }
}

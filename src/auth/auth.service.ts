import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupResponseDto } from 'src/auth/dto/signup.dto';
import { CreateAdminDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Roles } from './enums/roles';

@Injectable()
export class AuthService {
  private saltRounds = 15;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(payload: CreateAdminDto): Promise<SignupResponseDto | null> {
    const hashedPassword = await bcrypt.hash(payload.password, this.saltRounds);
    const data = { ...payload, password: hashedPassword, roles: [Roles.ADMIN] };
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
    const user = await this.usersService.findByEmailIncludePass(email);

    if (!user || !user.password) return null;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) return null;

    const payload = { sub: user._id, email: user.email, roles: user.roles };

    return await this.jwtService.signAsync(payload);
  }
}

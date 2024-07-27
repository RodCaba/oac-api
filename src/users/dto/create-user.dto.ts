import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CreateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isManager: boolean;

  @IsString()
  projectId: string;
}

export class CreateUserWithTokenDto extends CreateUserDto {
  @IsString()
  signupToken: string;
}

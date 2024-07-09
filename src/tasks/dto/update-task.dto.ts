import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  @IsEnum([Status.OPEN, Status.IN_PROGRESS, Status.DONE])
  status: string;

  @IsString()
  @IsOptional()
  assignedUser: string;
}

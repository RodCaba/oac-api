import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum([Status.OPEN, Status.IN_PROGRESS, Status.DONE])
  @IsOptional()
  status: string;

  @IsString()
  project: string;

  @IsString()
  assignedUser: string;
}

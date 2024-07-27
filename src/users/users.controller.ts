import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { MongoExceptionFilter } from 'src/utils/mongo-exception.filter';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Request } from 'express';
import { SessionDto } from 'src/auth/dto/session.dto';

@UseGuards(JwtGuard, ACGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseRoles({
    resource: 'users',
    action: 'create',
    possession: 'any',
  })
  @Post()
  @UseFilters(MongoExceptionFilter)
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(user);
  }

  @UseRoles({
    resource: 'users',
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findOwn(@Req() req: Request): Promise<User | null> {
    const requestUser = req.user as SessionDto;
    return await this.usersService.findOne(
      requestUser.id as unknown as ObjectId,
    );
  }
}

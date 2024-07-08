import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { MongoExceptionFilter } from 'src/utils/mongo-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.create(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: ObjectId): Promise<User | null> {
    return await this.usersService.findOne(id);
  }
}

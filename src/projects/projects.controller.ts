import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MongoExceptionFilter } from 'src/utils/mongo-exception.filter';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './schemas/project.schema';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { SessionDto } from 'src/auth/dto/session.dto';
import { ACGuard, UseRoles } from 'nest-access-control';

@UseGuards(JwtGuard, ACGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @UseRoles({
    resource: 'projects',
    action: 'create',
    possession: 'any',
  })
  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() project: CreateProjectDto): Promise<Project> {
    return await this.projectsService.create(project);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project | null> {
    return await this.projectsService.findOne(id);
  }

  @Get()
  async findProjectsByOwner(@Req() req: Request): Promise<Project[]> {
    const requestUser = req.user as SessionDto;
    return await this.projectsService.findProjectsByOwner(requestUser.id);
  }
}

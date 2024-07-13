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
import { Roles } from 'src/auth/enums/roles';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { User } from 'src/users/schemas/user.schema';

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
  async create(
    @Body() project: CreateProjectDto,
    @Req() req: Request,
  ): Promise<Project> {
    const requestUser = req.user as SessionDto;
    return await this.projectsService.create(project, requestUser.id);
  }

  @UseRoles({
    resource: 'projects',
    action: 'read',
    possession: 'own',
  })
  @UseGuards(ProjectMemberGuard)
  @Get(':projectId')
  async findOne(@Param('projectId') id: string): Promise<Project | null> {
    return await this.projectsService.findOne(id);
  }

  @UseRoles({
    resource: 'projects',
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAll(@Req() req: Request): Promise<Project[]> {
    const requestUser = req.user as SessionDto;

    if (requestUser.roles.includes(Roles.ADMIN)) {
      return await this.projectsService.findProjectsByOwner(requestUser.id);
    }

    return await this.projectsService.findAssignedProjects(requestUser.id);
  }

  @Get(':projectId/members')
  async findMembers(@Param('projectId') id: string): Promise<User[]> {
    return await this.projectsService.findMembers(id);
  }

  @UseRoles({
    resource: 'projects',
    action: 'update',
    possession: 'own',
  })
  @UseGuards(ProjectMemberGuard)
  @Post(':projectId/members')
  async addMember(
    @Param('projectId') id: string,
    @Body() member: { userId: string },
  ) {
    return await this.projectsService.addMember(id, member.userId);
  }
}

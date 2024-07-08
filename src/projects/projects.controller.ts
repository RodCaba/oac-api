import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MongoExceptionFilter } from 'src/utils/mongo-exception.filter';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './schemas/project.schema';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() project: CreateProjectDto): Promise<Project> {
    return await this.projectsService.create(project);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project | null> {
    return await this.projectsService.findOne(id);
  }

  @Get('owner/:ownerId')
  async findProjectsByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<Project[]> {
    return await this.projectsService.findProjectsByOwner(ownerId);
  }
}

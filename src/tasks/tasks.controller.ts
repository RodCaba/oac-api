import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ACGuard, UseRoles } from 'nest-access-control';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './schemas/task.schema';
import { TasksService } from './tasks.service';
import { SessionDto } from 'src/auth/dto/session.dto';
import { Request } from 'express';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectMemberGuard } from 'src/projects/guards/project-member.guard';

@UseGuards(JwtGuard, ACGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseRoles({
    resource: 'tasks',
    action: 'create',
    possession: 'any',
  })
  @UseGuards(ProjectMemberGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.create(createTaskDto);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'update',
    possession: 'own',
  })
  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'own',
  })
  @Get()
  async findAssignedTasks(@Req() req: Request): Promise<Task[]> {
    const requestUser = req.user as SessionDto;
    return await this.tasksService.findAssignedTasks(requestUser.id);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'own',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task | null> {
    return await this.tasksService.findOne(id);
  }

  @UseRoles({
    resource: 'tasks',
    action: 'read',
    possession: 'any',
  })
  @UseGuards(ProjectMemberGuard)
  @Get('/project/:projectId')
  async findTasksByProject(
    @Param('projectId') projectId: string,
  ): Promise<Task[]> {
    return await this.tasksService.findTasksByProject(projectId);
  }
}

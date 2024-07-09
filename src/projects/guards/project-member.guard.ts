import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectsService } from '../projects.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private projectsService: ProjectsService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    return true;
  }
}

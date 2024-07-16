import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isMember = this.projectsService
      .isMember(request.user.id, request.headers['project-id'])
      .then((isMember) => {
        if (!isMember) {
          return false;
        } else {
          return true;
        }
      });
    return isMember;
  }
}

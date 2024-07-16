import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class ProjectResourceMiddleware implements NestMiddleware {
  constructor(private tasksService: TasksService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const taskId = req.params.taskId || undefined;
    this.tasksService
      .findOne(taskId)
      .then((task) => {
        req.headers['project-id'] = task.project as unknown as string;
        next();
      })
      .catch((err) => {
        next(err);
      });
  }
}

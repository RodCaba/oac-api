import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ProjectParamMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestProjectId =
      req.body.project || req.params.projectId || undefined;

    if (requestProjectId) {
      req.headers['project-id'] = requestProjectId;
    }

    next();
  }
}

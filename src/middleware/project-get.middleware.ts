import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ProjectGetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestProjectId = req.params.id;

    req.headers['project-id'] = requestProjectId;
    next();
  }
}

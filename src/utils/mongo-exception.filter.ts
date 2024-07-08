import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongoose/node_modules/mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    switch (exception.code) {
      case 11000:
        return response.status(409).json({
          statusCode: 409,
          message: 'Duplicate key',
        });
      default:
        return response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
        });
    }
  }
}

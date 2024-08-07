import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from 'nest-access-control';
import { RBAC_POLICY } from './auth/rbac-policy';
import { TasksModule } from './tasks/tasks.module';
import { ProjectParamMiddleware } from './middleware/project-param.middleware';
import { ProjectResourceMiddleware } from './middleware/project-resource.middleware';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_HOST'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    AccessControlModule.forRoles(RBAC_POLICY),
    UsersModule,
    ProjectsModule,
    AuthModule,
    TasksModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjectParamMiddleware).forRoutes('projects/:projectId');
    consumer
      .apply(ProjectParamMiddleware)
      .forRoutes(
        { path: 'tasks/', method: RequestMethod.POST },
        'tasks/project/:projectId',
      );

    consumer
      .apply(ProjectResourceMiddleware)
      .exclude('tasks/project/:projectId')
      .forRoutes('tasks/:taskId');
  }
}

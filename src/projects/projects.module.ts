import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import {
  ProjectMember,
  ProjectMemberSchema,
} from './schemas/project-member.schema';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectMember.name, schema: ProjectMemberSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersModule],
})
export class ProjectsModule {}

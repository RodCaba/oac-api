import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMember } from './schemas/project-member.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<Project>,
    @InjectModel(ProjectMember.name)
    private projectMemberModel: Model<ProjectMember>,
  ) {}

  create(
    createProjectDto: CreateProjectDto,
    ownerId: string,
  ): Promise<Project> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      owner: ownerId,
    });

    new this.projectMemberModel({
      user: ownerId,
      project: createdProject._id,
    }).save();

    if (createProjectDto.members && createProjectDto.members.length > 0) {
      for (const member of createProjectDto.members) {
        new this.projectMemberModel({
          user: member,
          project: createdProject._id,
        }).save();
      }
    }

    return createdProject.save();
  }

  findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  async findAssignedProjects(assignedUserId: string): Promise<Project[]> {
    const projectMembers = await this.projectMemberModel.find({
      user: assignedUserId,
    });
    const projects = projectMembers.map(async (member) => {
      return await this.projectModel.findById(member.project).exec();
    });

    return Promise.all(projects);
  }

  findProjectsByOwner(ownerId: string): Promise<Project[]> {
    return this.projectModel.find({ owner: ownerId }).exec();
  }

  addMember(projectId: string, userId: string): Promise<ProjectMember> {
    return new this.projectMemberModel({
      user: userId,
      project: projectId,
    }).save();
  }

  async isMember(userId: string, projectId: string): Promise<boolean> {
    const member = await this.projectMemberModel
      .findOne({
        user: userId,
        project: projectId,
      })
      .exec();
    return member ? Promise.resolve(true) : Promise.resolve(false);
  }
}

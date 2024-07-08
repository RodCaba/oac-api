import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  findProjectsByOwner(ownerId: string): Promise<Project[]> {
    return this.projectModel.find({ owner: ownerId }).exec();
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ProjectMemberDocument = HydratedDocument<ProjectMember>;

@Schema()
export class ProjectMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: string;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);

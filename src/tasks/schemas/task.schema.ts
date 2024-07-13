import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Status } from '../enums/status';
import { Project } from 'src/projects/schemas/project.schema';
import { User } from 'src/users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  dueDate: Date;

  @Prop({
    type: String,
    enum: [Status.OPEN, Status.IN_PROGRESS, Status.DONE],
    default: Status.OPEN,
    index: true,
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true })
  project: Project;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  assignedUser: User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

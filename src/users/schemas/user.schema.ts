import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Roles } from 'src/auth/enums/roles';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [String], default: [Roles.USER] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

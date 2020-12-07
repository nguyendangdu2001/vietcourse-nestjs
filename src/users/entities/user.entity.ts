import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Course } from 'src/courses/entities/course.entity';
import { UserRole } from './userRole';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class GoogleInfo {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;
}
const GoogleInfoSchema = SchemaFactory.createForClass(GoogleInfo);

@Schema({ _id: false })
export class FacebookInfo {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;
}
const FacebookInfoSchema = SchemaFactory.createForClass(FacebookInfo);

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  userName: string;

  @Prop()
  password?: string;

  @Prop({ type: [String], enum: Object.values(UserRole), default: 'user' })
  roles?: UserRole[];

  @Prop()
  userPic: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Course.name }])
  cart?: MongooseSchema.Types.ObjectId[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Course.name }])
  ownCourses?: MongooseSchema.Types.ObjectId[];

  @Prop({ type: GoogleInfoSchema })
  google?: GoogleInfo;

  @Prop({ type: FacebookInfoSchema })
  facebook?: FacebookInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ _id: false })
class Chapter {
  @Prop()
  name: string;

  @Prop()
  time: string;
}
const chapterSchema = SchemaFactory.createForClass(Chapter);

@Schema({ _id: false })
class CourseDetail {
  @Prop()
  title: string;

  @Prop()
  totalTime: string;

  @Prop([{ type: chapterSchema }])
  chapter: Chapter[];
}
const courseDetailSchema = SchemaFactory.createForClass(CourseDetail);

@Schema()
export class Course extends Document {
  @Prop()
  title: string;

  @Prop()
  subject: string;

  @Prop()
  university: string;

  @Prop()
  price: number;

  @Prop()
  rating: number;

  @Prop()
  lecture: string;

  @Prop({ type: Date, default: Date.now() })
  lastModified: Date;

  @Prop()
  numOfStudent: string;

  @Prop([{ type: courseDetailSchema }])
  detail: CourseDetail[];

  @Prop()
  pic: string;
}
export const courseSchema = SchemaFactory.createForClass(Course);

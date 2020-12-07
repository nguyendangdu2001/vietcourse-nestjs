import { Schema } from 'mongoose';

export class FindAllCourseDto {
  page: number;
  skip: number;
  limit: number;
  key: string;
  linhvuc: string;
  userOwnedCourse?: Schema.Types.ObjectId[];
  short?: number;
}

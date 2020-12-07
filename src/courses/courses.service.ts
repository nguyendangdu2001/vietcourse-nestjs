import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { FindAllCourseDto } from './dto/find-all-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    try {
      const newCourse = await this.courseModel.create(createCourseDto);
      return newCourse;
    } catch (error) {}

    return 'This action adds a new course';
  }

  async findAll(findAllCourseDto: FindAllCourseDto) {
    //{ _id: { $nin: listOwncourse } } need to implement this
    const {
      limit,
      page,
      skip,
      key,
      linhvuc,
      userOwnedCourse = [],
      short,
    } = findAllCourseDto;

    try {
      const searchQuery = [
        { $match: { _id: { $nin: userOwnedCourse } } },
        { $match: { subject: { $regex: linhvuc, $options: 'i' } } },
        {
          $match: {
            $or: [
              { title: { $regex: key, $options: 'i' } },
              { lecture: { $regex: key, $options: 'i' } },
              { university: { $regex: key, $options: 'i' } },
            ],
          },
        },
      ];
      const projectResult = short
        ? [{ $project: { _id: 1, title: 1, university: 1, pic: 1 } }]
        : [];
      const listCourse = await this.courseModel
        .aggregate()
        .facet({
          results: [
            ...searchQuery,
            { $skip: skip * (page - 1) },
            { $limit: limit },
            ...projectResult,
          ],
          count: [
            ...searchQuery,
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { count: 1 } },
          ],
        })
        .exec();
      return listCourse[0];
    } catch (error) {
      console.log(error);

      throw new NotFoundException();
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.courseModel.findById(id).exec();
      return course;
    } catch (error) {}
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const newCourse = await this.courseModel.findByIdAndUpdate(
        id,
        updateCourseDto,
        {
          new: true,
          useFindAndModify: false,
        },
      );
      return newCourse;
    } catch (error) {}
  }

  async remove(id: string) {
    try {
      await this.courseModel.deleteOne({ _id: id });
      return;
    } catch (error) {}
  }

  async fastFind(key: string) {
    try {
      const courses = await this.courseModel.find(
        {
          $or: [
            { title: { $regex: key, $options: 'i' } },
            { lecture: { $regex: key, $options: 'i' } },
            { university: { $regex: key, $options: 'i' } },
          ],
        },
        { university: 1, pic: 1, title: 1 },
        { limit: 5 },
      );
      return courses;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}

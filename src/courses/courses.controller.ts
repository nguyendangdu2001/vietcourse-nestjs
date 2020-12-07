import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Public, User } from 'src/common/decorators';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.create(createCourseDto);
  }

  @Public()
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('skip', new DefaultValuePipe(20), ParseIntPipe) skip: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('key', new DefaultValuePipe('')) key: string,
    @Query('linhvuc', new DefaultValuePipe('')) linhvuc: string,
    @Query('short', new DefaultValuePipe(0), ParseIntPipe) short: number,
    @User() user: UserEntity,
  ) {
    const map = {
      mythuat: 'Mỹ thuật',
      cntt: 'Công nghệ thông tin',
      amnhac: 'Âm nhạc',
      nhiepanh: 'Nhiếp ảnh',
      kinhdoanh: 'Kinh doanh',
    };
    return await this.coursesService.findAll({
      page,
      skip,
      limit,
      key,
      linhvuc: map[linhvuc] || '',
      userOwnedCourse: user?.ownCourses,
      short,
    });
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.coursesService.findOne(id);
  }

  @Public()
  @Get('search/:key')
  async search(@Param('key') key: string) {
    return await this.coursesService.fastFind(key);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
}

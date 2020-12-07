import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { DeleteCartItemDto } from './dto/delete-cart-item.dto';
import { BuyCourseDto } from './dto/buy-course.dto';
import { User } from 'src/common/decorators';
import { User as UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('/profile')
  getGlobalyProfile(@User() user: UserEntity) {
    if (user) return user;
    throw new UnauthorizedException();
  }
  @Get('/id/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Get('/cart')
  async findCart(@User() user: UserEntity) {
    return await this.usersService.findCart(user._id);
  }

  @Put('/cart')
  async addCartItem(
    @User() user: UserEntity,
    @Body() addCartItemDto: AddCartItemDto,
  ) {
    return await this.usersService.addCartItem(user._id, addCartItemDto);
  }

  @Delete('/cart')
  async deleteCartItem(
    @User() user: UserEntity,
    @Body() deleteCartItemDto: DeleteCartItemDto,
  ) {
    return await this.usersService.deleteCartItem(user._id, deleteCartItemDto);
  }

  @Post('/buy')
  async buyCourses(
    @User() user: UserEntity,
    @Body() buyCourseDto: BuyCourseDto,
  ) {
    return await this.usersService.buyCourse(user._id, buyCourseDto);
  }
}

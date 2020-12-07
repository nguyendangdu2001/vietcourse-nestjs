import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SchemaTypes, Types } from 'mongoose';
import { Profile } from 'passport-facebook-token';
import { GoogleProfile } from 'src/auth/interface/GoogleProfile.interface';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { BuyCourseDto } from './dto/buy-course.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteCartItemDto } from './dto/delete-cart-item.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.userModel.find({}, {}, { limit: 20 });
    return users;
  }

  async findOneById(id: string) {
    const user = await this.findOne({ _id: id });

    return user;
  }

  async findOne(findOneUserDto: FindOneUserDto) {
    try {
      console.log(findOneUserDto);

      const user = await this.userModel.findOne(findOneUserDto).exec();
      return user;
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async findOrCreateFacebookUser(facebookProfile: Profile) {
    try {
      const user = await this.findOne({ 'facebook.id': facebookProfile.id });
      if (user) {
        return user;
      } else {
        const newUser = await this.userModel.create({
          userName: 'facebook' + facebookProfile.emails[0].value,
          name: facebookProfile.displayName,
          userPic: facebookProfile.photos[0].value,
          facebook: {
            id: facebookProfile.id,
            name: facebookProfile.displayName,
            email: facebookProfile.emails[0].value,
          },
        });
        return newUser;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async findOrCreateGoogleUser(googleId: string, googleProfile: GoogleProfile) {
    console.log('go here');
    try {
      const user = await this.findOne({ 'google.id': googleId });
      console.log(user);

      if (user) {
        return user;
      } else {
        const newUser = await this.userModel.create({
          userName: 'google' + googleProfile.payload.email,
          name: googleProfile.payload.name,
          userPic: googleProfile.payload.picture,
          google: {
            id: googleId,
            name: googleProfile.payload.name,
            email: googleProfile.payload.email,
          },
        });
        return newUser;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async findCart(id: string) {
    try {
      const { cart } = await this.userModel
        .findById(id, { cart: 1 })
        .populate('cart');
      return cart;
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async addCartItem(id: string, addCartItemDto: AddCartItemDto) {
    const { courseId } = addCartItemDto;
    try {
      const { cart } = await this.userModel
        .findByIdAndUpdate(
          id,
          {
            //@ts-ignore
            $addToSet: { cart: new Types.ObjectId(courseId) },
          },
          { new: true, useFindAndModify: false, select: { cart: 1 } },
        )
        .exec();
      return cart;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async deleteCartItem(id: string, deleteCartItemDto: DeleteCartItemDto) {
    const { courseId } = deleteCartItemDto;
    try {
      const { cart } = await this.userModel
        .findByIdAndUpdate(
          id,
          //@ts-ignore
          { $pull: { cart: Types.ObjectId(courseId) } },
          { new: true, useFindAndModify: false, select: { cart: 1 } },
        )
        .exec();
      return cart;
    } catch (error) {}
  }

  async buyCourse(id: string, buyCourseDto: BuyCourseDto) {
    const { courses } = buyCourseDto;
    const coursesIdObject = courses.map(
      (course) => new SchemaTypes.ObjectId(course),
    );
    try {
      await this.userModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { ownCourses: { $each: coursesIdObject } },
          $set: { cart: [] },
        },
        { useFindAndModify: false },
      );
      return;
    } catch (error) {}
  }
}

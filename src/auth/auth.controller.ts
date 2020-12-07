import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public, User } from 'src/common/decorators';
import { FacebookGuard, GoogleGuard } from 'src/common/guards';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @HttpCode(204)
  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session = null;
    req.logout();
    res.clearCookie('nest-server-cookie');
    res.send('');
  }

  @Public()
  @UseGuards(FacebookGuard)
  @Post('/facebook')
  async facebookLogin(@User() user: UserEntity) {
    return user;
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Post('/google')
  async googleLogin(@User() user: UserEntity) {
    return user;
  }
}

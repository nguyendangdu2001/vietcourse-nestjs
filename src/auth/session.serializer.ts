import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(
    user: User,
    done: (err: Error | null, user: string) => void,
  ): void {
    console.log('serialize', user);

    done(null, user._id);
  }

  async deserializeUser(
    id: string,
    done: (err: Error | null, payload?: User) => void,
  ) {
    try {
      const user = await this.userService.findOneById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}

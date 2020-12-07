import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile } from 'passport-facebook-token';
import { UsersService } from 'src/users/users.service';
import { GoogleProfile } from './interface/GoogleProfile.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateFacebookUser(profile: Profile) {
    try {
      const user = await this.userService.findOrCreateFacebookUser(profile);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async validateGoogleUser(googleId: string, profile: GoogleProfile) {
    try {
      console.log('validate');

      const user = await this.userService.findOrCreateGoogleUser(
        googleId,
        profile,
      );
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

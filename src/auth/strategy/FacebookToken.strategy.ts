import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import FacebookTokenStrategy, { Profile } from 'passport-facebook-token';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  FacebookTokenStrategy,
  'facebook-token',
) {
  constructor(private authService: AuthService) {
    super({
      clientID: ' 300653421124122',
      clientSecret: 'f11c31c79a45ec80d7770225689cd9f4',
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const user = await this.authService.validateFacebookUser(profile);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}

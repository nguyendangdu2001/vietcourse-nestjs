import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import GoogleIdTokenStrategy from 'passport-google-id-token';
import { AuthService } from '../auth.service';
import { GoogleProfile } from '../interface/GoogleProfile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleIdTokenStrategy,
  'google-id-token',
) {
  constructor(private authService: AuthService) {
    super({
      clientID:
        '893158145715-o5ao56bgfu2ol8gido4t4gn71tlecevn.apps.googleusercontent.com',
      clientSecret: '2D49mNZ5bKmjliF3brHlS2if',
    });
  }
  async validate(
    profile: GoogleProfile,
    googleId: string,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      console.log('in google');
      const user = await this.authService.validateGoogleUser(googleId, profile);

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}

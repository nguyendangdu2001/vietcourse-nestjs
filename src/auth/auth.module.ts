import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './strategy/FacebookToken.strategy';
import { SessionSerializer } from './session.serializer';
import { GoogleStrategy } from './strategy/GoogleToken.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, FacebookStrategy, GoogleStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}

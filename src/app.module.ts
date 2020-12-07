import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './common/guards';

const dburl =
  'mongodb+srv://nguyendangdu2001:yasuo123@cluster0.hhly3.mongodb.net/Bwd2020?retryWrites=true&w=majority';
@Module({
  imports: [
    MongooseModule.forRoot(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    BillModule,
    UsersModule,
    CoursesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthenticatedGuard }],
})
export class AppModule {}

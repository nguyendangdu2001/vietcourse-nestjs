import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieSession from 'cookie-session';
import passport from 'passport';
import helmet from 'helmet';
import compression from 'compression';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('/api');
  app.use(
    cookieSession({
      name: 'nest-server-cookie',
      keys: ['dffdfdfdf', 'dsdss'],
      sameSite: 'lax',
      httpOnly: true,
    }),
  );
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
  // app.use(function (req, res, next) {
  //   var token = req.csrfToken();
  //   res.cookie('XSRF-TOKEN', token);
  //   res.locals.csrfToken = token;
  //   next();
  // });

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}
bootstrap();

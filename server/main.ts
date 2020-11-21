import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NextModule } from '@nestpress/next';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

(async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  server.enableCors();
  server.use(helmet());
  server.use(cookieParser());
  server.use(csurf({
    cookie: {
      key: 'XSRF_KEY',
      httpOnly: true,
      path: '/',
      secure: process.env.DEVELOPMENT !== 'development',
      sameSite: true,
    }
  }));
  server.use((req: Request, res: Response, next: NextFunction) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
  });
  server.useGlobalPipes(new ValidationPipe());
  server
    .get(NextModule)
    .prepare()
    .then(() => server.listen(process.env.PORT || 3000))
    .then(() => () => console.log('Nest is running on port 3000'))
    .catch(error => console.log(error));
})();

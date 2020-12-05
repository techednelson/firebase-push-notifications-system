import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NextModule } from '@nestpress/next';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "./common/config/serviceAccountKey.json";


(async function bootstrap() {
  const server = await NestFactory.create(AppModule);
    // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: 'https://fcm-notifications-system.firebaseio.com',
  });
  server.enableCors();
  // server.use(helmet());
  server.use(cookieParser());
  // server.use(
  //   csurf({
  //     cookie: {
  //       key: 'XSRF_KEY',
  //       httpOnly: true,
  //       path: '/',
  //       secure: process.env.DEVELOPMENT !== 'development',
  //       sameSite: true,
  //     },
  //   }),
  // );
  // server.use((req: Request, res: Response, next: NextFunction) => {
  //   res.cookie('XSRF-TOKEN', req.csrfToken());
  //   res.locals.csrftoken = req.csrfToken();
  //   next();
  // });
  server.useGlobalPipes(new ValidationPipe());
  server
    .get(NextModule)
    .prepare()
    .then(() => server.listen(process.env.PORT || 3000))
    .then(() => () => console.log('Nest is running on port 3000'))
    .catch(error => console.log(error));
})();

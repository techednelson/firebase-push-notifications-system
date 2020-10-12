import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmAdminClientController } from './fcm-admin-client/fcm-admin-client.controller';
import { NextMiddleware, NextModule } from '@nestpress/next';
import { typeOrmPostgresConfig } from './common/config/typeorm.config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { FcmAdminServerController } from './fcm-admin-server/fcm-admin-server.controller';
import { FcmAdminServerService } from './fcm-admin-server/fcm-admin-server.service';
import { User } from './common/entities/user.entity';
import { Notification } from './common/entities/notification.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { FcmAdminServerModule } from './fcm-admin-server/fcm-admin-server.module';
import { FcmAdminClientModule } from './fcm-admin-client/fcm-admin-client.module';

const rootUser = {
  username: '',
  password: '',
};

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forRoot(typeOrmPostgresConfig),
    TypeOrmModule.forFeature([User, Notification]),
    NextModule,
    AuthModule,
    FcmAdminClientModule,
    FcmAdminServerModule,
  ],
  controllers: [
    AuthController,
    FcmAdminClientController,
    FcmAdminServerController,
  ],
  providers: [AuthService, FcmAdminServerService],
})
export class AppModule implements NestModule {
  constructor(private readonly authService: AuthService) {
    this.createRootUser();
  }

  private createRootUser(): void {
    this.authService
      .createRootUser(rootUser)
      .then(message => console.log(message))
      .catch(() => console.log('there was a problem creating root user'));
  }

  configure(consumer: MiddlewareConsumer) {
    // handle scripts
    consumer.apply(NextMiddleware).forRoutes({
      path: '_next*',
      method: RequestMethod.GET,
    });

    // handle other assets
    consumer.apply(NextMiddleware).forRoutes({
      path: 'images/*',
      method: RequestMethod.GET,
    });

    consumer.apply(NextMiddleware).forRoutes({
      path: 'favicon.ico',
      method: RequestMethod.GET,
    });
  }
}

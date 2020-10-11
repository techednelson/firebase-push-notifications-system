import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmAdminClientController } from './controllers/fcm-admin-client.controller';
import { NextMiddleware, NextModule } from '@nestpress/next';
import { typeOrmPostgresConfig } from './config/typeorm.config';
import { AuthService } from './services/auth.service';
import rootUser from '../server/config/root-user';
import { AuthController } from './controllers/auth.controller';
import { FcmAdminServerController } from './controllers/fcm-admin-server.controller';
import { FcmAdminServerService } from './services/fcm-admin-server.service';
import { User } from './common/entities/user.entity';
import { Message } from './common/entities/message.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      }
    }),
    TypeOrmModule.forRoot(typeOrmPostgresConfig),
    TypeOrmModule.forFeature([User, Message]),
    NextModule
  ],
  controllers: [
    AuthController,
    FcmAdminClientController,
    FcmAdminServerController,
  ],
  providers: [AuthService, FcmAdminServerService],
})
export class AppModule implements NestModule {
  constructor(
    private readonly authService: AuthService
  ) {
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

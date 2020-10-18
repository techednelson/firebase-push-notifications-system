import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextMiddleware, NextModule } from '@nestpress/next';
import { typeOrmPostgresConfig } from './common/config/typeorm.config';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { FcmAdminServerModule } from './fcm-admin-server/fcm-admin-server.module';
import { User } from './common/entities/user.entity';
import { FcmAdminClientController } from './fcm-admin-client.controller';

const rootUser = {
  username: '',
  password: '',
};

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmPostgresConfig),
    TypeOrmModule.forFeature([User]),
    NextModule,
    AuthModule,
    FcmAdminServerModule,
  ],
  controllers: [FcmAdminClientController],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly authService: AuthService) {
    this.createRootUser();
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
  
  private createRootUser(): void {
    this.authService
      .createRootUser(rootUser)
      .then(message => console.log(message))
      .catch(() => console.log('there was a problem creating root user'));
  }
}

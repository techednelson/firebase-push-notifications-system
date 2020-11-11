import {
  MiddlewareConsumer, Module, NestModule, RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextMiddleware, NextModule } from '@nestpress/next';
import { typeOrmPostgresConfig } from './common/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { FcmAdminServerModule } from './fcm-admin-server/fcm-admin-server.module';
import { User } from './common/entities/user.entity';
import { FcmAdminClientController } from './fcm-admin-client.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './common/config/.env'
    }),
    TypeOrmModule.forRoot(typeOrmPostgresConfig),
    TypeOrmModule.forFeature([User]),
    NextModule,
    AuthModule,
    FcmAdminServerModule
  ],
  controllers: [FcmAdminClientController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // handle scripts
    consumer.apply(NextMiddleware).forRoutes({
      path: '_next*', method: RequestMethod.GET,
    });
    
    // handle other assets
    consumer.apply(NextMiddleware).forRoutes({
      path: 'images/*', method: RequestMethod.GET,
    });
    
    consumer.apply(NextMiddleware).forRoutes({
      path: 'favicon.ico', method: RequestMethod.GET,
    });
  }
}

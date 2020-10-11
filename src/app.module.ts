import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmAdminClientModule } from './fcm-admin-client/fcm-admin-client.module';
import { FcmServerModule } from './fcm-server/fcm-server.module';
import { User } from './fcm-server/entities/user';
import { Message } from './fcm-server/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    RenderModule.forRootAsync(
      Next({ dev: process.env.NODE_ENV !== 'production' }),
       { viewsDir: null }
    ),
    AuthModule,
    FcmAdminClientModule,
    FcmServerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


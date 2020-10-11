import { Module } from '@nestjs/common';
import { FcmServerService } from './fcm-server.service';
import { FcmServerController } from './fcm-server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [FcmServerService],
  controllers: [FcmServerController],
})
export class FcmServerModule {}

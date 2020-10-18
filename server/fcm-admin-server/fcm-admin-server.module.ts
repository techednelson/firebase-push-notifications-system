import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../common/entities/notification.entity';
import { NotificationsController } from './controllers/notifications.controller';
import { FcmController } from './controllers/fcm.controller';
import { SubscribersController } from './controllers/subscribersController';
import { SubscribersService } from './services/subscribers.service';
import { FcmService } from './services/fcm.service';
import { NotificationsService } from './services/notifications.service';
import { Subscriber } from '../common/entities/subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Subscriber])],
  controllers: [NotificationsController, FcmController, SubscribersController],
  providers: [SubscribersService, FcmService, NotificationsService],
})
export class FcmAdminServerModule {
}

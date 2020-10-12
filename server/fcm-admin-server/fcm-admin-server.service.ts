import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../common/entities/notification.entity';
import { NotificationRequestDto } from '../common/dtos/notification-request.dto';
import { SubscriptionRequestDto } from '../common/dtos/subscription-request.dto';

@Injectable()
export class FcmAdminServerService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  // async save(
  //   notificationRequestDto: NotificationRequestDto,
  // ): Promise<Notification> {}
	//
  // async subscribeToTopic(
  //   subscriptionRequestDto: SubscriptionRequestDto,
  // ): Promise<string> {
  //   return '';
  // }

  async unsubscribeFromTopic(
    subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    return '';
  }

  async sendPushNotificationToDevice(
    notificationRequestDto: NotificationRequestDto,
  ): Promise<string> {
    return '';
  }

  async sendPushNotificationToTopic(
    notificationRequestDto: NotificationRequestDto,
  ): Promise<string> {
    return '';
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { SubscriptionRequestDto } from '../../common/dtos/subscription-request.dto';
import admin, { ServiceAccount } from 'firebase-admin';
import { NotificationRequestDto } from '../../common/dtos/notification-request.dto';
import serviceAccount from '../../common/config/serviceAccountKey.json';
import { NotificationsService } from './notifications.service';
import { SubscribersService } from './subscribers.service';
import { NotificationStatus } from '../../common/enums';
import { MulticastRequestDto } from '../../common/dtos/multicast-request.dto';
import Message = admin.messaging.Message;
import MulticastMessage = admin.messaging.MulticastMessage;
import { Connection } from 'typeorm';

@Injectable()
export class FcmService {
  
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly subscribersService: SubscribersService,
    private connection: Connection
  ) {
    FcmService.initFirebase();
  }
  
  private static initFirebase(): void {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: 'https://fir-cloud-messaging-admin.firebaseio.com',
    });
  }
  
  async clientSubscriptionToTopic(subscriptionRequestDto: SubscriptionRequestDto): Promise<string> {
    const { username, token, topic } = subscriptionRequestDto;
    const subscriber = await this.subscribersService.findByUsername(`${topic}-${username}`);
    if (subscriber) {
      return `${username} is already subscribed`;
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await admin.messaging().subscribeToTopic(token, topic);
      await this.subscribersService.save(username, token, topic, true);
      await queryRunner.commitTransaction();
      return `${username} was successfully subscribed to topic: ${topic}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Error subscribing ${username} to topic: ${topic}`);
    } finally {
      await queryRunner.release();
    }
  }
  
  async adminToggleSubscriptionToTopic(subscriptionRequestDto: SubscriptionRequestDto): Promise<string> {
    const { username, token, topic, subscribed } = subscriptionRequestDto;
    const subscriber = await this.subscribersService.findByUsername(username);
    if (!subscriber) {
      throw new NotFoundException(`${username} was not found`);
    }
    if (subscribed === undefined || subscribed === null) {
      throw new BadRequestException('Subscribed value is not defined');
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      subscribed
        ? await admin.messaging().subscribeToTopic(token, topic)
        : await admin.messaging().unsubscribeFromTopic(token, topic);
      subscriber.subscribed = subscribed;
      await this.subscribersService.update(username, subscriber);
      await queryRunner.commitTransaction();
      return `${username} was successfully ${subscribed ? 'subscribed' : 'unsubscribed'}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Error subscribing to topic: ${topic}`);
    } finally {
      await queryRunner.release();
    }
  }
  
  async sendPushNotificationToDevice(notificationPayloadDto: NotificationRequestDto): Promise<string> {
    if (notificationPayloadDto.token === '') {
      throw new BadRequestException('Token can not be empty');
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { title, body, token, topic, username, type } = notificationPayloadDto;
    try {
      const message: Message = {
        data: { title, body }, token,
      };
      await admin.messaging().send(message);
      await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.COMPLETED);
      await queryRunner.commitTransaction();
      return `Push notification was sent to ${username}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      try {
        await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.FAILED);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
      console.log(`Error sending push notification to username: ${username}`, error);
      throw new InternalServerErrorException(`Error sending push notification to username: ${username}`);
    }
  }
  
  async sendMulticastPushNotification(multicastNotificationRequestDto: MulticastRequestDto): Promise<string> {
    const { subscribers, tokens } = multicastNotificationRequestDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const message: MulticastMessage = {
        data: { title: subscribers[0].title, body: subscribers[0].body },
        tokens,
      };
      await admin.messaging().sendMulticast(message);
      await this.saveMulticastNotifications(subscribers, true);
      await queryRunner.commitTransaction();
      return `Multicast push notification was sent`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      try {
        await this.saveMulticastNotifications(subscribers, false);
        console.log('Error sending multicast push notification', error);
        await queryRunner.commitTransaction();
        throw new InternalServerErrorException(`Error sending push notification`);
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.log(`Error sending push notification to username`, error);
        throw new InternalServerErrorException(`Error sending push notification`);
      } finally {
        await queryRunner.release();
      }
    }
  }
  
  async sendPushNotificationToTopic(notificationPayloadDto: NotificationRequestDto): Promise<string> {
    const { title, body, type, topic, username } = notificationPayloadDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const message: Message = {
        data: { title, body }, topic,
      };
      await admin.messaging().send(message);
      await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.COMPLETED);
      await queryRunner.commitTransaction();
      return `Push notification was sent to topic: ${topic}`;
    } catch (error) {
       await queryRunner.rollbackTransaction();
      try {
        await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.FAILED);
        console.log(`Error sending push notification to topic: ${topic}`, error);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(`Error sending push notification to topic: ${topic}`);
      } finally {
        await queryRunner.release();
      }
      console.log(`Error sending push notification to username: ${username}`, error);
      throw new InternalServerErrorException(`Error sending push notification to username: ${username}`);
    }
  }
  
  private async saveMulticastNotifications(subscribers: NotificationRequestDto[], success: boolean) {
    await subscribers.forEach(subscriber => {
      const { title, body, topic, username, type } = subscriber;
      this.notificationsService.save(title, body, topic, username, type, success ? NotificationStatus.COMPLETED : NotificationStatus.FAILED);
    });
  }
}

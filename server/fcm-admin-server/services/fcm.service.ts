import {
  BadRequestException, Injectable, InternalServerErrorException,
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
import { UnsubscriptionRequestDto } from '../../common/dtos/unsubscription-request.dto';

@Injectable()
export class FcmService {
  
  constructor(private readonly notificationsService: NotificationsService, private readonly subscribersService: SubscribersService) {
    FcmService.initFirebase();
  }
  
  private static initFirebase(): void {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: 'https://fir-cloud-messaging-admin.firebaseio.com',
    });
  }
  
  async subscribeToTopic(subscriptionRequestDto: SubscriptionRequestDto): Promise<string> {
    const { username, tokens, topic } = subscriptionRequestDto;
    try {
      const response = await admin
        .messaging()
        .subscribeToTopic(tokens, topic);
      console.log(response);
      await this.subscribersService.save(username, tokens[0], topic, true);
      return `Successfully subscribed to topic: ${topic}`;
    } catch (error) {
      console.log(`Error subscribing to topic: ${topic}`, error);
      throw new InternalServerErrorException(`Error subscribing to topic: ${topic}`);
    }
  }
  
  async unsubscribeFromTopic(unsubscriptionRequestDto: UnsubscriptionRequestDto): Promise<string> {
    const { users, subscriptions } = unsubscriptionRequestDto;
    // try {
    //   const response = await admin
    //     .messaging()
    //     .unsubscribeFromTopic(tokens, topicName);
    //   console.log(response);
    //   await this.subscribersService.save(username, tokens[0], topicName, false);
    //   return `Successfully unsubscribed to topic: ${topicName}`;
    // } catch (error) {
    //   console.log(`Error unsubscribing to topic: ${topicName}`, error);
    //   throw new InternalServerErrorException(`Error unsubscribing to topic: ${topicName}`);
    // }
    return '';
  }
  
  async sendPushNotificationToDevice(notificationPayloadDto: NotificationRequestDto): Promise<string> {
    if (notificationPayloadDto.token === '') {
      throw new BadRequestException('Token can not be empty');
    }
    const { title, body, token, topic, username, type } = notificationPayloadDto;
    try {
      const message: Message = {
        data: { title, body }, token,
      };
      await admin.messaging().send(message);
      await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.COMPLETED);
      return `Push notification was sent to ${username}`;
    } catch (error) {
      await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.FAILED);
      console.log(`Error sending push notification to username: ${username}`, error);
      throw new InternalServerErrorException(`Error sending push notification to username: ${username}`);
    }
  }
  
  async sendMulticastPushNotification(multicastNotificationRequestDto: MulticastRequestDto): Promise<string> {
    const { subscribers, tokens } = multicastNotificationRequestDto;
    try {
      const message: MulticastMessage = {
        data: { title: subscribers[0].title, body: subscribers[0].body },
        tokens,
      };
      await admin.messaging().sendMulticast(message);
      await this.saveMulticastNotifications(subscribers, true);
      return `Multicast push notification was sent`;
    } catch (error) {
      await this.saveMulticastNotifications(subscribers, false);
      console.log('Error sending multicast push notification', error);
      throw new InternalServerErrorException(`Error sending multicast push notification`);
    }
  }
  
  async sendPushNotificationToTopic(notificationPayloadDto: NotificationRequestDto): Promise<string> {
    const { title, body, type, topic, username } = notificationPayloadDto;
    try {
      const message: Message = {
        data: { title, body }, topic,
      };
      await admin.messaging().send(message);
      await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.COMPLETED);
      return `Push notification was sent to topic: ${topic}`;
    } catch (error) {
      await this.notificationsService.save(title, body, topic, username, type, NotificationStatus.FAILED);
      console.log(`Error sending push notification to topic: ${topic}`, error);
      throw new InternalServerErrorException(`Error sending push notification to topic: ${topic}`);
    }
  }
  
  private async saveMulticastNotifications(subscribers: NotificationRequestDto[], success: boolean) {
    await subscribers.forEach(subscriber => {
      const { title, body, topic, username, type } = subscriber;
      this.notificationsService.save(title, body, topic, username, type, success ? NotificationStatus.COMPLETED : NotificationStatus.FAILED);
    });
  }
}

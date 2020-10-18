import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SubscriptionRequestDto } from '../../common/dtos/subscription-request.dto';
import admin, { ServiceAccount } from 'firebase-admin';
import { NotificationTokenPayloadDto } from '../../common/dtos/notification-token-payload.dto';
import { NotificationPayloadDto } from '../../common/dtos/notification-payload.dto';
import serviceAccount from '../../common/config/serviceAccountKey.json';
import { NotificationsService } from './notifications.service';
import { SubscribersService } from './subscribers.service';
import { NotificationStatus } from '../../common/enums';
import Message = admin.messaging.Message;
import MulticastMessage = admin.messaging.MulticastMessage;

@Injectable()
export class FcmService {
  
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly subscribersService: SubscribersService,
  ) {
    FcmService.initFirebase();
  }
  
  private static initFirebase(): void {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: 'https://fir-cloud-messaging-admin.firebaseio.com',
    });
  }
  
  async subscribeToTopic(
    subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    const { username, tokens, topicName } = subscriptionRequestDto;
    try {
      const response = await admin
        .messaging()
        .subscribeToTopic(tokens, topicName);
      console.log(response);
      await this.subscribersService.save(username, tokens[0], topicName, true);
      return `Successfully subscribed to topic: ${topicName}`;
    } catch (error) {
      console.log(`Error subscribing to topic: ${topicName}`, error);
      throw new InternalServerErrorException(
        `Error subscribing to topic: ${topicName}`,
      );
    }
  }
  
  async unsubscribeFromTopic(
    subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    const { username, tokens, topicName } = subscriptionRequestDto;
    try {
      const response = await admin
        .messaging()
        .unsubscribeFromTopic(tokens, topicName);
      console.log(response);
      await this.subscribersService.save(username, tokens[0], topicName, false);
      return `Successfully unsubscribed to topic: ${topicName}`;
    } catch (error) {
      console.log(`Error unsubscribing to topic: ${topicName}`, error);
      throw new InternalServerErrorException(
        `Error unsubscribing to topic: ${topicName}`,
      );
    }
  }
  
  async sendPushNotificationToDevice(
    notificationTokenPayloadDto: NotificationTokenPayloadDto,
  ): Promise<string> {
    if (notificationTokenPayloadDto.tokens.length > 1) {
      throw new BadRequestException('Number of token must be equal to 1');
    }
    const { title, body, tokens, topic, user, type } = notificationTokenPayloadDto;
    try {
      const message: Message = {
        data: { title, body },
        token: tokens[0],
      };
      await admin.messaging().send(message);
      await this.notificationsService.save(title, body, topic, user, type, NotificationStatus.COMPLETED);
      return `Push notification was sent to ${user}`;
    } catch (error) {
      await this.notificationsService.save(title, body, topic, user, type, NotificationStatus.FAILED);
      console.log(`Error sending push notification to user: ${user}`, error);
      throw new InternalServerErrorException(
        `Error sending push notification to user: ${user}`,
      );
    }
  }
  
  async sendMulticastPushNotification(
    notificationTokenPayloadDto: NotificationTokenPayloadDto,
  ): Promise<string> {
    const { title, body, tokens, topic, user, type } = notificationTokenPayloadDto;
    try {
      const message: MulticastMessage = {
        data: { title, body },
        tokens,
      };
      await admin.messaging().sendMulticast(message);
      await this.notificationsService.save(title, body, topic, user, type, NotificationStatus.COMPLETED);
      return `Multicast push notification was sent`;
    } catch (error) {
      await this.notificationsService.save(title, body, topic, user, type, NotificationStatus.FAILED);
      console.log('Error sending multicast push notification', error);
      throw new InternalServerErrorException(
        `Error sending multicast push notification`,
      );
    }
  }
  
  async sendPushNotificationToTopic(
    notificationPayloadDto: NotificationPayloadDto,
  ): Promise<string> {
    const { title, body, type, topic, user } = notificationPayloadDto;
    try {
      const message: Message = {
        data: { title, body },
        topic,
      };
      await admin.messaging().send(message);
      await this.notificationsService.save(title, body, topic, user, type, NotificationStatus.COMPLETED);
      return `Push notification was sent to topic: ${topic}`;
    } catch (error) {
      await this.notificationsService.save(title, body, topic, user, type, NotificationStatus.FAILED);
      console.log(`Error sending push notification to topic: ${topic}`, error);
      throw new InternalServerErrorException(
        `Error sending push notification to topic: ${topic}`,
      );
    }
  }
}

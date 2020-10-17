import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../common/entities/notification.entity';
import { NotificationPayloadDto } from '../common/dtos/notification-payload.dto';
import { SubscriptionRequestDto } from '../common/dtos/subscription-request.dto';
import { NotificationResponseDto } from '../common/dtos/notification-response.dto';
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../common/config/serviceAccountKey.json';
import { NotificationType } from '../common/enums';
import Message = admin.messaging.Message;
import MulticastMessage = admin.messaging.MulticastMessage;
import { NotificationTokenPayloadDto } from '../common/dtos/notification-token-payload.dto';

@Injectable()
export class FcmAdminServerService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    FcmAdminServerService.initFirebase();
  }
  
  private static initFirebase(): void {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: "https://fir-cloud-messaging-admin.firebaseio.com"
    });
  }
  
  async findAll(): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.find();
    return notifications.map(notification => notification as NotificationResponseDto);
  }

  async save(
    title: string,
    body: string,
    topic: string,
    user: string,
    type: NotificationType
  ): Promise<boolean> {
    const notification = new Notification();
    notification.topic = topic;
    notification.createdAt = Date.now().toString();
    notification.title = title;
    notification.body = body;
    notification.type = type;
    notification.user = user;
    try {
      await this.notificationRepository.save(notification);
      return true;
    } catch (error) {
      console.log(error);
      throw new ConflictException(error);
    }
  }
  
  async findById(id: number): Promise<NotificationResponseDto | null> {
    if (!id) {
      throw new BadRequestException('Id format is incorrect');
    }
    
    try {
      const notification = await this.notificationRepository.findOne({ id });
      if (notification) {
        return notification as NotificationResponseDto;
      }
    } catch (error) {
      throw new ConflictException(error);
    }
  
    return null;
  }
  
  async deleteById(id: number): Promise<void> {
    const notification = this.findById(id);
    if (notification) {
       try {
        await this.notificationRepository.delete(id);
      } catch (error) {
        throw new ConflictException(error);
      }
    }
  }

  async subscribeToTopic(
    subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    const { tokens, topicName } = subscriptionRequestDto;
    try {
      const response = await admin
        .messaging()
        .subscribeToTopic(tokens, topicName);
      console.log(response);
      return `Successfully subscribed to topic: ${topicName}`;
    } catch (error) {
      console.log(`Error subscribing to topic: ${topicName}`, error);
      throw new InternalServerErrorException(
        `Error subscribing to topic: ${topicName}`
      );
    }
  }

  async unsubscribeFromTopic(
    subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    const { tokens, topicName } = subscriptionRequestDto;
    try {
      const response = await admin
        .messaging()
        .unsubscribeFromTopic(tokens, topicName);
      console.log(response);
      return `Successfully unsubscribed to topic: ${topicName}`;
    } catch (error) {
      console.log(`Error unsubscribing to topic: ${topicName}`, error);
      throw new InternalServerErrorException(
        `Error unsubscribing to topic: ${topicName}`
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
      }
      await admin.messaging().send(message);
      await this.save(title, body, topic, user, type);
      return `Push notification was sent to ${user}`;
    } catch (error) {
      console.log(`Error sending push notification to user: ${user}`, error);
      throw new InternalServerErrorException(
        `Error sending push notification to user: ${user}`
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
        tokens
      }
      await admin.messaging().sendMulticast(message);
      await this.save(title, body, topic, user, type);
      return `Multicast push notification was sent`;
    } catch (error) {
      console.log('Error sending multicast push notification', error);
      throw new InternalServerErrorException(
        `Error sending multicast push notification`
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
        topic
      }
      await admin.messaging().send(message);
      await this.save(title, body, topic, user, type);
      return `Push notification was sent to topic: ${topic}`;
    } catch (error) {
      console.log(`Error sending push notification to topic: ${topic}`, error);
      throw new InternalServerErrorException(
        `Error sending push notification to topic: ${topic}`
      );
    }
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SubscriptionRequestDto } from '../../common/dtos/subscription-request.dto';
import * as admin from 'firebase-admin';
import { SingleRequestDto } from '../../common/dtos/single-request.dto';
import { NotificationsService } from './notifications.service';
import { SubscribersService } from './subscribers.service';
import { NotificationStatus } from '../../common/enums';
import { MulticastRequestDto } from '../../common/dtos/multicast-request.dto';
import MulticastMessage = admin.messaging.MulticastMessage;
import { Connection } from 'typeorm';
import { TopicRequestDto } from '../../common/dtos/topic-request.dto';

@Injectable()
export class FcmService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly subscribersService: SubscribersService,
    private connection: Connection
  ) {}

  async clientSubscriptionToTopic(
    subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    const { username, token, topic } = subscriptionRequestDto;
    const subscriber = await this.subscribersService.findByUsername(
      `${topic}-${username}`,
    );
    if (subscriber) {
      return `${username} is already subscribed`;
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const response = await admin.messaging().subscribeToTopic(token, topic);
      console.log(response);
      await this.subscribersService.save(username, token, topic, true);
      await queryRunner.commitTransaction();
      return `${username} was successfully subscribed to topic: ${topic}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error subscribing ${username} to topic: ${topic}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async adminToggleSubscriptionToTopic(
    subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    const { token, topic, subscribed } = subscriptionRequestDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      subscribed
        ? await admin.messaging().subscribeToTopic(token, topic)
        : await admin.messaging().unsubscribeFromTopic(token, topic);
      await this.subscribersService.update(token, subscribed);
      await queryRunner.commitTransaction();
      return `Usernames were successfully ${
        subscribed ? 'subscribed' : 'unsubscribed'
      }`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error ${subscribed ? 'subscribing' : 'unsubscribing'} to topic: ${topic}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async sendPushNotificationToDevice(
    notificationPayloadDto: SingleRequestDto,
  ): Promise<string> {
    if (notificationPayloadDto.token === '') {
      throw new BadRequestException('Token can not be empty');
    }
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const {
      title,
      body,
      token,
      topic,
      username,
      type,
    } = notificationPayloadDto;
    try {
      const notification = {
        title,
        body,
      }
      await admin.messaging().sendToDevice(token, { notification });
      await this.notificationsService.save(
        title,
        body,
        topic,
        username,
        type,
        NotificationStatus.COMPLETED,
      );
      await queryRunner.commitTransaction();
      return `Push notification was sent to ${username}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      try {
        await this.notificationsService.save(
          title,
          body,
          topic,
          username,
          type,
          NotificationStatus.FAILED,
        );
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
      console.log(
        `Error sending push notification to username: ${username}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error sending push notification to username: ${username}`,
      );
    }
  }

  async sendMulticastPushNotification(
    multicastNotificationRequestDto: MulticastRequestDto,
  ): Promise<string> {
    const { subscribers, tokens } = multicastNotificationRequestDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const message: MulticastMessage = {
        notification: {
          title: subscribers[0].title,
          body: subscribers[0].body,
        },
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
        throw new InternalServerErrorException(
          `Error sending push notification`,
        );
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.log(`Error sending push notification to username`, error);
        throw new InternalServerErrorException(
          `Error sending push notification`,
        );
      } finally {
        await queryRunner.release();
      }
    }
  }

  async sendPushNotificationToTopic(
    topicRequestDto: TopicRequestDto,
  ): Promise<string> {
    const { title, body, type, topic, username } = topicRequestDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const notification = {
        title,
        body,
      }
      await admin.messaging().sendToTopic(topic, { notification });
      await this.notificationsService.save(
        title,
        body,
        topic,
        username,
        type,
        NotificationStatus.COMPLETED,
      );
      await queryRunner.commitTransaction();
      return `Push notification was sent to topic: ${topic}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      try {
        await this.notificationsService.save(
          title,
          body,
          topic,
          username,
          type,
          NotificationStatus.FAILED,
        );
        await queryRunner.commitTransaction();
        return `Error sending push notification to topic: ${topic}`;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(
          `Error sending push notification to topic: ${topic}`,
        );
      } finally {
        await queryRunner.release();
      }
    }
  }

  private async saveMulticastNotifications(
    subscribers: SingleRequestDto[],
    success: boolean,
  ) {
    await subscribers.forEach(subscriber => {
      const { title, body, topic, username, type } = subscriber;
      this.notificationsService.save(
        title,
        body,
        topic,
        username,
        type,
        success ? NotificationStatus.COMPLETED : NotificationStatus.FAILED,
      );
    });
  }
}

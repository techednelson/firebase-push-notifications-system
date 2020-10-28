import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionRequestDto } from '../../common/dtos/subscription-request.dto';
import { NotificationTokenPayloadDto } from '../../common/dtos/notification-token-payload.dto';
import { NotificationRequestDto } from '../../common/dtos/notification-request.dto';
import { FcmService } from '../services/fcm.service';

@Controller('fcm')
export class FcmController {
  
  constructor(private readonly fcmService: FcmService) {
  }
  
  @Post('/subscribe')
  async subscribeToTopic(
    @Body() subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    return await this.fcmService.subscribeToTopic(
      subscriptionRequestDto,
    );
  }
  
  @Post('/unsubscribe')
  async unsubscribeFromTopic(
    @Body() subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    return await this.fcmService.unsubscribeFromTopic(
      subscriptionRequestDto,
    );
  }
  
  @Post('/token')
  async sendPushNotificationToDevice(
    @Body() notificationTokenPayloadDto: NotificationTokenPayloadDto,
  ): Promise<string> {
    return await this.fcmService.sendPushNotificationToDevice(
      notificationTokenPayloadDto,
    );
  }
  
  @Post('/multicast')
  async sendMulticastPushNotification(
    @Body() notificationTokenPayloadDto: NotificationTokenPayloadDto,
  ): Promise<string> {
    return await this.fcmService.sendMulticastPushNotification(
      notificationTokenPayloadDto,
    );
  }
  
  @Post('/topic')
  async sendPushNotificationToTopic(
    @Body() notificationPayloadDto: NotificationRequestDto,
  ): Promise<string> {
    return await this.fcmService.sendPushNotificationToTopic(
      notificationPayloadDto,
    );
  }
}

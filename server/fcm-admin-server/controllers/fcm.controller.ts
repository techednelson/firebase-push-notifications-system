import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubscriptionRequestDto } from '../../common/dtos/subscription-request.dto';
import { NotificationRequestDto } from '../../common/dtos/notification-request.dto';
import { FcmService } from '../services/fcm.service';
import { MulticastRequestDto } from '../../common/dtos/multicast-request.dto';
import { UnsubscriptionRequestDto } from '../../common/dtos/unsubscription-request.dto';
import JwtAccessTokenGuard from '../../auth/guards/jwt-access-token.guard';

@Controller('fcm')
@UseGuards(JwtAccessTokenGuard)
export class FcmController {
  
  constructor(private readonly fcmService: FcmService) {
  }
  
  @Post('/subscribe')
  async subscribeToTopic(@Body() subscriptionRequestDto: SubscriptionRequestDto): Promise<string> {
    return await this.fcmService.subscribeToTopic(subscriptionRequestDto);
  }
  
  @Post('/unsubscribe')
  async unsubscribeFromTopic(@Body() unsubscriptionRequestDto: UnsubscriptionRequestDto): Promise<string> {
    return await this.fcmService.unsubscribeFromTopic(unsubscriptionRequestDto);
  }
  
  @Post('/token')
  async sendPushNotificationToDevice(@Body() notificationRequestDto: NotificationRequestDto): Promise<string> {
    return await this.fcmService.sendPushNotificationToDevice(notificationRequestDto);
  }
  
  @Post('/multicast')
  async sendMulticastPushNotification(@Body() multicastRequestDto: MulticastRequestDto): Promise<string> {
    return await this.fcmService.sendMulticastPushNotification(multicastRequestDto);
  }
  
  @Post('/topic')
  async sendPushNotificationToTopic(@Body() notificationPayloadDto: NotificationRequestDto): Promise<string> {
    return await this.fcmService.sendPushNotificationToTopic(notificationPayloadDto);
  }
}

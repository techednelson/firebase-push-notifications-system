import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SubscriptionRequestDto } from '../../common/dtos/subscription-request.dto';
import { SingleRequestDto } from '../../common/dtos/single-request.dto';
import { FcmService } from '../services/fcm.service';
import { MulticastRequestDto } from '../../common/dtos/multicast-request.dto';
import JwtAccessTokenGuard from '../../auth/guards/jwt-access-token.guard';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.strategy';
import { TopicRequestDto } from '../../common/dtos/topic-request.dto';

@Controller('fcm')
export class FcmController {
  
  constructor(private readonly fcmService: FcmService) {}
  
  @UseGuards(BasicAuthGuard)
  @Post('/subscribe')
  @HttpCode(200)
  async clientSubscriptionToTopic(@Body() subscriptionRequestDto: SubscriptionRequestDto): Promise<string> {
    return await this.fcmService.clientSubscriptionToTopic(subscriptionRequestDto);
  }
  
  @UseGuards(JwtAccessTokenGuard)
  @Post('/admin-toggle-subscription')
  @HttpCode(200)
  async adminSubscriptionToTopic(@Body() subscriptionRequestDto: SubscriptionRequestDto): Promise<string> {
    return await this.fcmService.adminToggleSubscriptionToTopic(subscriptionRequestDto);
  }
  
  @UseGuards(JwtAccessTokenGuard)
  @Post('/token')
  @HttpCode(200)
  async sendPushNotificationToDevice(@Body() notificationRequestDto: SingleRequestDto): Promise<string> {
    return await this.fcmService.sendPushNotificationToDevice(notificationRequestDto);
  }
  
  @UseGuards(JwtAccessTokenGuard)
  @Post('/multicast')
  @HttpCode(200)
  async sendMulticastPushNotification(@Body() multicastRequestDto: MulticastRequestDto): Promise<string> {
    return await this.fcmService.sendMulticastPushNotification(multicastRequestDto);
  }
  
  @UseGuards(JwtAccessTokenGuard)
  @Post('/topic')
  @HttpCode(200)
  async sendPushNotificationToTopic(@Body() topicRequestDto: TopicRequestDto): Promise<string> {
    return await this.fcmService.sendPushNotificationToTopic(topicRequestDto);
  }
}

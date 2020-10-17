import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubscriptionRequestDto } from '../common/dtos/subscription-request.dto';
import { NotificationPayloadDto } from '../common/dtos/notification-payload.dto';
import { FcmAdminServerService } from './fcm-admin-server.service';
import { NotificationResponseDto } from '../common/dtos/notification-response.dto';
import { NotificationTokenPayloadDto } from '../common/dtos/notification-token-payload.dto';
import { NotificationType } from '../common/enums';

@Controller('fcm-server')
export class FcmAdminServerController {
  constructor(private readonly fmAdminServerService: FcmAdminServerService) {}

  @Get('/notifications')
  async findAll(): Promise<NotificationResponseDto[]> {
    return await this.fmAdminServerService.findAll();
  }
  
 @Post('/save')
  async save(@Body() notificationPayloadDto: {
    title: string,
    body: string,
    topic: string,
    user: string,
    type: NotificationType
  }): Promise<boolean> {
     const { title, body, topic, user, type } = notificationPayloadDto;
     return await this.fmAdminServerService.save(title, body, topic, user, type);
  }
  
  @Get('/notification/:id')
   async findById(@Param('id') id: number): Promise<NotificationResponseDto | null> {
    return this.fmAdminServerService.findById(id);
  }

  @Delete('notification/:id')
  async deleteById(@Param('id') id: number): Promise<void> {
    await this.fmAdminServerService.deleteById(id);
  }

  @Post('/subscribe')
  async subscribeToTopic(
    @Body() subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    return await this.fmAdminServerService.subscribeToTopic(
      subscriptionRequestDto,
    );
  }

  @Post('/unsubscribe')
  async unsubscribeFromTopic(
    @Body() subscriptionRequestDto: SubscriptionRequestDto,
  ): Promise<string> {
    return await this.fmAdminServerService.unsubscribeFromTopic(
      subscriptionRequestDto,
    );
  }

  @Post('/token')
  async sendPushNotificationToDevice(
    @Body() notificationTokenPayloadDto: NotificationTokenPayloadDto,
  ): Promise<string> {
    return await this.fmAdminServerService.sendPushNotificationToDevice(
      notificationTokenPayloadDto,
    );
  }
  
  @Post('/multicast')
  async sendMulticastPushNotification(
    @Body() notificationTokenPayloadDto: NotificationTokenPayloadDto,
  ): Promise<string> {
    return await this.fmAdminServerService.sendMulticastPushNotification(
      notificationTokenPayloadDto,
    );
  }

  @Post('/topic')
  async sendPushNotificationToTopic(
    @Body() notificationPayloadDto: NotificationPayloadDto,
  ): Promise<string> {
    return await this.fmAdminServerService.sendPushNotificationToTopic(
      notificationPayloadDto,
    );
  }
}

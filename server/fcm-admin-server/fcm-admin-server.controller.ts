import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubscriptionRequestDto } from '../common/dtos/subscription-request.dto';
import { NotificationRequestDto } from '../common/dtos/notification-request.dto';
import { FcmAdminServerService } from './fcm-admin-server.service';
import { Notification } from '../common/entities/notification.entity';

@Controller('fcm-server')
export class FcmAdminServerController {
  constructor(private readonly fmAdminServerService: FcmAdminServerService) {}

  // @Get('/all')
  // async findAll(): Promise<Notification[]> {
  //   await this.fmAdminServerService.findAll();
  // }
  //
  // @Post('/save')
  // async save(@Body() notificationRequestDto: NotificationRequestDto): Promise<Notification> {
  //
  // }
  //
  //  @Get('/:id')
  //  async findById(@Param() id: number): Promise<Notification> {
  //
  // }

  // @Delete('/:id')
  // async delete(@Param() id: number): Promise<void> {
  //
  // }

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
    @Body() notificationRequestDto: NotificationRequestDto,
  ): Promise<string> {
    return await this.fmAdminServerService.sendPushNotificationToDevice(
      notificationRequestDto,
    );
  }

  @Post('/topic')
  async sendPushNotificationToTopic(
    @Body() notificationRequestDto: NotificationRequestDto,
  ): Promise<string> {
    return await this.fmAdminServerService.sendPushNotificationToTopic(
      notificationRequestDto,
    );
  }
}

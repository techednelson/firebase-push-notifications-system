import {
  Body, Controller, Get, HttpCode, Post, UseGuards,
} from '@nestjs/common';
import { NotificationResponseDto } from '../../common/dtos/notification-response.dto';
import { NotificationsService } from '../services/notifications.service';
import JwtAccessTokenGuard from '../../auth/guards/jwt-access-token.guard';

@Controller('fcm-notifications')
@UseGuards(JwtAccessTokenGuard)
export class NotificationsController {
  
  constructor(private readonly notificationsService: NotificationsService) {
  }
  
  @Get('/')
  async findAll(): Promise<NotificationResponseDto[]> {
    return await this.notificationsService.findAll();
  }
  
  // @Post('/save')
  // async save(@Body() notificationPayloadDto: {
  //   title: string, body: string, topic: string, username: string, type: NotificationType, status: NotificationStatus
  // }): Promise<boolean> {
  //   const { title, body, topic, username, type, status } = notificationPayloadDto;
  //   return await this.notificationsService.save(title, body, topic, username, type, status);
  // }
  
  // @Get('/:id')
  // async findById(@Param('id') id: number): Promise<NotificationResponseDto | string> {
  //   return this.notificationsService.findById(id);
  // }
  
  @Post('/delete')
  @HttpCode(200)
  async deleteById(@Body() ids: number[]): Promise<void> {
    await this.notificationsService.deleteById(ids);
  }
}

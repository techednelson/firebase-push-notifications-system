import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards,
} from '@nestjs/common';
import { NotificationResponseDto } from '../../common/dtos/notification-response.dto';
import { NotificationStatus, NotificationType } from '../../common/enums';
import { NotificationsService } from '../services/notifications.service';
import { TopicsResponseDto } from '../../common/dtos/topics-response.dto';
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
  
  @Get('/topics')
  async findAllTopics(): Promise<TopicsResponseDto> {
    return await this.notificationsService.findAllTopics();
  }
  
  @Post('/save')
  async save(@Body() notificationPayloadDto: {
    title: string, body: string, topic: string, username: string, type: NotificationType, status: NotificationStatus
  }): Promise<boolean> {
    const { title, body, topic, username, type, status } = notificationPayloadDto;
    return await this.notificationsService.save(title, body, topic, username, type, status);
  }
  
  @Get('/:id')
  async findById(@Param('id') id: number): Promise<NotificationResponseDto | string> {
    return this.notificationsService.findById(id);
  }
  
  @Post('/delete')
  @HttpCode(200)
  async deleteById(@Body() ids: number[]): Promise<void> {
    await this.notificationsService.deleteById(ids);
  }
}

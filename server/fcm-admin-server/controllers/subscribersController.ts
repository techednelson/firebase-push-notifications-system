import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { SubscribersService } from '../services/subscribers.service';
import { SubscriptionResponseDto } from '../../common/dtos/subscription-response.dto';
import JwtAccessTokenGuard from '../../auth/guards/jwt-access-token.guard';
import { TopicsResponseDto } from '../../common/dtos/topics-response.dto';

@Controller('fcm-subscribers')
@UseGuards(JwtAccessTokenGuard)
export class SubscribersController {
  
  constructor(private readonly subscribersService: SubscribersService) {
  }
  
  @Get('/')
  async findAll(): Promise<SubscriptionResponseDto[]> {
    return await this.subscribersService.findAll();
  }
  
  @Get('/topics')
  async findAllTopics(): Promise<TopicsResponseDto> {
    return await this.subscribersService.findAllTopics();
  }
}

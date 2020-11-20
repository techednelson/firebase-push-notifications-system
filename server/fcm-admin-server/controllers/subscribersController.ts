import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post, UseGuards,
} from '@nestjs/common';
import { SubscribersService } from '../services/subscribers.service';
import { SubscriptionResponseDto } from '../../common/dtos/subscription-response.dto';
import JwtAccessTokenGuard from '../../auth/guards/jwt-access-token.guard';

@Controller('fcm-subscribers')
@UseGuards(JwtAccessTokenGuard)
export class SubscribersController {
  
  constructor(private readonly subscribersService: SubscribersService) {
  }
  
  @Get('/')
  async findAll(): Promise<SubscriptionResponseDto[]> {
    return await this.subscribersService.findAll();
  }
  
  @Post('/save')
  async save(@Body() subscriptionRequestDto: {
    username: string, tokens: string[], topic: string, subscribed: boolean,
  }): Promise<boolean> {
    const { username, tokens, topic, subscribed } = subscriptionRequestDto;
    return await this.subscribersService.save(username, tokens[0], topic, subscribed);
  }
  
  @Get('/:id')
  async findById(@Param('id') id: number): Promise<SubscriptionResponseDto | null> {
    return this.subscribersService.findById(id);
  }
  
  @Delete('/:id')
  async deleteById(@Param('id') id: number): Promise<void> {
    await this.subscribersService.deleteById(id);
  }
}

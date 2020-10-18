import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubscribersService } from '../services/subscribers.service';
import { SubscriptionResponseDto } from '../../common/dtos/subscription-response.dto';

@Controller('fcm-subscribers')
export class SubscribersController {
  
  constructor(private readonly subscribersService: SubscribersService) {
  }
  
  @Get('/')
  async findAll(): Promise<SubscriptionResponseDto[]> {
    return await this.subscribersService.findAll();
  }
  
  @Post('/save')
  async save(@Body() subscriptionRequestDto: {
    username: string;
    tokens: string[];
    topicName: string;
    subscribed: boolean;
  }): Promise<boolean> {
    const { username, tokens, topicName, subscribed } = subscriptionRequestDto;
    return await this.subscribersService.save(username, tokens[0], topicName, subscribed);
  }
  
  @Get('/:id')
  async findById(@Param('id') id: number): Promise<SubscriptionResponseDto | string> {
    return this.subscribersService.findById(id);
  }
  
  @Delete('/:id')
  async deleteById(@Param('id') id: number): Promise<void> {
    await this.subscribersService.deleteById(id);
  }
}

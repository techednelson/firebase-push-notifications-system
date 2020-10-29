import {
  BadRequestException, ConflictException, Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from '../../common/entities/subscriber.entity';
import { Repository } from 'typeorm';
import { SubscriptionResponseDto } from '../../common/dtos/subscription-response.dto';

@Injectable()
export class SubscribersService {
  
  constructor(@InjectRepository(Subscriber) private subscriberRepository: Repository<Subscriber>) {
  }
  
  async findAll(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriberRepository.find();
    return subscriptions.map(subscription => subscription as SubscriptionResponseDto);
  }
  
  async save(username: string, token: string, topic: string, subscribed: boolean): Promise<boolean> {
    const notification = new Subscriber();
    notification.username = topic;
    notification.token = token;
    notification.topic = topic;
    notification.subscribed = subscribed;
    try {
      await this.subscriberRepository.save(notification);
      return true;
    } catch (error) {
      console.log(error);
      throw new ConflictException(error);
    }
  }
  
  async findById(id: number): Promise<SubscriptionResponseDto | string> {
    if (!id) {
      throw new BadRequestException('Id format is incorrect');
    }
    try {
      const subscription = await this.subscriberRepository.findOne({ id });
      if (subscription) {
        return subscription as SubscriptionResponseDto;
      }
    } catch (error) {
      throw new ConflictException(error);
    }
    
    return `Subscription with id: ${id} not found`;
  }
  
  async deleteById(id: number): Promise<string> {
    const subscription = this.findById(id);
    if (subscription) {
      try {
        await this.subscriberRepository.delete(id);
        return `Subscription with id: ${id} was deleted`;
      } catch (error) {
        throw new ConflictException(error);
      }
    }
    return `Subscription with id: ${id} not found`;
  }
}

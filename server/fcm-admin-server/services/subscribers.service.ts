import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from '../../common/entities/subscriber.entity';
import { Repository } from 'typeorm';
import { SubscriptionResponseDto } from '../../common/dtos/subscription-response.dto';
import { TopicsResponseDto } from '../../common/dtos/topics-response.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
  ) {}

  async findAll(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriberRepository.find();
    return subscriptions.map(
      subscription => subscription as SubscriptionResponseDto,
    );
  }

  async findAllSubscribed(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .where('subscriber.subscribed = :subscribed', { subscribed: true })
      .getMany();
    return subscriptions.map(
      subscription => subscription as SubscriptionResponseDto,
    );
  }

  async save(
    username: string,
    token: string,
    topic: string,
    subscribed: boolean,
  ): Promise<boolean> {
    const subscriber = new Subscriber();
    subscriber.username = `${topic}-${username}`;
    subscriber.token = token;
    subscriber.topic = topic;
    subscriber.subscribed = subscribed;
    try {
      await this.subscriberRepository.save(subscriber);
      return true;
    } catch (error) {
      console.log(error);
      throw new ConflictException(error);
    }
  }

  async findAllTopics(): Promise<TopicsResponseDto> {
    try {
      const topics = await this.subscriberRepository
        .createQueryBuilder('subscriber')
        .select('topic')
        .distinct(true)
        .getRawMany();
      const dto = new TopicsResponseDto();
      dto.topics = topics.map(obj => obj.topic);
      return dto;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async update(token: string, subscribed: boolean): Promise<boolean> {
    try {
      const subscribers = await this.subscriberRepository
      .createQueryBuilder('subscriber')
      .where('subscriber.token = :token', { token })
      .getMany();
      for (const subscriber of subscribers) {
        subscriber.subscribed = subscribed;
        await this.subscriberRepository.save(subscriber);
      }
      return true;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async findByUsername(
    username: string,
  ): Promise<SubscriptionResponseDto | null> {
    if (!username) {
      throw new BadRequestException('Format is incorrect');
    }
    try {
      const subscriber = await this.subscriberRepository.findOne({ username });
      if (subscriber) {
        return subscriber as SubscriptionResponseDto;
      }
      return null;
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}

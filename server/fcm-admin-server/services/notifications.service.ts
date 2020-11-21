import {
  BadRequestException, ConflictException, Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../../common/entities/notification.entity';
import { Connection, Repository } from 'typeorm';
import { NotificationResponseDto } from '../../common/dtos/notification-response.dto';
import { NotificationStatus, NotificationType } from '../../common/enums';

@Injectable()
export class NotificationsService {
  
  constructor(
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    private connection: Connection
  ) {
  }
  
  async findAll(): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.find();
    return notifications.map(notification => notification as NotificationResponseDto);
  }
  
  async save(title: string, body: string, topic: string, username: string, type: NotificationType, status: NotificationStatus): Promise<boolean> {
    const notification = new Notification();
    notification.topic = topic;
    notification.createdOn = Date.now().toLocaleString();
    notification.title = title;
    notification.body = body;
    notification.type = type;
    notification.username = username;
    notification.status = status;
    try {
      await this.notificationRepository.save(notification);
      return true;
    } catch (error) {
      console.log(error);
      throw new ConflictException(error);
    }
  }
  
  async findById(id: number): Promise<NotificationResponseDto | string> {
    if (!id) {
      throw new BadRequestException('Id format is incorrect');
    }
    try {
      const notification = await this.notificationRepository.findOne({ id });
      if (notification) {
        return notification as NotificationResponseDto;
      }
    } catch (error) {
      throw new ConflictException(error);
    }
    
    return `Notification with id: ${id} not found`;
  }
  
  async deleteById(ids: number[]): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const id of ids) {
        const notification = await this.findById(id);
        if (notification) {
          await queryRunner.manager.delete(Notification, id);
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

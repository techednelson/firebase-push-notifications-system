import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationStatus, NotificationType } from '../enums';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  type: NotificationType;

  @Column()
  topic: string;

  @Column()
  username: string;

  @Column()
  createdOn: string;

  @Column()
  status: NotificationStatus;
}

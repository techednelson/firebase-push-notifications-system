import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationType } from '../enums';

@Entity()
export class Notification {
  // @ObjectIdColumn()
  // _id: number;
  
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
  user: string;
  
  @Column()
  createdAt: string;
}

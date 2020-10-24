import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscriber {
  // @ObjectIdColumn()
  // _id: number;
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;
  
  @Column()
  token: string;
  
  @Column()
  topic: string;
  
  @Column()
  subscribed: boolean;
}
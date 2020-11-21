import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('subscriber')
@Unique(['username'])
export class Subscriber {

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

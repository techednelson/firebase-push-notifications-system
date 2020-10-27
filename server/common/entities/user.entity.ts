import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('user')
@Unique(['username'])
export class User {
  // @ObjectIdColumn()
  // _id: number;
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;
  
  @Column()
  password: string;
}

import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @ObjectIdColumn()
  _id: string;
  
  @PrimaryColumn()
  id: string;
  
  @Column()
  title: string;
  
  @Column()
  body: string;

  @Column()
  topic: string;
  
  @Column()
  createAt: string;
}
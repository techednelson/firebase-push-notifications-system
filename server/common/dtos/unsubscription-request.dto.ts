import {
  ArrayMinSize,
  IsArray,
} from 'class-validator';

export class UnsubscriptionRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  users: { id: number, token: string }[];
  
  @IsArray()
  @ArrayMinSize(1)
  subscriptions: { topic: string, tokens: string[] }[];
}

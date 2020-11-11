import { ArrayMinSize, IsArray } from 'class-validator';
import { NotificationRequestDto } from './notification-request.dto';

export class MulticastRequestDto {
  
  @IsArray()
  @ArrayMinSize(1)
  subscribers: NotificationRequestDto[];
  
  @IsArray()
  @ArrayMinSize(1)
  tokens: string[];
}

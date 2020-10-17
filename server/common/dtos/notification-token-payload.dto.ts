import { NotificationPayloadDto } from './notification-payload.dto';
import { ArrayMinSize, IsArray, MinLength } from 'class-validator';

export class NotificationTokenPayloadDto extends NotificationPayloadDto {
  
  @IsArray()
  @ArrayMinSize(1)
  @MinLength(4)
  tokens: string[];
  
}

import {
  ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength,
} from 'class-validator';
import { IsNull } from 'typeorm';

export class SubscriptionRequestDto {
  
  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  token: string;
  
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  topic: string;
  
  @IsBoolean()
  subscribed?: boolean;
}

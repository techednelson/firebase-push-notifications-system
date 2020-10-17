import { IsString, MaxLength, MinLength } from 'class-validator';

export class SubscriptionRequestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  topicName: string;
  
  @IsString()
  @MinLength(4)
  tokens: string[];
}

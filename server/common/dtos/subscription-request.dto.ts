import { IsString, MaxLength, MinLength } from 'class-validator';

export class SubscriptionRequestDto {
  
  @IsString() username: string;
  
  @IsString() tokens: string[];
  
  @IsString() @MinLength(4) @MaxLength(20) topicName: string;
}

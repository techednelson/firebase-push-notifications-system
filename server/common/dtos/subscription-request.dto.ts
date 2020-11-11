import {
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SubscriptionRequestDto {
  
  @IsString()
  username: string;
  
  @IsArray()
  @ArrayMinSize(1)
  tokens: string[];
  
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  topic: string;
}

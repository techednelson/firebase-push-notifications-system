import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';


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

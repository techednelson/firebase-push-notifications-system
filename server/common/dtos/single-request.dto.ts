import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { NotificationType } from '../enums';

export class SingleRequestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  title: string;

  @IsString()
  @MinLength(4)
  @MaxLength(250)
  body: string;

  @IsEnum(NotificationType)
  @IsString()
  type: NotificationType;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  topic: string;

  @IsString()
  username: string;

  @IsString()
  token: string;
}

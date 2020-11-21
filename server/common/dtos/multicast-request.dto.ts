import { ArrayMinSize, IsArray } from 'class-validator';
import { SingleRequestDto } from './single-request.dto';

export class MulticastRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  subscribers: SingleRequestDto[];

  @IsArray()
  @ArrayMinSize(1)
  tokens: string[];
}

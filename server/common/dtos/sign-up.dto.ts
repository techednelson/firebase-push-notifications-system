import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '../validators/match';

export class SignUpDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak'}
  ) password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Match(
    'password',
    { message: 'passwords do not match' }
  )
  confirmPassword: string;
}

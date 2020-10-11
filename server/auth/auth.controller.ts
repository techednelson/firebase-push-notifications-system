import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto : AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }
}
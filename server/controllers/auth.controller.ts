import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../common/dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }
  
  @Post('/login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return await this.authService.login(authCredentialsDto);
  }
}

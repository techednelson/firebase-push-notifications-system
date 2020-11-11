import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from '../common/dtos/sign-in-request.dto';
import { SignUpDto } from '../common/dtos/sign-up.dto';
import { SignInResponseDto } from '../common/dtos/sign-in-response.dto';
import JwtRefreshTokenGuard from './guards/jwt-refresh-token.guard';
import { JwtPayload } from '../common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return await this.authService.signUp(signUpDto);
  }
  
  @Post('/login')
  async login(@Body() signInDto: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.authService.login(signInDto);
  }
  
  @UseGuards(JwtRefreshTokenGuard)
  @Post('/refresh')
  refresh(@Body() jwtPayload: JwtPayload): { accessToken: string } {
    const payload = { username: jwtPayload.username };
    const accessToken = this.authService.getAccessToken(payload);
    return { accessToken };
  }
}

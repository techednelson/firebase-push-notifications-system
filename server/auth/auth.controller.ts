import {
  Body,
  Controller, HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../common/dtos/sign-up.dto';
import JwtRefreshTokenGuard from './guards/jwt-refresh-token.guard';
import { Request, Response } from 'express';
import JwtAccessTokenGuard from './guards/jwt-access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return await this.authService.signUp(signUpDto);
  }
  
  @Post('/login')
  async login(@Req() request: Request, @Res() response: Response): Promise<Response> {
    return await this.authService.login(request, response);
  }
  
  @UseGuards(JwtRefreshTokenGuard)
  @Post('/refresh')
  refresh(@Req() request: Request, @Res() response: Response): Promise<Response> {
    return this.authService.renewAccessToken(request, response);
  }
  
  @UseGuards(JwtAccessTokenGuard)
  @Post('log-out')
  async logOut(@Req() request: Request, @Res() response: Response) {
    const { username } = request.body;
    await this.authService.removeRefreshToken(username);
    response.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return response.sendStatus(HttpStatus.OK);
  }
}

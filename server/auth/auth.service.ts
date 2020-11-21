import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/interfaces';
import { SignUpDto } from '../common/dtos/sign-up.dto';
import { Request, Response } from 'express';
import cookie from 'cookie';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { username, password } = signUpDto;
    const user = await this.userRepository.findOne({ username });
    if (user) {
      throw new ConflictException('Username already exists');
    }
    const userEntity = new User();
    try {
      userEntity.username = username;
      userEntity.password = await bcrypt.hash(password, 10);
      userEntity.currentHashedRefreshToken = '';
      await this.userRepository.save(userEntity);
    } catch (error) {
      console.log(error);
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.userRepository.findOne({ username });
    if (user && user.currentHashedRefreshToken) {
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.currentHashedRefreshToken,
      );
      return isRefreshTokenMatching && user;
    } else if (!user) {
      throw new HttpException(
        `${username} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(id, {
      currentHashedRefreshToken,
    });
  }

  private async getRefreshToken(
    payload: JwtPayload,
    id: number,
  ): Promise<string> {
    const refreshToken = this.jwtService.sign(payload, {
      secret: `${process.env.JWT_REFRESH_SECRET_OR_KEY}`,
      expiresIn: 86400,
    });
    await this.setCurrentRefreshToken(refreshToken, id);
    return refreshToken;
  }

  getAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET_OR_KEY}`,
      expiresIn: 900,
    });
  }

  private static setCookies(
    accessToken: string,
    refreshToken?: string,
  ): string[] {
    const cookies = [];
    const accessTokenCookie = cookie.serialize(
      'FCM-ACCESS-TOKEN',
      accessToken,
      {
        httpOnly: true,
        secure: process.env.DEVELOPMENT !== 'development',
        sameSite: 'strict',
        maxAge: 900,
        path: '/',
      },
    );
    cookies.push(accessTokenCookie);
    if (refreshToken) {
      const refreshTokenCookie = cookie.serialize(
        'FCM-REFRESH-TOKEN',
        refreshToken,
        {
          httpOnly: true,
          secure: process.env.DEVELOPMENT !== 'development',
          sameSite: 'strict',
          maxAge: 86400,
          path: '/',
        },
      );
      cookies.push(refreshTokenCookie);
    }
    return cookies;
  }

  async login(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const { username, password } = request.body;
    const user = await this.userRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = this.getAccessToken(payload);
      const refreshToken = await this.getRefreshToken(payload, user.id);
      response.setHeader(
        'Set-Cookie',
        AuthService.setCookies(accessToken, refreshToken),
      );
      return response.sendStatus(HttpStatus.OK);
    } else if (!user) {
      throw new HttpException(
        `${username} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async renewAccessToken(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const { username } = request.body;
    const accessToken = this.getAccessToken({ username });
    response.setHeader('Set-Cookie', AuthService.setCookies(accessToken));
    return response.sendStatus(HttpStatus.OK);
  }

  getCookiesForLogOut(): string[] {
    return [
      'FCM-ACCESS-TOKEN=; HttpOnly; Path=/; Max-Age=0',
      'FCM-REFRESH-TOKEN=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async removeRefreshToken(username: string) {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException(`${username} was not found`);
    }
    return this.userRepository.update(user.id, {
      currentHashedRefreshToken: '',
    });
  }

  async isAdminUser(): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .limit(1)
      .getOne();
    return !!user;
  }
}

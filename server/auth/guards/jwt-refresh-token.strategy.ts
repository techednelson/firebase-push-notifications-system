import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../common/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request && request.cookies && request.cookies['FCM-REFRESH-TOKEN'],
      ]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_REFRESH_SECRET_OR_KEY}`,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const refreshToken =
      request && request.cookies && request.cookies['FCM-REFRESH-TOKEN'];
    console.log(username);
    console.log(refreshToken);
    const user = await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      username,
    );
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

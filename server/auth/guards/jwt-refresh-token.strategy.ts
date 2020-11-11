import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../common/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('fcm_refresh_token'),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_REFRESH_SECRET_OR_KEY}`,
      passReqToCallback: true
    });
  }
  
  async validate(request: Request, payload: JwtPayload): Promise<User> {
    const { username } = payload;
    // @ts-ignore
    const refreshToken= request.headers['fcm_refresh_token'];
    const user = await this.authService.getUserIfRefreshTokenMatches(refreshToken, username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

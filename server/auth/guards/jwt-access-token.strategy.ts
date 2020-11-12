import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../common/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) =>
        request && request.cookies && request.cookies['FCM-ACCESS-TOKEN']
      ]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET_OR_KEY}`,
    });
  }
  
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

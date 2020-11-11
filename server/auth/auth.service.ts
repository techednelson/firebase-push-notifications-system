import {
  ConflictException, HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { Repository } from 'typeorm';
import { SignInRequestDto } from '../common/dtos/sign-in-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/interfaces';
import { SignUpDto } from '../common/dtos/sign-up.dto';
import { SignInResponseDto } from '../common/dtos/sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {
  }
  
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
        user.currentHashedRefreshToken
      );
     return isRefreshTokenMatching && user;
    } else if (!user) {
      throw new HttpException(`${username} does not exist`, HttpStatus.NOT_FOUND);
    }
  }
  
  private async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(id, {
      currentHashedRefreshToken
    });
  }
  
  getAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET_OR_KEY}`,
      expiresIn: 900
    });
  }
  
  private getRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: `${process.env.JWT_REFRESH_SECRET_OR_KEY}`,
      expiresIn: `1d`,
    });
  }
  
  async login(signInDto: SignInRequestDto): Promise<SignInResponseDto> {
    const { username, password } = signInDto;
    const user = await this.userRepository.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { username };
      const accessToken = this.getAccessToken(payload);
      const refreshToken = this.getRefreshToken(payload);
      await this.setCurrentRefreshToken(refreshToken, user.id );
      return { accessToken, refreshToken };
    } else if (!user) {
      throw new HttpException(`${username} does not exist`, HttpStatus.NOT_FOUND);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  
  async isAdminUser(): Promise<boolean> {
    const user = await this.userRepository
    .createQueryBuilder('user')
        .limit(1)
        .getOne();
    return !!user;
  }
}

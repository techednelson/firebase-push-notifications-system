import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../common/dtos/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });
    if (user) {
      throw new ConflictException('Username already exists');
    }
    const userEntity = new User();
    try {
      userEntity.username = username;
      userEntity.password = await bcrypt.hash(password, 10);
      await this.userRepository.save(userEntity);
    } catch (error) {
      console.log(error);
    }
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });
    const isUserValid = user && (await bcrypt.compare(password, user.password));

    if (!isUserValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async createRootUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const user = await this.userRepository.findOne({
      username: authCredentialsDto.username,
    });
    if (!Boolean(user)) {
      await this.signUp(authCredentialsDto);
      return `Root User ${authCredentialsDto.username} was created`;
    }
    return ``;
  }
}

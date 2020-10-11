import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp(authCredentialsDto : AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ username });
    if (user) {
      throw new ConflictException('Username already exist');
    }
    const userEntity = new User();
    try {
      userEntity.salt = await bcrypt.gsalt();
      userEntity.username = username;
      userEntity.password = bcrypt.hash(password, userEntity.salt);
      await this.userRepository.save(userEntity);
    } catch (error) {
      console.log(error);
    }
  }

}

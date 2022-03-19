import {
  ConflictException,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CookieOptions } from 'express';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../users/entities/user.entity';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegistrationDto } from '../dto/user-registration.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger: LoggerService = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(registrationDto: UserRegistrationDto): Promise<User> {
    const user = await this.userRepository.getUserByEmail(
      registrationDto.email,
    );
    if (user) {
      this.logger.error(
        `User already exists with email: ${registrationDto.email}`,
      );
      throw new ConflictException(`User with such email is already exists`);
    }

    registrationDto.password = await bcrypt.hash(
      registrationDto.password,
      await bcrypt.genSalt(),
    );

    return await this.userRepository.createUser(registrationDto);
  }

  public async signIn(loginDto: UserLoginDto): Promise<User> {
    const { email, password } = loginDto;
    const user = await this.userRepository.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new ConflictException('Wrong password');
    }
  }

  public async getAccessToken(user: User): Promise<string> {
    const { email, userName } = user;
    const payload: JwtPayload = { email, userName };
    console.log(payload);
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });
  }

  public async getAccessTokenCookieOptions(): Promise<CookieOptions> {
    return {
      expires: new Date(
        new Date().getTime() + this.configService.get('JWT_EXPIRATION_TIME'),
      ),
      maxAge: parseInt(this.configService.get('JWT_EXPIRATION_TIME')) * 1000,
    };
  }

  public async getSignOutCookieOptions(): Promise<CookieOptions> {
    return {
      maxAge: 0,
    };
  }
}

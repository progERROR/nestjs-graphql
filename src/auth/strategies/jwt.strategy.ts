import {
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../repositories/user.repository';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: LoggerService = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['access-token'];
        },
        ExtractJwt.fromHeader('Authorization'),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { email } = payload;
    this.logger.log(`Validating User with email: ${email}`);
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      this.logger.error(`Failed validation for User with email: ${email}`);
      throw new UnauthorizedException('User is unauthorized!');
    }

    this.logger.log(`Successfully validated User with email: ${email}`);
    return user;
  }
}

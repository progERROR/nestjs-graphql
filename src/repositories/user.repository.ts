import {
  Logger,
  LoggerService,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserRegistrationDto } from '../auth/dto/user-registration.dto';
import { User } from '../users/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger: LoggerService = new Logger(UserRepository.name);

  constructor() {
    super();
  }

  public async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.findOne({
        email: email,
      });
    } catch (e) {
      throw new NotFoundException('User with such email doesn`t excists.');
    }
  }

  public async getUserById(userId: string): Promise<User> {
    try {
      return await this.findOne(userId);
    } catch (e) {
      throw new NotFoundException('User with such id doesn`t excists.');
    }
  }

  public async createUser(createUserDto: UserRegistrationDto): Promise<User> {
    const user: User = new User();
    user.userName = createUserDto.userName;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    try {
      return await this.save(user);
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }
}

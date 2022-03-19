import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger: LoggerService = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.log(
      `Method[${
        context.getHandler().name
      }] Required roles: [${requiredRoles.join(',')}]`,
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user);

    if (user) {
      this.logger.log(`User<${user.id}> has role: [${user.role}]`);

      const permission = requiredRoles.some((role) => user.role == role);
      this.logger.log(
        `Access for User<${user.id}> is ${permission ? 'ALLOWED' : 'DENIED'}`,
      );

      return permission;
    }

    return false;
  }
}

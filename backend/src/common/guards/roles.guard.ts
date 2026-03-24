import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator'
import { Role } from 'src/generated/prisma/enums'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return requiredRoles.includes(user.role)
  }
}

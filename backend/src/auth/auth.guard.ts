import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './decorators/public.decorator'
import { JwtPayload } from './types/jwtPayload.type'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = this.extractTokenFromHeader(request)

    if (!token) throw new UnauthorizedException('Token não encontrado')

    try {
      const payload: JwtPayload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET') ?? 'fallback-dev'
      })

      request['user'] = payload
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

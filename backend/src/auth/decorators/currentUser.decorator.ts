import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from '../types/jwtPayload.type'

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as JwtPayload
    return data ? user[data] : user
  }
)

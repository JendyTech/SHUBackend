import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { IUser } from '@/interfaces/User'

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request?.user as IUser
  },
)

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request?.token
  },
)

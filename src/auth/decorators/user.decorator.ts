import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Предполагается, что пользователь добавляется в запрос после аутентификации
    return data ? user[data] : user; // Возвращает либо весь объект пользователя, либо конкретное поле
  },
);

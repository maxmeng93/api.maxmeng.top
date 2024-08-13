import { Observable } from 'rxjs';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './constants';

/**
 * jwt守卫，用于验证token，确定用户是否有权限访问接口
 * 如果接口上有@Public()装饰器，则不会验证token
 * 如果是开发环境，则不会验证token
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // // 如果是开发环境，直接返回true，不需要验证token
    // // 但是会导致 @Request() req: Request 无法获取到用户信息
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    console.log('isPublic', isPublic);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

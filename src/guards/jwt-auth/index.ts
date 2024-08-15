import { Observable } from 'rxjs';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/constants';

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

    if (isPublic) {
      return true;
    }

    // 如果是开发环境，根据环境变量决定是否验证token
    // 但是会导致 @Request() req: Request 无法获取到用户信息
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.SKIP_JWT_AUTH === 'true'
    ) {
      return true;
    }

    return super.canActivate(context);

    // 增加自定义校验逻辑
    // 例如：根据用户 ID 查询用户信息，判断用户是否被禁用
    // return super.canActivate(context).pipe(
    //   switchMap((isAuthenticated) => {
    //     if (!isAuthenticated) {
    //       return throwError(() => new UnauthorizedError());
    //     }

    //     // 从 req 中获取用户 ID，根据用户 ID 查询用户信息
    //     const userId = context.switchToHttp().getRequest().user.userId;
    //     return this.userService.getUserById(userId).pipe(
    //       switchMap((user) => {
    //         if (!user || user.isDisabled) {
    //           return throwError(() => new UnauthorizedError());
    //         }
    //         return true;
    //       }),
    //     );
    //   }),
    // );
  }
}

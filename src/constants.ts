import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const IS_PUBLIC_KEY = 'isPublic';
// 公开接口，不需要授权，但是需要登录
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
// 指定角色才能访问的接口
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
// 只有角色"MAX"才能访问的接口
export const OnlyMaxRole = () => SetMetadata(ROLES_KEY, UserRole.MAX);

export const jwtConstants = {
  // jwt 密钥，不应该明文写在代码中，而是应该通过环境变量传入
  secret: '1234567890!@#$%^&*()',
};

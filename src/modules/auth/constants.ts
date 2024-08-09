import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtSecret = {
  // jwt 密钥，不应该明文写在代码中，而是应该通过环境变量传入
  secret: '1234567890!@#$%^&*()',
};

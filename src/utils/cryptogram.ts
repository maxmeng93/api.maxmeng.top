import * as crypto from 'crypto';

/**
 * 生成随机盐
 * @returns 盐
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * 密码加密
 * @param password 密码
 * @param salt 盐
 * @returns 加密后的密码
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) return '';
  const tempSalt = Buffer.from(salt, 'base64');

  // 10000 代表迭代次数，16代表长度
  return crypto
    .pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1')
    .toString('base64');
}

import * as bcrypt from 'bcrypt';

/**
 * 密码加密
 * @param password 密码
 * @returns 加密后的密码
 */
export async function encryptPassword(password: string): Promise<string> {
  const roundsOfHashing = 10;
  return await bcrypt.hash(password, roundsOfHashing);
}

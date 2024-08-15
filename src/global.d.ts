/**
 * JWT 携带的参数
 */
interface JwtPayload {
  sub: string;
  username: string;
  role: string;
}

/**
 * 请求携带的用户信息
 */
interface RequestUser extends Omit<JwtPayload, 'sub'> {
  userId: string;
}

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

/**
 * 分页参数
 */
interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * 分页数据
 */
interface PageData<T> extends Pagination {
  list: T[];
}

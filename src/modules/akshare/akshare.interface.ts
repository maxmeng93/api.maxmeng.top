export interface AkshareResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

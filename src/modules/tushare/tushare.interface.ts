export interface TushareRequest {
  api_name: string;
  token: string;
  params: Record<string, any>;
  fields?: string;
}

export interface TushareResponse<T = any> {
  code: number;
  msg: string;
  data: {
    fields: string[];
    items: any[][];
  };
}

export interface TushareApiResult<T = any> {
  code: number;
  message: string;
  data: T;
}

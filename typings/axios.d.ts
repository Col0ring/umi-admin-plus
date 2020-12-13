export * from 'axios';

interface ResponseData<T = GlobalObject> {
  code: number;
  msg: string;
  data: T;
  [key: string]: any;
}

declare module 'axios' {
  export interface AxiosInstance {
    <T, R = ResponseData<T>>(config: AxiosRequestConfig): Promise<R>;
    request<T = any, R = ResponseData<T>>(
      config: AxiosRequestConfig,
    ): Promise<R>;
    get<T = any, R = ResponseData<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    delete<T = any, R = ResponseData<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    head<T = any, R = ResponseData<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    options<T = any, R = ResponseData<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    post<T = any, R = ResponseData<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    put<T = any, R = ResponseData<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<R>;
    patch<T = any, R = ResponseData<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<R>;
  }
}

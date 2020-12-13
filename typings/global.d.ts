// global module
import { Canceler } from 'axios';
interface CanceledRequest {
  url?: string;
  cancel: Canceler;
}

declare global {
  interface Window {
    _axiosPromiseArr?: CanceledRequest[];
  }

  type Item<T> = T extends Array<infer U> ? U : T;

  interface GlobalObject<T = any> {
    [prop: string]: T;
  }
  // Record<string, T>

  type Api<T = any> = Promise<T | false>;
}

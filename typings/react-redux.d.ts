import { Loading, PermissionModelState, LayoutModelState } from 'umi';

declare module 'react-redux' {
  export interface DefaultRootState {
    loading: Loading;
    permission: PermissionModelState;
    layout: LayoutModelState;
    [key: string]: any;
  }
}

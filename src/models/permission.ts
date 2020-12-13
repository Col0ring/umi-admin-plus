import { routerRedux } from 'dva';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { Model } from '@/interfaces/Model';
import { UserProps } from '@/interfaces/Data';
import {
  reqLoginByPassword,
  reqLoginByCode,
  reqGetUserInfo,
} from '@/services/user';

export interface PermissionModelState {
  isLogin: boolean;
  roles: string[];
  token: string | null;
  user: UserProps | null;
}

const permissionModel: Model<PermissionModelState> = {
  namespace: 'permission',
  state: {
    roles: [],
    isLogin: !!getToken(),
    user: null,
    token: getToken(),
  },
  reducers: {
    setToken(state, { token }) {
      return { ...state!, token: token!, isLogin: !!token };
    },
    setUser(state, { user }) {
      return { ...state!, user: user! };
    },
    setRoles(state, { roles }) {
      return { ...state!, roles: roles! };
    },
  },
  effects: {
    *login({ payload }, { call, put }) {
      let res;
      if (payload.type === 'password') {
        res = yield call(reqLoginByPassword, payload.data);
      } else if (payload.type === 'code') {
        res = yield call(reqLoginByCode, payload.data);
      }
      if (res) {
        yield put({
          type: 'setToken',
          token: res.token,
        });
        setToken(res.token);
        yield put(routerRedux.push(payload.redirect || '/'));
      }
    },
    *getUserInfo(action, { call, put }) {
      const res = yield call(reqGetUserInfo);
      if (res) {
        yield put({
          type: 'setRoles',
          roles: res.roles,
        });
        yield put({
          type: 'setUser',
          user: res.user,
        });
      }
    },
    *resetUser(action, { put }) {
      // request
      yield put({
        type: 'setToken',
        token: '',
      });

      removeToken();
      yield put({
        type: 'setUser',
        user: null,
      });
    },
  },
};

export default permissionModel;

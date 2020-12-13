import { UserProps } from '@/interfaces/Data';
import { AxiosPromise } from 'axios';
import request from '@/utils/request';

export function reqLoginByPassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return request<{ token: string }>({
    url: '/login/password',
    method: 'post',
    data: {
      username,
      password,
    },
  });
}

export function reqGetAuthCode(phone: string): Api<{ authCode: string }> {
  return request({
    url: '/getAuthCode',
    params: {
      phone,
    },
  });
}

export function reqLoginByCode({
  phone,
  code,
}: {
  phone: string;
  code: string;
}): Api<{ token: string }> {
  return request({
    url: '/login/code',
    method: 'post',
    data: {
      phone,
      code,
    },
  });
}

export function reqGetUserInfo(): Api<
  AxiosPromise<{
    user: UserProps;
  }>
> {
  return request({
    url: '/getUserInfo',
  });
}

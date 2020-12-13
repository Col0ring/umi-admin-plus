const authKey = 'umi-admin-plus-auth-key';

export function getToken(): string {
  return localStorage.getItem(authKey) || '';
}

export function setToken(token: string): void {
  localStorage.setItem(authKey, token);
}
export function removeToken(): void {
  localStorage.removeItem(authKey);
}

import Cookies from 'js-cookie';

const TokenKey = 'access_token';

const ExpiresInKey = 'expires_in';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string, expires?: number) {
  return expires
    ? Cookies.set(TokenKey, token, {
      expires: new Date(new Date().getTime() + expires * 1000),
    })
    : Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1;
}

export function setExpiresIn(time: string) {
  return Cookies.set(ExpiresInKey, time);
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey);
}

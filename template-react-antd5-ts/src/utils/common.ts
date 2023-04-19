import { forEach } from 'lodash-es';

const goLogin = () => {
  const hash = location.hash.split('#');
  const redirectUrl = hash?.[1] ? hash[1] : location.pathname;
  if (!redirectUrl.includes('/login')) {
    return (location.href = `/login?redirect=${encodeURIComponent(
      `${redirectUrl}${location.search}`
    )}`);
  }
};

// 数字前添加0
const pad = (num: number) => {
  const paddedNum = num.toString().padStart(2, '0');
  return paddedNum;
}

export { goLogin, pad };
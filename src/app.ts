import { getDvaApp } from 'umi';
import { message } from 'antd';
import setting from '@/setting';
import { MathRoutes } from './interfaces/Layout';
let store: GlobalObject;

export const dva = {
  config: {
    onError(e: Error) {
      message.error(e.message);
    },
  },
};

export function onRouteChange({ matchedRoutes, location }: GlobalObject) {
  if (!store) {
    store = getDvaApp()._store;
  }

  if (setting.autoGetTitle && matchedRoutes.length) {
    const currentRoute = matchedRoutes[matchedRoutes.length - 1].route;
    let title = currentRoute.title || currentRoute.name;
    title = (title ? title + ' - ' : '') + setting.title;
    document.title = title;
  } else {
    document.title = setting.title;
  }
  let flag = false;
  matchedRoutes = matchedRoutes
    .filter(({ route }: MathRoutes) => {
      if (flag) {
        return true;
      }
      if (
        ((route.component as unknown) as GlobalObject)?.name === 'AccessLayout'
      ) {
        flag = true;
      }
      return false;
    })
    .map(({ route, match }: MathRoutes) => {
      route.realPath = route.displayPath || match.url;
      route.keeperKey = route.keepAlive?.name || route.realPath;
      return {
        route,
        match,
      };
    });
  store.dispatch({
    type: 'layout/getLayoutData',
    payload: matchedRoutes,
    location,
  });
}

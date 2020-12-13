import { matchPath } from 'umi';
import { Model } from '@/interfaces/Model';
import { LayoutData, MathRoutes } from '@/interfaces/Layout';

function pushTabPane(
  tabPanes: LayoutData['tabPanes'],
  pane: Item<LayoutData['tabPanes']>,
  path: string,
): LayoutData['tabPanes'] {
  pane = { ...pane } as Item<LayoutData['tabPanes']>;
  pane.route = { ...pane.route };
  pane.route.realPath = path;
  const idx = tabPanes.findIndex(item =>
    matchPath(item.route.realPath, {
      path: path,
      exact: true,
    }),
  );
  if (idx === -1) {
    return [...tabPanes, pane];
  }
  const clone = [...tabPanes];
  clone.splice(idx, 1, pane);
  return clone;
}

export interface LayoutModelState extends LayoutData {}

const layoutModel: Model<LayoutModelState> = {
  namespace: 'layout',
  state: {
    selectedKey: '',
    collapsed: false,
    breadcrumbs: [],
    openKeys: [],
    tabPanes: [],
    tabKey: '',
  },
  reducers: {
    setSelectedKey(state, { selectedKey }) {
      return { ...state!, selectedKey: selectedKey! };
    },
    setCollapsed(state, { collapsed }) {
      return { ...state!, collapsed: collapsed! };
    },
    setBreadcrumbs(state, { breadcrumbs }) {
      return { ...state!, breadcrumbs: breadcrumbs! };
    },
    setOpenKeys(state, { openKeys }) {
      return { ...state!, openKeys: openKeys! };
    },
    pushTabPane(state, { tabPane, path }) {
      const currentTabPanes = pushTabPane(state!.tabPanes, tabPane, path);
      return { ...state!, tabPanes: currentTabPanes };
    },
    setTabPanes(state, { tabPanes }) {
      return { ...state!, tabPanes: tabPanes! };
    },
    setTabKey(state, { tabKey }) {
      return { ...state!, tabKey: tabKey! };
    },
  },
  effects: {
    *getLayoutData({ payload, location }, { put, select }) {
      if (payload.length === 0) {
        return;
      }
      const openKeys = payload.map(({ route }: MathRoutes) => route.realPath);
      const currentMatched = payload[payload.length - 1];
      const currentRoute = currentMatched.route;
      const selectedKey = currentRoute.displayPath || currentRoute.path;

      yield put({
        type: 'setSelectedKey',
        selectedKey,
      });
      yield put({
        type: 'setOpenKeys',
        openKeys,
      });
      yield put({
        type: 'setBreadcrumbs',
        breadcrumbs: payload,
      });
      yield put({
        type: 'pushTabPane',
        tabPane: currentMatched,
        path: location.pathname + location.search,
      });
      yield put({
        type: 'setTabKey',
        tabKey: location.pathname + location.search,
      });
    },
  },
};

export default layoutModel;

import { matchPath } from 'umi';
import { Model } from '@/interfaces/Model';
import { LayoutData, MatchedRoutes } from '@/interfaces/Layout';

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
    matchedRoutes: [],
    inLayout: false,
    isNotFound: false,
  },
  reducers: {
    setInLayout(state, { inLayout }) {
      return { ...state!, inLayout: inLayout! };
    },
    setMatchedRoutes(state, { matchedRoutes }) {
      return { ...state!, matchedRoutes: matchedRoutes! };
    },
    setIsNotFound(state, { isNotFound }) {
      return { ...state!, isNotFound: isNotFound! };
    },
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
    *getLayoutData(
      { payload, originPayload, location, inLayout },
      { put, select },
    ) {
      // if in AccessLayout
      yield put({
        type: 'setInLayout',
        inLayout,
      });
      yield put({
        type: 'setMatchedRoutes',
        matchedRoutes: originPayload,
      });

      const currentRoute = originPayload[originPayload.length - 1]?.route;
      const isNotFound =
        currentRoute && (!currentRoute.path || currentRoute.path === '*');

      yield put({
        type: 'setIsNotFound',
        isNotFound,
      });

      if (payload.length === 0) {
        return;
      }
      const openKeys = payload.map(
        ({ route }: MatchedRoutes) => route.realPath,
      );
      const currentLayoutMatched = payload[payload.length - 1];
      const currentLayoutRoute = currentLayoutMatched.route;
      const selectedKey =
        currentLayoutRoute.displayPath || currentLayoutRoute.path;

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
        tabPane: currentLayoutMatched,
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

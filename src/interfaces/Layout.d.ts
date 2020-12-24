import { IRoute } from 'umi';
import { match } from 'react-router-dom';
export type LayoutRoute = IRoute & {
  name?: string;
  icon?: string;
  displayPath?: string;
  redirect?: string;
  externalPath?: string;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;

  tabName?: string;
  hideInTabs?: boolean;

  hideInBreadcrumbs?: boolean;
  breadcrumbPath?: string;
  breadcrumbName?: string;

  roles?: string[];

  keepAlive?: {
    name?: string;
    id?: string;
    [key: string]: any;
  };
};

export interface MatchedRoutes {
  route: LayoutRoute & {
    realPath: string;
    keeperKey: string;
  };
  match: match<GlobalObject>;
}

export interface LayoutData {
  selectedKey: string;
  collapsed: boolean;
  breadcrumbs: MatchedRoutes[];
  tabPanes: MatchedRoutes[];
  tabKey: string;
  openKeys: string[];
  matchedRoutes: MatchedRoutes[];
  inLayout: boolean;
  isNotFound: boolean;
}

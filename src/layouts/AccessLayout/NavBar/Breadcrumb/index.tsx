import React, { memo } from 'react';
import { Link, matchPath } from 'umi';
import classnames from 'classnames';
import { Breadcrumb } from 'antd';
import TotalIcons from '@/components/TotalIcons';
import { urlReg } from '@/utils/validators';
import { LayoutData } from '@/interfaces/Layout';
import styles from './index.less';

interface BreadcrumbContent {
  icon?: string;
  name?: string;
}

const BreadcrumbContent: React.FC<BreadcrumbContent> = ({ icon, name }) => {
  return (
    <>
      {icon && <TotalIcons style={{ marginRight: 5 }} name={icon} />}
      {name}
    </>
  );
};

export interface BreadCrumbsProps {
  breadcrumbs: LayoutData['breadcrumbs'];
  pathname: string;
}

const Breadcrumbs: React.FC<BreadCrumbsProps> = ({ breadcrumbs, pathname }) => {
  const len = breadcrumbs.length;
  return (
    <Breadcrumb className={styles.breadcrumbs}>
      {breadcrumbs.map((breadcrumb, index) => {
        const { route } = breadcrumb;
        let breadcrumbPath = route.breadcrumbPath || route.realPath;

        const breadcrumbName = route.breadcrumbName || route.name;

        const isMathPath = matchPath(pathname, {
          path: breadcrumbPath,
          exact: true,
        });

        const isExternalPath = urlReg.test(breadcrumbPath);

        const itemClassName = classnames(styles.breadcrumb, {
          [styles.notAllowed]: breadcrumbPath === pathname,
          [styles.active]: index === len - 1,
        });

        const renderItem = () => {
          // 外链
          if (isExternalPath) {
            return (
              <a
                href={breadcrumbPath}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BreadcrumbContent icon={route.icon} name={breadcrumbName} />
              </a>
            );
          }

          // 当前路由
          if (isMathPath || index === len - 1) {
            return (
              <span>
                <BreadcrumbContent icon={route.icon} name={breadcrumbName} />
              </span>
            );
          }

          // 可跳转路由
          return (
            <Link replace to={breadcrumbPath}>
              <BreadcrumbContent icon={route.icon} name={breadcrumbName} />
            </Link>
          );
        };

        return route.hideInBreadcrumbs || !breadcrumbName ? null : (
          <Breadcrumb.Item key={breadcrumbPath}>
            <span className={itemClassName}>{renderItem()}</span>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default memo(Breadcrumbs);

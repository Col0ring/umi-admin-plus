import { useCallback } from 'react';
import { useHistory, useAliveController } from 'umi';
import pathToRegexp from 'path-to-regexp';
import { LayoutData } from '@/interfaces/Layout';
import useLayout from '@/hooks/useLayout';

const useCloseTab = (tabPanes: LayoutData['tabPanes'], path: string) => {
  const history = useHistory();
  const { setTabPanes } = useLayout();
  const { dropScope } = useAliveController();
  const close = useCallback(
    (key: string) => {
      const currentIndex = tabPanes.findIndex(
        pane => pane.route.realPath === key,
      );
      const keeperKey = pathToRegexp(tabPanes[currentIndex].route.keeperKey);
      const currentPanes = tabPanes.filter(pane => pane.route.realPath !== key);
      if (currentPanes.length === 0) {
        setTabPanes(currentPanes);
        const unListen = history.listen(() => {
          unListen && unListen();
          setTimeout(() => {
            dropScope(keeperKey);
          }, 60);
        });
        history.push('/');
      } else {
        setTabPanes(currentPanes);
        if (key === path) {
          const unListen = history.listen(() => {
            unListen && unListen();
            setTimeout(() => {
              dropScope(keeperKey);
            }, 60);
          });
          if (currentIndex === currentPanes.length) {
            history.push(currentPanes[currentIndex - 1].route.realPath);
          } else {
            history.push(currentPanes[currentIndex].route.realPath);
          }
        } else {
          dropScope(keeperKey);
        }
      }
    },
    [tabPanes, path],
  );
  return close;
};

export default useCloseTab;

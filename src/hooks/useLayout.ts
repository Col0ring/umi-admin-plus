import { LayoutData } from '@/interfaces/Layout';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'umi';

const useLayout = () => {
  const layoutData = useSelector(({ layout }) => layout);
  const dispatch = useDispatch();
  const setCollapsed = useCallback(
    (collapsed: boolean) => {
      dispatch({
        type: 'layout/setCollapsed',
        collapsed,
      });
    },
    [dispatch],
  );
  const setTabPanes = useCallback(
    (tabPanes: LayoutData['tabPanes']) => {
      dispatch({
        type: 'layout/setTabPanes',
        tabPanes,
      });
    },
    [dispatch],
  );
  return { ...layoutData, setCollapsed, setTabPanes };
};

export default useLayout;

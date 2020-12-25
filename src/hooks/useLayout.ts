import { LayoutData } from '@/interfaces/Layout';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'umi';

const useLayout = () => {
  const { layout, loading } = useSelector(({ layout, loading }) => ({
    layout,
    loading: loading.effects['layout/getLayoutData'],
  }));
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
  return { ...layout, loading, setCollapsed, setTabPanes };
};

export default useLayout;

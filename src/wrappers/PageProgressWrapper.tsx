import React, { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useLayout from '@/hooks/useLayout';
// NProgress.configure({ showSpinner: false });

const PageProgressWrapper: React.FC = ({ children }) => {
  const location = useLocation();
  const { loading } = useLayout();
  const [preLocation, setPreLocation] = useState<typeof location | null>(null);
  if (location !== preLocation) {
    NProgress.start();
    setPreLocation(location);
  }
  useEffect(() => {
    if (!loading) {
      NProgress.done();
    }
  }, [location, loading]);
  return <>{children}</>;
};

export default PageProgressWrapper;

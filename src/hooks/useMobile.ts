import { useState, useEffect } from 'react';
import setting from '@/setting';

const width = setting.mobile;

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth >= width);
  function updateState() {
    setIsMobile(window.innerWidth >= width);
  }
  useEffect(() => {
    window.addEventListener('resize', updateState);
    return () => {
      window.removeEventListener('resize', updateState);
    };
  }, []);
  return isMobile;
};

export default useMobile;

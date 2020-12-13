import React from 'react';
import { Layout } from 'antd';

const MainContent: React.FC = ({ children }) => {
  return <Layout.Content className="app-container">{children}</Layout.Content>;
};

export default MainContent;

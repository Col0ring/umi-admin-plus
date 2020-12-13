import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'umi';
const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，您当前的页面不存在。"
    extra={
      <Link to="/">
        <Button type="primary">回到首页</Button>
      </Link>
    }
  />
);

export default NoFoundPage;

import type React from 'react';
import { Card } from 'antd';
import { WithPermission } from '../components/WithPermission';

const DashboardWithPerm: React.FC = () => {
  return (
    <WithPermission requirePerm="template:read">
      <Card>这是一个需要 template:read 权限才能看到的卡片</Card>
    </WithPermission>
  );
};

export default DashboardWithPerm;

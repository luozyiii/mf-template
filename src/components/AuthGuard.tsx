import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { AuthUtils } from '../utils/authUtils';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // 检查是否已登录
      if (!AuthUtils.isAuthenticated()) {
        // 未登录，跳转到登录页面
        AuthUtils.redirectToLogin();
        return;
      }

      setIsChecking(false);
    };

    // 延迟检查，避免闪烁
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" spinning={true} tip="正在验证身份...">
          <div style={{ minHeight: '200px' }} />
        </Spin>
      </div>
    );
  }

  return <>{children}</>;
};

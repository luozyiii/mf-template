import { Spin } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { AuthUtils } from '../utils/authUtils';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // 简化的认证检查 - 独立运行时只需要检查 AuthUtils
        const isAuthenticated = AuthUtils.isAuthenticated();

        console.log('AuthGuard: Authentication check result:', isAuthenticated);

        if (!isAuthenticated) {
          console.log('AuthGuard: User not authenticated, redirecting to login');
          AuthUtils.redirectToLogin();
          return;
        }

        console.log('AuthGuard: User authenticated successfully');
        setIsChecking(false);
      } catch (error) {
        console.warn('AuthGuard: Error during auth check:', error);
        // 发生错误时直接跳转到登录页面
        AuthUtils.redirectToLogin();
      }
    };

    // 短暂延迟检查，避免闪烁
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="auth-guard-loading">
        <Spin size="large" spinning={true} tip="正在验证身份...">
          <div
            style={{
              minHeight: '60px',
              minWidth: '60px',
            }}
          />
        </Spin>
      </div>
    );
  }

  return <>{children}</>;
};

import { Spin } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { AuthUtils } from '../utils/authUtils';
import { getStoreValue } from 'mf-shared/store';
interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // 检查是否已登录：优先看 globalStore（token），其次旧逻辑
        const tokenFromStore = getStoreValue<string>('token');
        if (!tokenFromStore && !AuthUtils.isAuthenticated()) {
          // 未登录，跳转到登录页面
          AuthUtils.redirectToLogin();
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.warn('AuthGuard: Error during auth check:', error);
        // 发生错误时，仍然尝试使用AuthUtils检查
        if (!AuthUtils.isAuthenticated()) {
          AuthUtils.redirectToLogin();
          return;
        }
        setIsChecking(false);
      }
    };

    // 延迟检查，避免闪烁
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

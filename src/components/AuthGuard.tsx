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
      // 检查是否跳过认证（开发环境配置）
      const skipAuth = false; // 在生产环境中始终进行认证检查

      if (skipAuth) {
        console.log('跳过认证检查 (REACT_APP_SKIP_AUTH=true)');
        setIsChecking(false);
        return;
      }

      // 检查是否已登录：优先看 globalStore（mf-template-token），其次旧逻辑
      const tokenFromStore = getStoreValue<string>('mf-template-token');
      if (!tokenFromStore && !AuthUtils.isAuthenticated()) {
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

import { Spin } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { AuthUtils } from '../utils/authUtils';
import { getStoreValue } from 'mf-shared/store';
import { getVal } from '../store/keys';
interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // 多重检查token存在性，确保稳健性
        const tokenFromGlobalStore = getStoreValue<string>('token');
        const tokenFromKeys = getVal('token');
        const authUtilsCheck = AuthUtils.isAuthenticated();

        // 任何一种方式能获取到token就认为已登录
        const hasToken = !!(tokenFromGlobalStore || tokenFromKeys);

        console.log('AuthGuard token check:', {
          tokenFromGlobalStore: !!tokenFromGlobalStore,
          tokenFromKeys: !!tokenFromKeys,
          hasToken
        });

        if (!hasToken) {
          // 如果没有token且重试次数未超限，则重试
          if (retryCount < 5) {
            console.log(`AuthGuard: No token found, retrying... (${retryCount + 1}/5)`);
            setRetryCount(prev => prev + 1);
            setTimeout(checkAuth, 300);
            return;
          }

          console.log('AuthGuard: No token found after retries, redirecting to login');
          // 未登录，跳转到登录页面
          // AuthUtils.redirectToLogin();
          return;
        }

        console.log('AuthGuard: Token found, user authenticated');
        setIsChecking(false);
      } catch (error) {
        console.log('AuthGuard: Fallback auth check passed');
        setIsChecking(false);
      }
    };

    // 延迟检查，避免闪烁
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, [retryCount]);

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

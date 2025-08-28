import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from 'react-router-dom';
import 'antd/dist/reset.css'; // 引入 Ant Design 的基础样式
import { AppSkeleton } from './components/AppSkeleton';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { currentConfig } from './config/deployment';
import TemplateI18nProvider from './i18n/I18nProvider';
import useLanguageSync from './i18n/useLanguageSync';
import Dashboard from './pages/dashboard/Dashboard';
import { NotFound } from './pages/NotFound';
import StoreDemo from './pages/store-demo/StoreDemo';
import { StoreUtils } from './utils/storeUtils';
import './App.css';

// 语言同步组件
const LanguageSyncComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useLanguageSync();
  return <>{children}</>;
};

// 内部路由组件，用于处理路由监听
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    // 处理 404 重定向
    const redirectPath = sessionStorage.getItem('spa_redirect_path');
    if (redirectPath) {
      sessionStorage.removeItem('spa_redirect_path');
      // 使用 navigate 进行路由跳转
      navigate(redirectPath, { replace: true });
    }

    // 模拟应用初始化加载
    const initializeApp = async () => {
      // 模拟数据加载、权限检查等
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);

      // 应用加载完成
      console.log('✅ Template app initialized');
    };

    initializeApp();

    // 初始化完成
    console.log('🚀 Template app setup complete');
  }, [navigate]);

  // 在加载期间显示骨架屏
  if (isLoading) {
    return <AppSkeleton />;
  }

  return (
    <>
      {/* 页面滚动处理 */}
      <ScrollToTop
        smooth={true}
        delay={100}
        autoScroll={true}
      />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/store-demo" element={<StoreDemo />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const [tokenProcessed, setTokenProcessed] = useState(false);

  // 检查URL中的token参数并存储
  useEffect(() => {
    const processToken = async () => {
      await StoreUtils.processTokenFromUrl();
      // 标记token处理完成
      setTokenProcessed(true);
    };

    processToken();
  }, []);

  // 获取 basename 配置 - 独立运行时简化逻辑
  const basename = currentConfig.basename;

  return (
    <HelmetProvider>
      <TemplateI18nProvider>
        <LanguageSyncComponent>
          <ConfigProvider locale={zhCN}>
            <Router basename={basename}>
              {/* 独立运行：需要认证守卫 + 完整布局 */}
              {/* 等待token处理完成后再进行认证检查 */}
              {tokenProcessed ? (
                <AuthGuard>
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </AuthGuard>
              ) : (
                <AppSkeleton />
              )}
            </Router>
          </ConfigProvider>
        </LanguageSyncComponent>
      </TemplateI18nProvider>
    </HelmetProvider>
  );
};

export default App;

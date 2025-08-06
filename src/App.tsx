import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { templateRoutes } from './routes';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { AuthUtils } from './utils/authUtils';
import { currentConfig } from './config/deployment';
import Dashboard from './pages/Dashboard';
import Feature1 from './pages/Feature1';
import Feature2 from './pages/Feature2';
import Settings from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { AppSkeleton } from './components/AppSkeleton';
import './App.css';

// 内部路由组件，用于处理路由监听
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 暴露路由配置API
    (window as any).getRoutes = () => templateRoutes;

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    initializeApp();

    // 监听来自主应用的路由变化消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'ROUTE_CHANGE') {
        const targetPath = event.data.path;
        navigate(targetPath);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  // 在加载期间显示骨架屏
  if (isLoading) {
    return <AppSkeleton />;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/feature1" element={<Feature1 />} />
      <Route path="/feature2" element={<Feature2 />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  // 检测是否在微前端环境中运行
  const isInMicroFrontend = window !== window.parent;

  // 检查URL中的token参数并存储
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // 存储token到localStorage
      AuthUtils.setToken(token);

      // 清除URL中的token参数，避免token暴露在URL中
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      window.history.replaceState({}, '', newUrl.toString());

      console.log('Token received and stored from URL');
    }
  }, []);

  // 获取 basename 配置
  // 在生产环境下使用 /mf-template，开发环境下不使用 basename
  const getBasename = () => {
    if (currentConfig.isProduction) {
      // 在 GitHub Pages 上独立运行时使用 /mf-template
      // 在主应用中集成时，主应用会处理 /mf-shell/template 路径
      return window.location.pathname.startsWith('/mf-template') ? currentConfig.basename : '';
    }
    return currentConfig.basename;
  };

  const basename = getBasename();

  return (
    <ConfigProvider locale={zhCN}>
      <Router basename={basename}>
        {isInMicroFrontend ? (
          // 微前端环境：只显示内容，不显示导航（主应用已处理认证）
          <AppRoutes />
        ) : (
          // 独立运行：需要认证守卫 + 完整布局
          <AuthGuard>
            <Layout>
              <AppRoutes />
            </Layout>
          </AuthGuard>
        )}
      </Router>
    </ConfigProvider>
  );
};

export default App;

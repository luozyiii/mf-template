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
import { templateRouteConfig } from './config/routes.config';
import TemplateI18nProvider from './i18n/I18nProvider';
import Dashboard from './pages/dashboard/Dashboard';
import { NotFound } from './pages/NotFound';
import StoreDemo from './pages/store-demo/StoreDemo';
import { AuthUtils } from './utils/authUtils';
import './App.css';
import users from './mock/userinfo.json';
import { keyOf } from './store/keys';
import { configureStoreStrategy, setStoreValue } from 'mf-shared/store';

// 内部路由组件，用于处理路由监听
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    // 暴露路由配置API（用于调试）
    (window as any).getRoutes = () => templateRouteConfig;

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
    <>
      {/* 微前端环境下的滚动处理 */}
      <ScrollToTop
        smooth={true}
        delay={100} // 微前端环境下稍短的延迟
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
  // 检测是否在微前端环境中运行
  const isInMicroFrontend = window !== window.parent;
  const [tokenProcessed, setTokenProcessed] = useState(false);

  // 检查URL中的token参数并存储
  useEffect(() => {
    const processToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        console.log('App: Processing token from URL:', token);

        // 首先使用AuthUtils设置token，确保一致性
        console.log('App: Setting token via AuthUtils:', token);
        AuthUtils.setToken(token);

        // 将 token/user/app/permissions 写入短键（根据模式自动选择 g:sh: 或 t:tp:）
        try {
          configureStoreStrategy(keyOf('token'), {
            medium: 'local',
            encrypted: false,
          });
          // 确保与AuthUtils使用相同的token值
          console.log('App: Setting token via setStoreValue:', token);
          setStoreValue(keyOf('token'), token);

        // 根据 token 在本地 mock 中匹配用户（简单规则：按 id=token 后缀）
        const matched = (users as any[]).find((u) =>
          token.includes(`_${u.id}_`)
        );
        if (matched) {
          configureStoreStrategy(keyOf('user'), {
            medium: 'local',
            encrypted: true,
          });
          configureStoreStrategy(keyOf('app'), {
            medium: 'local',
            encrypted: false,
          });
          configureStoreStrategy(keyOf('permissions'), {
            medium: 'local',
            encrypted: false,
          });
          setStoreValue(keyOf('user'), {
            id: matched.id,
            username: matched.username,
            name: matched.name,
            role: matched.role,
            permissions: matched.permissions,
          });
          setStoreValue(keyOf('app'), matched.appConfig);
          try {
            const permMap = Object.fromEntries(
              (matched.permissions || []).map((p: string) => [p, true])
            );
            setStoreValue(keyOf('permissions'), permMap);
          } catch {}
        }
      } catch {
        console.warn('Failed to configure store strategy for token');
      }

      // 等待一小段时间确保存储操作完成
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证token是否成功存储
      const storedToken = AuthUtils.getToken();
      if (storedToken === token) {
        console.log('App: Token successfully stored and verified');
      } else {
        console.warn('App: Token storage verification failed');
      }

      // 清除URL中的所有token参数，避免token暴露在URL中
      const newUrl = new URL(window.location.href);
      // 删除所有token参数（可能有多个）
      while (newUrl.searchParams.has('token')) {
        newUrl.searchParams.delete('token');
      }
      window.history.replaceState({}, '', newUrl.toString());

      console.log('App: Token processing completed');
    } else {
      console.log('App: No token found in URL');
    }

    // 标记token处理完成（无论是否有token）
    setTokenProcessed(true);
    };

    processToken();
  }, []);

  // 获取 basename 配置
  // 在生产环境下使用 /mf-template，开发环境下不使用 basename
  const getBasename = () => {
    if (currentConfig.isProduction) {
      // 在 GitHub Pages 上独立运行时使用 /mf-template
      // 在主应用中集成时，主应用会处理 /mf-shell/template 路径
      return window.location.pathname.startsWith('/mf-template')
        ? currentConfig.basename
        : '';
    }
    return currentConfig.basename;
  };

  const basename = getBasename();

  return (
    <HelmetProvider>
      <TemplateI18nProvider>
        <ConfigProvider locale={zhCN}>
          <Router basename={basename}>
            {isInMicroFrontend ? (
              // 微前端环境：只显示内容，不显示导航（主应用已处理认证）
              <AppRoutes />
            ) : (
              // 独立运行：需要认证守卫 + 完整布局
              // 等待token处理完成后再进行认证检查
              tokenProcessed ? (
                <AuthGuard>
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </AuthGuard>
              ) : (
                <AppSkeleton />
              )
            )}
          </Router>
        </ConfigProvider>
      </TemplateI18nProvider>
    </HelmetProvider>
  );
};

export default App;

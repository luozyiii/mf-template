import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreUtils } from './utils/storeUtils';
import { templateRouteConfig } from './config/routes.config';

const startApp = async () => {
  // 暴露路由配置到全局（用于调试）
  (window as any).getRoutes = () => templateRouteConfig;
  console.log('📋 Template routes available:', templateRouteConfig);

  // 初始化独立运行时的存储
  await StoreUtils.initStandaloneStore();

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

startApp();

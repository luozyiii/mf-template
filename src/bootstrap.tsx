import { templateRouteConfig } from './config/routes.config';

// 暴露路由配置到全局（用于调试）
(window as any).templateRoutes = templateRouteConfig;
(window as any).getRoutes = () => templateRouteConfig;

console.log('📋 Template routes available:', templateRouteConfig);

import('./main');

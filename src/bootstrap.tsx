import { templateRoutes } from './routes';

// 向父窗口发送路由配置
const sendRoutesToParent = () => {
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({
        type: 'MICRO_FRONTEND_ROUTES',
        appKey: 'template',
        routes: templateRoutes
      }, '*');
      console.log('Template routes sent to parent:', templateRoutes);
    } catch (error) {
      console.warn('Failed to send routes to parent:', error);
    }
  }
};

// 立即发送路由配置
sendRoutesToParent();

// 也暴露到本地window，以防直接访问
(window as any).templateRoutes = templateRoutes;
(window as any).getRoutes = () => templateRoutes;

import('./main');

// 子应用路由配置
// 这个文件定义了子应用的路由配置，可以被主应用获取

export interface AppRouteConfig {
  appKey: string;
  appName: string;
  routePrefix: string;
  routes: RouteItem[];
  permissions: string[];
  enabled: boolean;
}

export interface RouteItem {
  path: string;
  name: string;
  icon?: string;
  component?: string;
  showBack?: boolean;
  backPath?: string;
  permissions?: string[];
  showInMenu?: boolean;
  menuOrder?: number;
}

/**
 * 模板应用路由配置
 * 这个配置可以被主应用通过 Module Federation 获取
 */
export const templateRouteConfig: AppRouteConfig = {
  appKey: 'template',
  appName: '模板系统',
  routePrefix: '/template',
  enabled: true,
  permissions: ['template:read'],
  routes: [
    {
      path: '/template/dashboard',
      name: '模板概览',
      icon: 'DashboardOutlined',
      component: 'Dashboard',
      showBack: false,
      showInMenu: true,
      menuOrder: 1,
    },
    {
      path: '/template/feature1',
      name: '功能模块1',
      icon: 'AppstoreOutlined',
      component: 'Feature1',
      showBack: true,
      backPath: '/template/dashboard',
      showInMenu: true,
      menuOrder: 2,
    },
    {
      path: '/template/feature2',
      name: '功能模块2',
      icon: 'SettingOutlined',
      component: 'Feature2',
      showBack: true,
      backPath: '/template/dashboard',
      showInMenu: true,
      menuOrder: 3,
    },
    {
      path: '/template/settings',
      name: '系统设置',
      icon: 'ControlOutlined',
      component: 'Settings',
      showBack: true,
      showInMenu: true,
      menuOrder: 4,
    },
  ],
};

/**
 * 获取路由配置的函数
 * 主应用可以通过 Module Federation 调用这个函数获取路由配置
 */
export const getRouteConfig = (): AppRouteConfig => {
  return templateRouteConfig;
};

/**
 * 获取特定环境的路由配置
 */
export const getRouteConfigForEnvironment = (
  env: 'development' | 'production'
): AppRouteConfig => {
  const config = { ...templateRouteConfig };

  if (env === 'development') {
    // 开发环境可能有额外的调试路由
    config.routes.push({
      path: '/template/debug',
      name: '调试工具',
      icon: 'BugOutlined',
      component: 'Debug',
      showBack: true,
      backPath: '/template/dashboard',
      showInMenu: true,
      menuOrder: 99,
      permissions: ['template:debug'],
    });
  }

  return config;
};

// 默认导出
export default templateRouteConfig;

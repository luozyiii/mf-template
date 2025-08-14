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
 * 应用路由配置
 * 这个配置可以被主应用通过 Module Federation 获取
 */
export const appRouteConfig: AppRouteConfig = {
  appKey: (process.env.MODULE_NAME as string) || 'template',
  appName: (process.env.APP_DISPLAY_NAME as string) || '模板系统',
  routePrefix: `/${(process.env.MODULE_NAME as string) || 'template'}`,
  enabled: true,
  permissions: [`${(process.env.MODULE_NAME as string) || 'template'}:read`],
  routes: [
    {
      path: `/${(process.env.MODULE_NAME as string) || 'template'}/dashboard`,
      name: `${(process.env.APP_DISPLAY_NAME as string) || '模板系统'}概览`,
      icon: 'DashboardOutlined',
      component: 'Dashboard',
      showBack: false,
      showInMenu: true,
      menuOrder: 1,
    },
    {
      path: `/${(process.env.MODULE_NAME as string) || 'template'}/feature1`,
      name: '功能模块1',
      icon: 'AppstoreOutlined',
      component: 'Feature1',
      showBack: true,
      backPath: `/${(process.env.MODULE_NAME as string) || 'template'}/dashboard`,
      showInMenu: true,
      menuOrder: 2,
    },
    {
      path: `/${(process.env.MODULE_NAME as string) || 'template'}/feature2`,
      name: '功能模块2',
      icon: 'SettingOutlined',
      component: 'Feature2',
      showBack: true,
      backPath: `/${(process.env.MODULE_NAME as string) || 'template'}/dashboard`,
      showInMenu: true,
      menuOrder: 3,
    },
    {
      path: `/${(process.env.MODULE_NAME as string) || 'template'}/settings`,
      name: '系统设置',
      icon: 'ControlOutlined',
      component: 'Settings',
      showBack: true,
      showInMenu: true,
      menuOrder: 4,
    },
    {
      path: `/${(process.env.MODULE_NAME as string) || 'template'}/store-demo`,
      name: 'Store 演示',
      icon: 'DatabaseOutlined',
      component: 'StoreDemo',
      showBack: true,
      backPath: `/${(process.env.MODULE_NAME as string) || 'template'}/dashboard`,
      showInMenu: true,
      menuOrder: 5,
    },
  ],
};

/**
 * 获取路由配置的函数
 * 主应用可以通过 Module Federation 调用这个函数获取路由配置
 */
export const getRouteConfig = (): AppRouteConfig => {
  return appRouteConfig;
};

/**
 * 获取特定环境的路由配置
 */
export const getRouteConfigForEnvironment = (
  env: 'development' | 'production'
): AppRouteConfig => {
  const config = { ...appRouteConfig };

  if (env === 'development') {
    // 开发环境可能有额外的调试路由
    const moduleName = (process.env.MODULE_NAME as string) || 'template';
    config.routes.push({
      path: `/${moduleName}/debug`,
      name: '调试工具',
      icon: 'BugOutlined',
      component: 'Debug',
      showBack: true,
      backPath: `/${moduleName}/dashboard`,
      showInMenu: true,
      menuOrder: 99,
      permissions: [`${moduleName}:debug`],
    });
  }

  return config;
};

// 默认导出
export default appRouteConfig;

// 兼容性导出（保持向后兼容）
export const templateRouteConfig = appRouteConfig;

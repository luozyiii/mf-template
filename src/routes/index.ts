// 模板系统路由配置
export const templateRoutes = {
  appName: '模板系统',
  appKey: 'template',
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
      // 不设置backPath，默认返回上一页
    },
  ],
};

// 导出路由配置供主应用使用
export default templateRoutes;

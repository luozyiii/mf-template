// 模板系统路由配置
export const templateRoutes = {
  appName: '模板系统',
  appKey: 'template',
  routes: [
    {
      path: '/template/dashboard',
      name: '模板概览',
      icon: 'DashboardOutlined',
      showBack: false,
    },
    {
      path: '/template/feature1',
      name: '功能模块1',
      icon: 'AppstoreOutlined',
      showBack: true,
      backPath: '/template/dashboard',
    },
    {
      path: '/template/feature2',
      name: '功能模块2',
      icon: 'SettingOutlined',
      showBack: true,
      backPath: '/template/dashboard',
    },
    {
      path: '/template/settings',
      name: '系统设置',
      icon: 'ControlOutlined',
      showBack: true,
      // 不设置backPath，默认返回上一页
    },
  ],
};

// 导出路由配置供主应用使用
export default templateRoutes;

// 模板系统路由配置
export const templateRoutes = [
  {
    path: '/',
    name: '首页',
    icon: 'HomeOutlined',
    component: 'Dashboard'
  },
  {
    path: '/feature1',
    name: '功能模块1',
    icon: 'AppstoreOutlined',
    component: 'Feature1'
  },
  {
    path: '/feature2',
    name: '功能模块2',
    icon: 'SettingOutlined',
    component: 'Feature2'
  },
  {
    path: '/settings',
    name: '系统设置',
    icon: 'ControlOutlined',
    component: 'Settings'
  }
];

// 导出路由配置供主应用使用
export default templateRoutes;

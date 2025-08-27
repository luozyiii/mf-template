import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

// 与主应用保持一致的共享依赖配置
const sharedDependencies = {
  // 核心 React 依赖 - 从主应用获取
  react: {
    singleton: true,
    eager: true, // 与主应用保持一致，避免共享依赖生成按需块
    requiredVersion: '^19.1.0',
    strictVersion: false,
  },
  'react-dom': {
    singleton: true,
    eager: true, // 与主应用保持一致
    requiredVersion: '^19.1.0',
    strictVersion: false,
  },

  // 路由依赖 - 从主应用获取
  'react-router-dom': {
    singleton: true,
    eager: false,
    requiredVersion: '^7.8.1',
    strictVersion: false,
  },

  // UI 库 - 从主应用获取
  antd: {
    singleton: true,
    eager: false,
    requiredVersion: '^5.27.1',
    strictVersion: false,
  },

  // 工具库 - 从主应用获取
  'react-helmet-async': {
    singleton: true,
    eager: false,
    requiredVersion: '^2.0.5',
    strictVersion: false,
  },
};

export default createModuleFederationConfig({
  name: process.env.MODULE_NAME || 'template',
  filename: 'remoteEntry.js',
  remotes: {
    'mf-shared': `mfShared@${process.env.MF_SHARED_URL || 'http://localhost:2999'}/remoteEntry.js`,
  },
  exposes: {
    './App': './src/exports/App.tsx',
    './routes': './src/config/routes.config.ts',
    './Dashboard': './src/exports/Dashboard.tsx',
    './StoreDemo': './src/exports/StoreDemo.tsx',
    './I18nDemo': './src/exports/I18nDemo.tsx',
    './hooks/useSwitchLanguage': './src/i18n/useSwitchLanguage.ts',
  },
  shared: sharedDependencies,
});

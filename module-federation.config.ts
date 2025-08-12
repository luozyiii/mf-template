import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: process.env.MODULE_NAME || 'template',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.tsx',
    './routes': './src/config/routes.config.ts',
    './Dashboard': './src/pages/Dashboard.tsx',
    './Feature1': './src/pages/Feature1.tsx',
    './Feature2': './src/pages/Feature2.tsx',
    './Settings': './src/pages/Settings.tsx',
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
    },
    'react-dom': {
      singleton: true,
      eager: true,
    },
    'react-router-dom': {
      singleton: true,
      eager: true,
    },
    antd: {
      singleton: true,
    },
  },
});

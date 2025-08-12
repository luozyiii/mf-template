import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'template',
  filename: 'remoteEntry.js',
  exposes: {
    './routes': './src/config/routes.config.ts',
    './Dashboard': './src/pages/Dashboard.tsx',
    './Feature1': './src/pages/Feature1.tsx',
    './Feature2': './src/pages/Feature2.tsx',
    './Settings': './src/pages/Settings.tsx',
  },
  shared: {
    react: {
      singleton: true,
      eager: false,
    },
    'react-dom': {
      singleton: true,
      eager: false,
    },
    'react-router-dom': {
      singleton: true,
      eager: false,
    },
    antd: {
      singleton: true,
      eager: false,
    },
  },
});

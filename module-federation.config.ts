import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'template',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.tsx',
    './Dashboard': './src/pages/Dashboard.tsx',
    './Feature1': './src/pages/Feature1.tsx',
    './Feature2': './src/pages/Feature2.tsx',
    './Settings': './src/pages/Settings.tsx',
    './routes': './src/routes/index.ts',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: false,
      eager: false,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: false,
      eager: false,
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: false,
      eager: false,
    },
    antd: {
      singleton: true,
      requiredVersion: false,
      eager: false,
    },
  },
});

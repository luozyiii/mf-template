import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import { getBaseMFConfig } from './shared-config';

export default createModuleFederationConfig(
  getBaseMFConfig('template', {
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/App.tsx',
      './Dashboard': './src/pages/Dashboard.tsx',
      './Feature1': './src/pages/Feature1.tsx',
      './Feature2': './src/pages/Feature2.tsx',
      './Settings': './src/pages/Settings.tsx',
      './routes': './src/routes/index.ts',
    },
  })
);

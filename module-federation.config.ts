import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'template',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.tsx',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: false,
      eager: false
    },
    'react-dom': {
      singleton: true,
      requiredVersion: false,
      eager: false
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: false,
      eager: false
    },
    antd: {
      singleton: true,
      requiredVersion: false,
      eager: false
    },
  },
});

import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
  server: {
    port: Number(process.env.PORT) || 3001,
  },
  html: {
    title: process.env.APP_DISPLAY_NAME || '微前端子系统',
    template: './public/index.html',
    templateParameters: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_DISPLAY_NAME: process.env.APP_DISPLAY_NAME || '微前端子系统',
    },
  },
  output: {
    // GitHub Pages 部署配置
    assetPrefix:
      process.env.NODE_ENV === 'production'
        ? `/${process.env.PROJECT_NAME || 'mf-template'}/`
        : '/',
  },
  source: {
    // 注入环境变量到应用中
    define: {
      // 基础环境变量
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.PUBLIC_URL': JSON.stringify(process.env.BASENAME || ''),

      // 应用配置
      'process.env.MODULE_NAME': JSON.stringify(process.env.MODULE_NAME || 'template'),
      'process.env.APP_DISPLAY_NAME': JSON.stringify(process.env.APP_DISPLAY_NAME || '模板系统'),
      'process.env.PROJECT_NAME': JSON.stringify(process.env.PROJECT_NAME || 'mf-template'),
      'process.env.PORT': JSON.stringify(process.env.PORT || '3001'),

      // GitHub 配置
      'process.env.GITHUB_USERNAME': JSON.stringify(process.env.GITHUB_USERNAME || 'luozyiii'),

      // URL 配置
      'process.env.SHELL_URL': JSON.stringify(process.env.SHELL_URL || 'http://localhost:3000'),
      'process.env.CURRENT_APP_URL': JSON.stringify(process.env.CURRENT_APP_URL || 'http://localhost:3001'),
      'process.env.BASENAME': JSON.stringify(process.env.BASENAME || ''),
      'process.env.MF_SHARED_URL': JSON.stringify(
        process.env.MF_SHARED_URL || 'http://localhost:2999'
      ),

      // 注入到 window 对象，供运行时使用
      '__NODE_ENV__': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  },
});

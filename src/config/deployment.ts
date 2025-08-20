// 部署配置
export const deploymentConfig = {
  // 获取当前环境的配置
  getCurrentConfig() {
    // 优先从环境变量获取，然后检查 hostname 来判断环境
    let env = 'development';

    if (typeof window !== 'undefined') {
      // 检查是否在 GitHub Pages 环境
      if (window.location.hostname.includes('github.io')) {
        env = 'production';
      }
      // 或者从 window 对象获取环境变量
      else if ((window as any).__NODE_ENV__) {
        env = (window as any).__NODE_ENV__;
      }
    }

    // 从环境变量获取配置（这些在构建时已经注入）
    const shellUrl =
      (process.env.SHELL_URL as string) || 'http://localhost:3000';
    const currentUrl =
      (process.env.CURRENT_APP_URL as string) || 'http://localhost:3001';
    const basename = (process.env.BASENAME as string) || '';

    const config = {
      shellUrl,
      currentUrl,
      basename,
      isProduction: env === 'production',
      moduleName: (process.env.MODULE_NAME as string) || 'template',
      appDisplayName: (process.env.APP_DISPLAY_NAME as string) || '模板系统',
      projectName: (process.env.PROJECT_NAME as string) || 'mf-template',
    };

    // 在开发环境下打印配置信息
    if (env === 'development') {
      console.log('🔧 Deployment config:', { env, config });
    }

    return config;
  },
};

// 导出当前环境配置
export const currentConfig = deploymentConfig.getCurrentConfig();

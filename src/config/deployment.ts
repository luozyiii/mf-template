// 部署配置
export const deploymentConfig = {
  // 主应用 URL
  shellApp: {
    development: 'http://localhost:3000',
    production: 'https://luozyiii.github.io/mf-shell',
  },

  // 当前模板模块 URL
  templateApp: {
    development: 'http://localhost:3003',
    production: 'https://luozyiii.github.io/mf-template',
  },

  // 路由 basename 配置
  basename: {
    development: '',
    production: '/mf-template',
  },

  // 获取当前环境的配置
  getCurrentConfig() {
    // 优先从 window 对象获取环境变量，然后检查 hostname 来判断环境
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

    const config = {
      shellUrl: this.shellApp[env as keyof typeof this.shellApp],
      templateUrl: this.templateApp[env as keyof typeof this.templateApp],
      basename: this.basename[env as keyof typeof this.basename],
      isProduction: env === 'production',
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

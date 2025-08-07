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
    const env = process.env.NODE_ENV || 'development';
    return {
      shellUrl: this.shellApp[env as keyof typeof this.shellApp],
      templateUrl: this.templateApp[env as keyof typeof this.templateApp],
      basename: this.basename[env as keyof typeof this.basename],
      isProduction: env === 'production',
    };
  },
};

// 导出当前环境配置
export const currentConfig = deploymentConfig.getCurrentConfig();

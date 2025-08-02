# 微前端子系统模板 (mf-template)

这是一个标准的微前端子系统模板项目，包含了所有必要的配置和基础功能，可以作为创建新微前端子系统的起点。

## 🚀 特性

- ✅ **完整的微前端配置** - Module Federation、路由、部署等
- ✅ **统一的认证系统** - 与主应用集成的认证和权限管理
- ✅ **GitHub Pages 部署** - 支持自动化部署
- ✅ **响应式布局** - 基于 Ant Design 的现代化 UI
- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **标准化配置** - 统一的项目结构和配置模式

## 📁 项目结构

```
mf-template/
├── .github/workflows/     # GitHub Actions 配置
│   └── deploy.yml        # 自动部署配置
├── public/               # 静态资源
│   ├── index.html       # 主页面模板
│   └── 404.html         # SPA 路由重定向
├── src/
│   ├── components/       # 通用组件
│   │   ├── Layout.tsx   # 布局组件
│   │   ├── AuthGuard.tsx # 认证守卫
│   │   └── AppSkeleton.tsx # 加载骨架屏
│   ├── config/          # 配置文件
│   │   └── deployment.ts # 部署环境配置
│   ├── pages/           # 页面组件
│   │   ├── Dashboard.tsx # 首页
│   │   ├── Feature1.tsx # 功能页面1
│   │   ├── Feature2.tsx # 功能页面2
│   │   ├── Settings.tsx # 设置页面
│   │   └── NotFound.tsx # 404页面
│   ├── routes/          # 路由配置
│   │   └── index.ts     # 路由定义
│   ├── utils/           # 工具函数
│   │   └── authUtils.ts # 认证工具
│   ├── App.tsx          # 主应用组件
│   ├── App.css          # 全局样式
│   ├── main.tsx         # 应用入口
│   ├── bootstrap.tsx    # 微前端启动文件
│   └── index.ts         # 入口文件
├── package.json         # 项目配置
├── rsbuild.config.ts    # 构建配置
├── module-federation.config.ts # 微前端配置
├── tsconfig.json        # TypeScript 配置
└── README.md           # 项目文档
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x
- **构建工具**: Rsbuild + Module Federation
- **路由管理**: React Router 7.x
- **部署平台**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📦 快速开始

### 1. 复制模板

```bash
# 复制模板项目到新目录
cp -r mf-template mf-your-module
cd mf-your-module
```

### 2. 修改配置

需要修改以下文件中的配置：

#### package.json
```json
{
  "name": "mf-your-module",  // 修改项目名称
  // ...
}
```

#### rsbuild.config.ts
```typescript
export default defineConfig({
  server: {
    port: 3004,  // 修改端口号
  },
  html: {
    title: '您的模块名称',  // 修改标题
  },
  output: {
    assetPrefix: process.env.NODE_ENV === 'production'
      ? '/mf-your-module/'  // 修改项目名称
      : '/',
  },
  source: {
    define: {
      'process.env.PUBLIC_URL': JSON.stringify(
        process.env.NODE_ENV === 'production' ? '/mf-your-module' : ''  // 修改项目名称
      ),
    },
  },
});
```

#### module-federation.config.ts
```typescript
export default createModuleFederationConfig({
  name: 'yourModule',  // 修改模块名称
  // ...
});
```

#### src/config/deployment.ts
```typescript
export const deploymentConfig = {
  // 当前模块 URL
  yourModuleApp: {  // 修改模块名称
    development: 'http://localhost:3004',  // 修改端口
    production: 'https://luozyiii.github.io/mf-your-module'  // 修改项目名称
  },
  basename: {
    development: '',
    production: '/mf-your-module'  // 修改项目名称
  },
  getCurrentConfig() {
    const env = process.env.NODE_ENV || 'development';
    return {
      shellUrl: this.shellApp[env as keyof typeof this.shellApp],
      yourModuleUrl: this.yourModuleApp[env as keyof typeof this.yourModuleApp],  // 修改属性名
      basename: this.basename[env as keyof typeof this.basename],
      isProduction: env === 'production'
    };
  }
};
```

#### .github/workflows/deploy.yml
```yaml
- name: Build with Rsbuild
  run: npm run build
  env:
    NODE_ENV: production
    PUBLIC_URL: https://luozyiii.github.io/mf-your-module/  # 修改项目名称
```

#### public/404.html
```javascript
// 修改所有 '/mf-template' 为 '/mf-your-module'
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 构建生产版本

```bash
npm run build
```

## 🚀 部署

### GitHub Pages 自动部署

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为部署源
4. 推送代码到 main 分支即可自动部署

### 手动部署

```bash
npm run deploy
```

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/routes/index.ts` 中添加路由配置
3. 在 `src/App.tsx` 中添加路由映射
4. 在 `src/components/Layout.tsx` 中添加菜单项

### 修改样式

- 全局样式：修改 `src/App.css`
- 组件样式：使用 Ant Design 的主题定制或 CSS-in-JS

### 集成到主应用

模板已经配置好了与主应用的集成，包括：
- 认证状态同步
- 路由消息通信
- 环境检测（独立运行 vs 微前端环境）

## 📝 注意事项

1. **端口冲突**: 确保每个子系统使用不同的端口号
2. **模块名称**: Module Federation 的模块名称必须唯一
3. **路由配置**: basename 配置要与部署路径一致
4. **认证集成**: 确保与主应用的认证系统正确集成

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个模板！

## 📄 许可证

MIT License

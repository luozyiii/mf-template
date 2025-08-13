# 🎯 微前端子系统标准模板 (mf-template)

这是一个经过精心设计的微前端子系统标准模板，基于成熟的微前端最佳实践，提供了完整的配置和基础功能，可以快速创建新的微前端子系统。

## ✨ 核心特性

- 🏗️ **完整的微前端架构** - Module Federation + Rsbuild 构建
- 🔐 **统一认证系统** - 与主应用 mf-shell 无缝集成
- 🚀 **自动化部署** - GitHub Pages + GitHub Actions CI/CD
- 🎨 **现代化 UI** - Ant Design 5.x 响应式布局
- 📝 **TypeScript 支持** - 完整的类型定义和检查
- 🔧 **标准化配置** - 与现有子系统完全一致的配置模式
- 📱 **SPA 路由支持** - GitHub Pages 单页应用路由重定向
- 🛠️ **开发工具** - 自动化创建脚本和详细文档

## 🎯 模板优势

### 📋 基于最佳实践
- 🔧 配置架构完全统一
- 🚀 部署流程标准化
- 🔐 认证集成无缝对接
- 📱 路由处理一致性

### 🎯 开箱即用的功能
- **完整的页面示例** - Dashboard、功能模块、设置页面
- **响应式布局** - 支持桌面和移动端
- **主题定制** - 基于 Ant Design 的现代化设计
- **错误处理** - 404 页面和错误边界
- **加载状态** - 骨架屏和加载动画

### 🔄 智能路由处理
- **开发环境** - 直接路由，无 basename
- **生产环境** - 自动检测独立部署 vs 主应用集成
- **SPA 支持** - GitHub Pages 单页应用路由重定向
- **微前端通信** - 与主应用的消息传递

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
├── scripts/            # 工具脚本
│   └── create-new-module.sh # 自动化创建脚本
├── TEMPLATE_USAGE.md   # 详细使用指南
└── README.md           # 项目文档
```

## 🚀 快速开始

### 方法一：使用自动化脚本（推荐）

```bash
# 在项目根目录执行
./mf-internal/scripts/create-micro-frontend.sh <模块名> <端口号> "<系统标题>"

# 示例：创建库存管理系统
./mf-internal/scripts/create-micro-frontend.sh inventory 3004 "库存管理系统"
```

### 方法二：手动复制和配置

```bash
# 1. 复制模板到新项目目录
cp -r mf-template mf-your-new-module
cd mf-your-new-module

# 2. 删除不需要的文件
rm -rf .git node_modules dist

# 3. 手动修改配置文件（参考下面的配置说明）
```

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | 18.3.1 | 前端框架 |
| **TypeScript** | 5.6.3 | 类型系统 |
| **Ant Design** | 5.26.7 | UI 组件库 |
| **Rsbuild** | 1.1.8 | 构建工具 |
| **Module Federation** | 0.17.1 | 微前端架构 |
| **React Router** | 7.7.1 | 路由管理 |
| **GitHub Pages** | - | 部署平台 |
| **GitHub Actions** | - | CI/CD 流水线 |

## ⚙️ 手动配置说明

如果选择手动配置，需要修改以下关键文件：

### 1. package.json
```json
{
  "name": "mf-your-module",  // 修改项目名称
  "description": "您的模块描述"
}
```

### 2. rsbuild.config.ts
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
});
```

### 3. module-federation.config.ts
```typescript
export default createModuleFederationConfig({
  name: 'yourModule',  // 修改模块名称
  // ...
});
```

### 4. 安装依赖并启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
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
npm run build
npm run deploy
```

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新的页面组件
2. 在 `src/routes/index.ts` 中添加路由配置
3. 在 `src/App.tsx` 中添加路由映射
4. 在 `src/components/Layout.tsx` 中添加菜单项

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

## 🎯 使用示例

### 创建库存管理系统

```bash
# 1. 使用脚本创建
./mf-internal/scripts/create-micro-frontend.sh inventory 3004 "库存管理系统"

# 2. 进入项目目录
cd mf-inventory

# 3. 安装依赖并启动
npm install
npm run dev

# 4. 访问应用
open http://localhost:3004
```

### 部署到 GitHub Pages

```bash
# 1. 创建 GitHub 仓库 mf-inventory
# 2. 推送代码
git remote add origin https://github.com/your-username/mf-inventory.git
git push -u origin main

# 3. 在仓库设置中启用 GitHub Pages
# 4. 选择 "GitHub Actions" 作为部署源
# 5. 访问 https://your-username.github.io/mf-inventory
```

## 🌟 项目优势

- **🚀 快速开发** - 5分钟创建完整项目
- **🔧 高度一致** - 统一架构和标准配置
- **📈 易于维护** - 文档完善，自动化工具支持

## 📚 相关文档

- [创建新子系统指南](../mf-internal/docs/CREATE_NEW_SUBSYSTEM.md)
- [环境配置指南](../mf-internal/docs/ENV_CONFIG.md)
- [部署指南](../mf-internal/docs/DEPLOYMENT.md)

## 📄 许可证

MIT License

---

**🎉 开始您的微前端开发之旅吧！**

这个模板将帮助您快速创建高质量、标准化的微前端子系统，让您专注于业务逻辑的实现。

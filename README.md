# mf-template

微前端子系统标准模板，基于 Module Federation 和 Rsbuild 构建。

## 🚀 核心特性

- **微前端架构** - Module Federation 完整配置，支持独立开发部署
- **统一认证** - 集成主应用认证和权限管理系统
- **现代技术栈** - React 19 + TypeScript + Ant Design 5
- **全局状态** - 基于 mf-shared 的跨应用状态管理
- **开发规范** - Biome + Husky + Commitlint 完整工具链

## 📦 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.x | 前端框架 |
| TypeScript | 5.x | 类型支持 |
| Rsbuild | 1.x | 构建工具 |
| Ant Design | 5.x | UI 组件库 |
| React Router | 7.x | 路由管理 |
| Biome | 2.x | 代码规范 |

## ⚡ 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 🏗️ Module Federation 配置

### 暴露模块

```typescript
exposes: {
  './App': './src/App.tsx',           // 主应用组件
  './routes': './src/config/routes.config.ts', // 路由配置
  './Dashboard': './src/pages/Dashboard.tsx',   // 仪表盘页面
  './StoreDemo': './src/pages/StoreDemo.tsx'   // 状态管理演示
}
```

### 共享依赖

- `react` / `react-dom` - 单例模式，预加载
- `react-router-dom` - 单例模式，按需加载
- `antd` - 按需加载

## 📁 项目结构

```
src/
├── App.tsx                 # 主应用组件
├── bootstrap.tsx           # 应用启动
├── components/             # 通用组件
│   ├── Layout.tsx          # 应用布局
│   ├── AuthGuard.tsx       # 认证守卫
│   └── WithPermission.tsx  # 权限组件
├── pages/                  # 页面组件
│   ├── Dashboard.tsx       # 仪表盘
│   └── StoreDemo.tsx       # 状态演示
├── config/                 # 配置文件
│   └── routes.config.ts    # 路由配置
├── hooks/                  # 自定义 Hooks
├── store/                  # 状态管理
└── utils/                  # 工具函数
```

## 🔧 环境配置

创建 `.env.local` 文件：

```bash
# 模块配置
MODULE_NAME=your-module
APP_DISPLAY_NAME=您的系统名称
PROJECT_NAME=mf-your-module

# 服务配置
PORT=3004
SHELL_URL=http://localhost:3000
MF_SHARED_URL=http://localhost:2999
```

## 🛡️ 认证与权限

### 认证守卫

```tsx
// 登录检查
<AuthGuard>
  <Dashboard />
</AuthGuard>

// 权限检查
<WithPermission requirePerm="template:read">
  <Dashboard />
</WithPermission>
```

### AuthUtils 工具

```typescript
// Token 管理
AuthUtils.getToken()
AuthUtils.setToken(token)
AuthUtils.isAuthenticated()

// 用户信息
AuthUtils.getUserData()
AuthUtils.getPermissions()

// 登录/登出
AuthUtils.redirectToLogin()
AuthUtils.logout()
```

## 🔄 状态管理

```typescript
import { getVal, setVal, subscribeVal } from './store/keys';

// 获取状态
const userData = getVal('user');
const token = getVal('token');

// 设置状态
setVal('user', newUserData);
setVal('token', newToken);

// 订阅变化
const unsubscribe = subscribeVal('user', (key, value) => {
  console.log('用户数据更新:', value);
});
```

## 📋 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 预览构建结果

# 代码质量
pnpm lint             # 代码检查
pnpm format           # 代码格式化
pnpm type-check       # 类型检查
pnpm code-quality     # 完整质量检查
```

## 🚀 部署

项目支持 GitHub Pages 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建部署
3. 访问 `https://username.github.io/mf-template/`

## 📝 使用模板

1. **复制项目** - 复制整个 `mf-template` 目录
2. **修改配置** - 更新 `package.json` 和环境变量
3. **自定义路由** - 修改 `routes.config.ts`
4. **开发功能** - 根据需求开发页面和组件
5. **部署上线** - 配置 CI/CD 流程

---

**License:** MIT

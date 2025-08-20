# mf-template

基于 Module Federation 和 Rsbuild 的微前端子系统标准模板。

## 核心特性

- **微前端架构** - 基于 Module Federation 的完整微前端配置
- **统一认证** - 与主应用集成的认证和权限管理系统
- **路由管理** - 支持 SPA 路由和跨应用导航
- **现代化 UI** - 基于 Ant Design 的响应式界面
- **TypeScript** - 完整的类型支持和开发体验
- **自动化部署** - 支持 GitHub Pages 自动部署
- **开发工具** - 集成 Biome 代码格式化和 lint
- **全局状态** - 集成 mf-shared 跨应用状态管理

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Rsbuild + Module Federation
- **UI 组件**: Ant Design 5.x
- **路由**: React Router DOM 7.x
- **状态管理**: mf-shared GlobalStore
- **样式**: CSS Modules + Ant Design
- **代码规范**: Biome (ESLint + Prettier 替代方案)
- **Git 钩子**: Husky + lint-staged
- **提交规范**: Commitlint

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查和格式化
pnpm lint
pnpm format
```

## 项目结构

```
src/
├── App.css             # 应用样式
├── App.tsx             # 主应用组件
├── bootstrap.tsx       # 应用启动文件
├── index.ts            # 入口文件
├── main.tsx            # 主入口
├── types.d.ts          # 类型定义
├── components/         # 通用组件
│   ├── Layout.tsx      # 应用布局
│   ├── Layout.module.css # 布局样式
│   ├── AuthGuard.tsx   # 认证守卫
│   ├── AppSkeleton.tsx # 加载骨架屏
│   ├── ScrollToTop.tsx # 滚动到顶部组件
│   └── WithPermission.tsx # 权限包装组件
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 仪表盘页面
│   ├── DashboardWithPerm.tsx # 带权限的仪表盘
│   ├── NotFound.tsx    # 404页面
│   └── StoreDemo.tsx   # 状态管理演示
├── config/             # 配置文件
│   ├── routes.config.ts # 路由配置
│   └── deployment.ts   # 部署配置
├── hooks/              # 自定义 Hooks
│   └── usePermissions.ts # 权限钩子
├── store/              # 状态管理
│   └── keys.ts         # 存储键定义
├── utils/              # 工具函数
│   └── authUtils.ts    # 认证工具
└── mock/               # 模拟数据
    └── userinfo.json   # 用户信息模拟数据
```

## Module Federation 配置

### 暴露的模块

- `./App` - 主应用组件
- `./routes` - 路由配置
- `./Dashboard` - 仪表盘页面
- `./StoreDemo` - 状态管理演示

### 共享依赖

- `react` - 单例模式，预加载
- `react-dom` - 单例模式，预加载
- `react-router-dom` - 单例模式，按需加载
- `antd` - 按需加载

## 路由配置

```typescript
export const appRouteConfig: AppRouteConfig = {
  appKey: process.env.MODULE_NAME || 'template',
  appName: process.env.APP_DISPLAY_NAME || '模板系统',
  routePrefix: `/${process.env.MODULE_NAME || 'template'}`,
  enabled: true,
  permissions: [`${process.env.MODULE_NAME || 'template'}:read`],
  routes: [
    {
      path: `/${process.env.MODULE_NAME || 'template'}/dashboard`,
      name: `${process.env.APP_DISPLAY_NAME || '模板系统'}概览`,
      icon: 'DashboardOutlined',
      component: 'Dashboard',
      showBack: false,
      showInMenu: true,
      menuOrder: 1
    },
    {
      path: `/${process.env.MODULE_NAME || 'template'}/store-demo`,
      name: 'Store 演示',
      icon: 'DatabaseOutlined',
      component: 'StoreDemo',
      showBack: true,
      backPath: `/${process.env.MODULE_NAME || 'template'}/dashboard`,
      showInMenu: true,
      menuOrder: 2
    }
  ]
};
```

## 认证系统

### AuthUtils 工具类

```typescript
// Token 管理
AuthUtils.getToken()           // 获取token
AuthUtils.setToken(token)      // 设置token
AuthUtils.removeToken()        // 移除token

// 认证状态
AuthUtils.isAuthenticated()    // 检查登录状态
AuthUtils.isTokenExpired()     // 检查token是否过期

// 用户信息管理
AuthUtils.getUserData()        // 获取用户信息
AuthUtils.setUserData(data)    // 设置用户信息

// 权限管理
AuthUtils.getPermissions()     // 获取用户权限
AuthUtils.setPermissions(perms) // 设置用户权限

// 登录/登出
AuthUtils.redirectToLogin(returnUrl) // 跳转到登录页
AuthUtils.logout()             // 退出登录并清理数据
```

### 权限守卫

```typescript
// 认证守卫 - 检查登录状态
<AuthGuard>
  <Dashboard />
</AuthGuard>

// 权限守卫 - 检查具体权限
<WithPermission requirePerm="template:read">
  <Dashboard />
</WithPermission>

// 角色守卫 - 检查用户角色
<WithPermission requireAnyRole={['admin', 'manager']}>
  <AdminPanel />
</WithPermission>
```

## 全局状态管理

```typescript
import { getStoreValue, setStoreValue, subscribeStore } from 'mf-shared/store';
import { getVal, setVal, subscribeVal } from './store/keys';

// 方式一：直接使用 mf-shared 的 API
const userData = getStoreValue('user');
setStoreValue('user', newUserData);

// 方式二：使用本地封装的工具函数（推荐）
const userData = getVal('user');        // 获取用户数据
const token = getVal('token');          // 获取token
const permissions = getVal('permissions'); // 获取权限

setVal('user', newUserData);            // 设置用户数据
setVal('token', newToken);              // 设置token

// 订阅状态变化
const unsubscribe = subscribeVal('user', (key, value) => {
  console.log('用户数据更新:', value);
});

// 取消订阅
unsubscribe();
```

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `MODULE_NAME` | `your-module` | 模块名称，如: inventory, order, user |
| `APP_DISPLAY_NAME` | `您的系统名称` | 显示名称，如: 库存管理系统 |
| `PROJECT_NAME` | `mf-your-module` | 项目名称，通常是 mf- + MODULE_NAME |
| `PORT` | `3004` | 开发服务器端口 |
| `GITHUB_USERNAME` | `your-username` | GitHub 用户名 |
| `SHELL_URL` | `http://localhost:3000` | 主应用地址 |
| `CURRENT_APP_URL` | `http://localhost:3004` | 当前应用地址 |
| `BASENAME` | `` | 路由基础路径 |
| `MF_SHARED_URL` | `http://localhost:2999` | 共享模块地址 |

## 开发命令

```bash
# 开发模式（自动打开浏览器）
pnpm run dev

# 生产构建
pnpm run build

# 预览构建结果
pnpm run preview

# 代码检查
pnpm run lint

# 代码检查并自动修复
pnpm run lint:fix

# 代码格式化
pnpm run format

# 检查代码格式
pnpm run format:check

# 类型检查
pnpm run type-check

# 代码质量检查（包含 lint + format + type-check）
pnpm run code-quality
```

## 部署

### GitHub Pages

项目支持自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建和部署
3. 访问 `https://username.github.io/mf-template/`

### 自定义部署

```bash
# 构建生产版本
pnpm build

# 部署 dist 目录到服务器
```

## 构建配置

### Rsbuild 配置

- **端口配置**: 通过 `PORT` 环境变量设置开发服务器端口
- **HTML 模板**: 支持动态标题和模板参数注入
- **资源路径**: 生产环境支持 GitHub Pages 部署路径
- **环境变量**: 自动注入所有必要的环境变量到应用中

### 代码规范

项目使用 Biome 作为代码格式化和 lint 工具：

- **格式化**: 2空格缩进，单引号，行宽80字符
- **Lint 规则**: 启用推荐规则，禁用部分严格规则
- **CSS 支持**: 支持 CSS Modules 解析
- **Git 集成**: 自动使用 .gitignore 文件

### Git 工作流

- **Pre-commit**: 自动格式化和 lint 检查
- **Commit 规范**: 使用 Conventional Commits 规范
- **Lint-staged**: 只检查暂存区文件，提高效率

## 模板使用

1. **复制模板**：复制整个 `mf-template` 目录
2. **修改配置**：更新 `package.json`、环境变量等
3. **自定义功能**：根据需求修改页面和组件
4. **更新路由**：修改 `routes.config.ts` 中的路由配置
5. **部署应用**：配置 CI/CD 流程

## 许可证

MIT

# mf-template

微前端子系统标准模板，基于 Module Federation 和 Rsbuild 构建。支持独立运行和微前端集成双模式。

## 🚀 核心特性

- **双模式运行** - 既可独立运行，也可作为微前端模块集成
- **微前端架构** - Module Federation 完整配置，支持独立开发部署
- **统一认证** - 集成主应用认证和权限管理系统
- **现代技术栈** - React 19 + TypeScript + Ant Design 5
- **全局状态** - 基于 mf-shared 的跨应用状态管理
- **国际化支持** - 完整的 i18n 解决方案，支持语言同步
- **开发规范** - Biome + Husky + Commitlint 完整工具链
- **高度优化** - 经过深度优化，代码简洁高效

## 📦 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.x | 前端框架 |
| TypeScript | 5.x | 类型支持 |
| Rsbuild | 1.x | 构建工具 |
| Ant Design | 5.x | UI 组件库 |
| React Router | 7.x | 路由管理 |
| React i18next | 15.x | 国际化 |
| Biome | 2.x | 代码规范 |

## 🎯 运行模式

### 独立运行模式
- 完整的应用功能，包含认证、布局、导航
- 独立的存储管理和状态维护
- 适用于开发调试和独立部署

### 微前端模式
- 作为模块集成到主应用中
- 自动检测运行环境并适配
- 支持与主应用的状态同步和消息通信

## ⚡ 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（独立运行模式）
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 🏗️ Module Federation 配置

### 暴露模块

```typescript
exposes: {
  './App': './src/exports/App.tsx',           // 主应用组件（带 I18n）
  './Dashboard': './src/exports/Dashboard.tsx',   // 仪表盘页面（带 I18n）
  './StoreDemo': './src/exports/StoreDemo.tsx',   // 状态管理演示（带 I18n）
  './I18nDemo': './src/exports/I18nDemo.tsx'      // 国际化演示（带 I18n）
}
```

### 共享依赖

- `react` / `react-dom` - 单例模式，预加载
- `react-router-dom` - 单例模式，按需加载
- `antd` - 按需加载
- `react-i18next` - 国际化支持

### 导出组件特性

所有导出的组件都通过 `withI18n` 高阶组件包装，自动提供国际化支持。

## 📁 项目结构

```
src/
├── App.tsx                 # 主应用组件（独立运行）
├── main.tsx                # 应用启动入口
├── index.ts                # Module Federation 入口
├── components/             # 通用组件
│   ├── Layout.tsx          # 应用布局
│   ├── AuthGuard.tsx       # 认证守卫（已优化）
│   ├── WithPermission.tsx  # 权限组件
│   └── ScrollToTop.tsx     # 滚动控制（支持微前端）
├── exports/                # Module Federation 导出
│   ├── withI18n.tsx        # I18n 高阶组件
│   ├── App.tsx             # 导出的主应用
│   ├── Dashboard.tsx       # 导出的仪表盘
│   ├── StoreDemo.tsx       # 导出的状态演示
│   └── I18nDemo.tsx        # 导出的国际化演示
├── pages/                  # 页面组件
│   ├── dashboard/          # 仪表盘相关页面
│   ├── store-demo/         # 状态管理演示
│   └── i18n-demo/          # 国际化演示
├── i18n/                   # 国际化配置
│   ├── I18nProvider.tsx    # I18n 提供者
│   ├── LanguageSwitcher.tsx # 语言切换器
│   ├── useLanguageSync.ts  # 语言同步（已优化）
│   └── resources/          # 语言资源文件
├── config/                 # 配置文件
│   └── routes.config.ts    # 路由配置
├── hooks/                  # 自定义 Hooks
│   ├── useIsRemote.ts      # 微前端检测（已优化）
│   └── usePermissions.ts   # 权限管理
├── store/                  # 状态管理
│   └── keys.ts             # 存储键管理
├── utils/                  # 工具函数
│   ├── storeUtils.ts       # 存储工具（新增）
│   ├── authUtils.ts        # 认证工具（已优化）
│   └── i18nUtils.ts        # 国际化工具
├── mock/                   # Mock 数据
│   └── userinfo.json       # 用户信息（已优化）
└── types.d.ts              # 类型定义（已优化）
```

## 🔧 环境配置

项目支持通过环境变量进行配置，创建 `.env.local` 文件：

```bash
# 模块配置
MODULE_NAME=your-module
APP_DISPLAY_NAME=您的系统名称
PROJECT_NAME=mf-your-module

# 服务配置
PORT=3004
SHELL_URL=http://localhost:3000        # 主应用地址
MF_SHARED_URL=http://localhost:2999    # 共享模块地址
BASENAME=/your-module                  # 路由基础路径
```

### 环境变量说明

- `SHELL_URL`: 主应用地址，用于登录跳转
- `BASENAME`: 路由基础路径，生产环境下使用
- 其他配置项根据实际需求调整

## 🛡️ 认证与权限

### 认证守卫（已优化）

```tsx
// 简化的登录检查 - 专注于独立运行
<AuthGuard>
  <Dashboard />
</AuthGuard>

// 权限检查
<WithPermission requirePerm="template:read">
  <Dashboard />
</WithPermission>
```

### AuthUtils 工具（已优化）

```typescript
// Token 管理 - 简化版本
AuthUtils.getToken()           // 统一的 token 获取
AuthUtils.setToken(token)      // token 设置
AuthUtils.isAuthenticated()    // 认证状态检查

// 用户信息
AuthUtils.getUserData()        // 用户数据
AuthUtils.getPermissions()     // 权限信息

// 登录/登出 - 简化流程
AuthUtils.redirectToLogin()    // 跳转登录
AuthUtils.logout()             // 清理并登出
```

### 优化特性

- 移除了复杂的重试机制
- 简化了多重存储检查
- 专注于独立运行场景
- 保持与微前端模式的兼容性

## 🔄 状态管理

### 统一存储工具（新增）

```typescript
import { StoreUtils } from './utils/storeUtils';

// 初始化独立运行时的存储
await StoreUtils.initStandaloneStore();

// 处理 URL 中的 token 参数
await StoreUtils.processTokenFromUrl();
```

### 存储键管理

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

### 优化特性

- 统一的存储初始化逻辑
- 简化的 token 处理流程
- 自动检测运行模式并适配存储策略

## 🌍 国际化支持

### 语言切换器

```tsx
import { LanguageSwitcher } from './i18n/LanguageSwitcher';

// 自动检测运行模式，独立运行时显示，微前端模式下隐藏
<LanguageSwitcher />
```

### 语言同步（已优化）

```typescript
import { useLanguageSync } from './i18n/useLanguageSync';

// 自动同步主应用和子应用的语言设置
const LanguageSyncComponent = () => {
  useLanguageSync();
  return null;
};
```

### 优化特性

- 简化的微前端环境检测
- 优化的语言获取逻辑
- 移除重复的延迟检查机制

## 📋 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器（独立运行模式）
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

## 🎯 优化特性

本模板经过深度优化，具有以下特性：

### 代码优化
- **减少 200+ 行代码** - 移除冗余和重复代码
- **删除 6 个不必要文件** - 精简项目结构
- **统一代码模式** - 采用最佳实践

### 性能优化
- **简化环境检测** - 优化微前端检测逻辑
- **减少重复计算** - 使用 useMemo 和统一检测
- **优化存储管理** - 统一的存储工具类

### 架构优化
- **高阶组件模式** - `withI18n` 统一 I18n 包装
- **工具类封装** - `StoreUtils`、`AuthUtils` 等
- **类型定义优化** - 减少重复的类型定义

## 📝 使用模板

1. **复制项目** - 复制整个 `mf-template` 目录
2. **修改配置** - 更新 `package.json` 和环境变量
3. **自定义路由** - 修改 `routes.config.ts`
4. **开发功能** - 根据需求开发页面和组件
5. **部署上线** - 配置 CI/CD 流程

### 模板特色

- ✅ **双模式支持** - 独立运行 + 微前端集成
- ✅ **高度优化** - 代码简洁，性能优秀
- ✅ **完整功能** - 认证、权限、国际化、状态管理
- ✅ **最佳实践** - 现代化的开发模式和工具链

---

**License:** MIT

# 微前端子系统模板使用指南

## 🎯 快速开始

### 1. 复制模板项目

```bash
# 复制模板到新项目目录
cp -r mf-template mf-your-new-module
cd mf-your-new-module
```

### 2. 批量替换配置

使用以下脚本快速替换所有配置中的模板变量：

```bash
#!/bin/bash
# replace-template.sh

# 设置新项目的配置
NEW_MODULE_NAME="your-module"  # 例如: inventory, order, user
NEW_PORT="3004"               # 新的端口号
NEW_TITLE="您的模块标题"        # 例如: 库存管理系统

# 批量替换文件内容
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.html" -o -name "*.md" -o -name "*.yml" \) \
  -not -path "./node_modules/*" \
  -not -path "./dist/*" \
  -not -path "./.git/*" \
  -exec sed -i '' "s/mf-template/mf-${NEW_MODULE_NAME}/g" {} \; \
  -exec sed -i '' "s/template/${NEW_MODULE_NAME}/g" {} \; \
  -exec sed -i '' "s/3003/${NEW_PORT}/g" {} \; \
  -exec sed -i '' "s/微前端模板系统/${NEW_TITLE}/g" {} \; \
  -exec sed -i '' "s/模板系统/${NEW_TITLE}/g" {} \;

echo "✅ 配置替换完成！"
echo "📝 请检查以下文件并手动调整："
echo "   - src/pages/ 目录下的页面内容"
echo "   - src/routes/index.ts 中的路由配置"
echo "   - README.md 中的项目描述"
```

### 3. 手动检查和调整

执行脚本后，请检查以下关键文件：

#### package.json
```json
{
  "name": "mf-your-module",
  "description": "您的模块描述"
}
```

#### src/config/deployment.ts
```typescript
export const deploymentConfig = {
  // 当前模块 URL
  yourModuleApp: {
    development: 'http://localhost:3004',
    production: 'https://luozyiii.github.io/mf-your-module'
  },
  basename: {
    development: '',
    production: '/mf-your-module'
  }
};
```

#### src/routes/index.ts
```typescript
export const yourModuleRoutes = [
  {
    path: '/',
    name: '首页',
    icon: 'HomeOutlined',
    component: 'Dashboard'
  },
  // 添加您的业务路由...
];
```

### 4. 安装依赖并测试

```bash
npm install
npm run dev  # 启动开发服务器
npm run build  # 测试构建
```

## 📋 配置检查清单

- [ ] package.json 中的项目名称和描述
- [ ] rsbuild.config.ts 中的端口和标题
- [ ] module-federation.config.ts 中的模块名称
- [ ] src/config/deployment.ts 中的 URL 配置
- [ ] .github/workflows/deploy.yml 中的 PUBLIC_URL
- [ ] public/404.html 中的路径配置
- [ ] src/routes/index.ts 中的路由配置
- [ ] src/pages/ 目录下的页面内容
- [ ] README.md 中的项目文档

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 创建新的页面组件
2. 在 `src/routes/index.ts` 添加路由配置
3. 在 `src/App.tsx` 添加路由映射
4. 在 `src/components/Layout.tsx` 添加菜单项

### 自定义样式

- 全局样式：修改 `src/App.css`
- 组件样式：使用 Ant Design 主题或 CSS-in-JS

### 环境配置

- 开发环境：`npm run dev`
- 生产构建：`npm run build`
- 预览构建：`npm run preview`

## 🚀 部署

### GitHub Pages 部署

1. 推送代码到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为部署源
4. 推送到 main 分支自动触发部署

### 手动部署

```bash
npm run deploy
```

## 📁 项目结构说明

```
mf-your-module/
├── .github/workflows/    # CI/CD 配置
├── public/              # 静态资源
├── src/
│   ├── components/      # 通用组件
│   ├── config/         # 配置文件
│   ├── pages/          # 页面组件
│   ├── routes/         # 路由配置
│   ├── utils/          # 工具函数
│   └── App.tsx         # 主应用
├── package.json        # 项目配置
├── rsbuild.config.ts   # 构建配置
└── module-federation.config.ts  # 微前端配置
```

## ⚠️ 注意事项

1. **端口冲突**：确保每个子系统使用不同的端口号
2. **模块名称**：Module Federation 的模块名称必须唯一
3. **路由配置**：basename 配置要与部署路径一致
4. **认证集成**：确保与主应用的认证系统正确集成
5. **依赖版本**：保持与其他子系统的依赖版本一致

## 🆘 常见问题

### Q: 如何修改端口号？
A: 修改 `rsbuild.config.ts` 中的 `server.port` 和 `deployment.ts` 中的开发环境 URL。

### Q: 如何添加新的依赖？
A: 使用 `npm install package-name` 安装，确保与其他子系统版本兼容。

### Q: 如何调试微前端集成？
A: 在浏览器开发者工具中检查 Module Federation 的加载情况和控制台错误。

### Q: 如何自定义主题？
A: 修改 Ant Design 的主题配置或在 `App.css` 中覆盖样式。

#!/bin/bash

# 微前端子系统创建脚本
# 使用方法: ./create-new-module.sh <module-name> <port> <title>
# 示例: ./create-new-module.sh inventory 3004 "库存管理系统"

set -e

# 检查参数
if [ $# -ne 3 ]; then
    echo "❌ 参数错误！"
    echo "使用方法: $0 <module-name> <port> <title>"
    echo "示例: $0 inventory 3004 \"库存管理系统\""
    exit 1
fi

MODULE_NAME=$1
PORT=$2
TITLE=$3
PROJECT_NAME="mf-${MODULE_NAME}"

# 验证模块名称（只允许字母、数字、连字符）
if [[ ! $MODULE_NAME =~ ^[a-zA-Z0-9-]+$ ]]; then
    echo "❌ 模块名称只能包含字母、数字和连字符"
    exit 1
fi

# 验证端口号
if [[ ! $PORT =~ ^[0-9]+$ ]] || [ $PORT -lt 3000 ] || [ $PORT -gt 9999 ]; then
    echo "❌ 端口号必须是 3000-9999 之间的数字"
    exit 1
fi

echo "🚀 开始创建微前端子系统..."
echo "📦 项目名称: $PROJECT_NAME"
echo "🔌 端口号: $PORT"
echo "📝 标题: $TITLE"
echo ""

# 检查目标目录是否存在
if [ -d "../$PROJECT_NAME" ]; then
    echo "❌ 目录 ../$PROJECT_NAME 已存在！"
    exit 1
fi

# 复制模板
echo "📁 复制模板文件..."
cp -r . "../$PROJECT_NAME"
cd "../$PROJECT_NAME"

# 删除不需要的文件
rm -rf node_modules dist .git scripts/create-new-module.sh TEMPLATE_USAGE.md

echo "🔄 替换配置文件..."

# 替换文件内容的函数
replace_in_file() {
    local file=$1
    if [ -f "$file" ]; then
        # macOS 使用 sed -i ''，Linux 使用 sed -i
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/mf-template/$PROJECT_NAME/g" "$file"
            sed -i '' "s/template/$MODULE_NAME/g" "$file"
            sed -i '' "s/3003/$PORT/g" "$file"
            sed -i '' "s/微前端模板系统/$TITLE/g" "$file"
            sed -i '' "s/模板系统/$TITLE/g" "$file"
            sed -i '' "s/templateApp/${MODULE_NAME}App/g" "$file"
            sed -i '' "s/templateUrl/${MODULE_NAME}Url/g" "$file"
        else
            sed -i "s/mf-template/$PROJECT_NAME/g" "$file"
            sed -i "s/template/$MODULE_NAME/g" "$file"
            sed -i "s/3003/$PORT/g" "$file"
            sed -i "s/微前端模板系统/$TITLE/g" "$file"
            sed -i "s/模板系统/$TITLE/g" "$file"
            sed -i "s/templateApp/${MODULE_NAME}App/g" "$file"
            sed -i "s/templateUrl/${MODULE_NAME}Url/g" "$file"
        fi
    fi
}

# 需要替换的文件列表
files_to_replace=(
    "package.json"
    "rsbuild.config.ts"
    "module-federation.config.ts"
    "tsconfig.node.json"
    "src/config/deployment.ts"
    "src/routes/index.ts"
    "src/App.tsx"
    "src/components/Layout.tsx"
    "src/pages/Dashboard.tsx"
    "src/pages/Feature1.tsx"
    "src/pages/Feature2.tsx"
    "src/pages/Settings.tsx"
    "src/pages/NotFound.tsx"
    "public/index.html"
    "public/404.html"
    ".github/workflows/deploy.yml"
    "README.md"
)

# 执行替换
for file in "${files_to_replace[@]}"; do
    replace_in_file "$file"
done

# 特殊处理：更新 deployment.ts 中的路由导出名称
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/templateRoutes/${MODULE_NAME}Routes/g" "src/routes/index.ts"
    sed -i '' "s/templateRoutes/${MODULE_NAME}Routes/g" "src/App.tsx"
else
    sed -i "s/templateRoutes/${MODULE_NAME}Routes/g" "src/routes/index.ts"
    sed -i "s/templateRoutes/${MODULE_NAME}Routes/g" "src/App.tsx"
fi

# 更新 README.md
cat > README.md << EOF
# $TITLE ($PROJECT_NAME)

这是一个基于微前端架构的 $TITLE 子系统。

## 🚀 快速开始

### 开发环境

\`\`\`bash
npm install
npm run dev
\`\`\`

访问 http://localhost:$PORT

### 生产构建

\`\`\`bash
npm run build
\`\`\`

## 📦 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x
- **构建工具**: Rsbuild + Module Federation
- **路由管理**: React Router 7.x
- **部署平台**: GitHub Pages

## 🔧 开发指南

### 项目结构

\`\`\`
$PROJECT_NAME/
├── src/
│   ├── components/     # 通用组件
│   ├── config/        # 配置文件
│   ├── pages/         # 页面组件
│   ├── routes/        # 路由配置
│   └── utils/         # 工具函数
├── public/            # 静态资源
└── .github/workflows/ # CI/CD 配置
\`\`\`

### 添加新页面

1. 在 \`src/pages/\` 创建页面组件
2. 在 \`src/routes/index.ts\` 添加路由配置
3. 在 \`src/App.tsx\` 添加路由映射
4. 在 \`src/components/Layout.tsx\` 添加菜单项

## 🚀 部署

项目配置了 GitHub Actions 自动部署到 GitHub Pages。

推送代码到 main 分支即可自动触发部署。

## 📄 许可证

MIT License
EOF

echo ""
echo "✅ 微前端子系统创建完成！"
echo ""
echo "📁 项目目录: $PROJECT_NAME"
echo "🔌 开发端口: $PORT"
echo "📝 项目标题: $TITLE"
echo ""
echo "🔄 下一步操作："
echo "   cd $PROJECT_NAME"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "🌐 开发地址: http://localhost:$PORT"
echo "📚 部署地址: https://luozyiii.github.io/$PROJECT_NAME"
echo ""
echo "🎉 开始您的开发之旅吧！"

#!/bin/bash

# 微前端子系统模板设置脚本
# 用于快速配置新的微前端子系统

set -e

echo "🎯 微前端子系统模板设置向导"
echo "=================================="

# 检查是否在模板目录中
if [ ! -f "package.json" ] || ! grep -q '"name": "mf-template"' package.json; then
    echo "❌ 错误：请在 mf-template 目录中运行此脚本"
    exit 1
fi

# 获取用户输入
read -p "📝 请输入模块名称 (例如: inventory, order, user): " MODULE_NAME
read -p "📝 请输入端口号 (例如: 3004): " PORT
read -p "📝 请输入应用显示名称 (例如: 库存管理系统): " APP_DISPLAY_NAME
read -p "📝 请输入 GitHub 用户名 (例如: luozyiii): " GITHUB_USERNAME

# 验证输入
if [ -z "$MODULE_NAME" ] || [ -z "$PORT" ] || [ -z "$APP_DISPLAY_NAME" ] || [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 错误：所有字段都是必填的"
    exit 1
fi

# 验证端口号
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 3000 ] || [ "$PORT" -gt 9999 ]; then
    echo "❌ 错误：端口号必须是 3000-9999 之间的数字"
    exit 1
fi

# 验证模块名称格式
if ! [[ "$MODULE_NAME" =~ ^[a-z][a-z0-9-]*$ ]]; then
    echo "❌ 错误：模块名称只能包含小写字母、数字和连字符，且必须以字母开头"
    exit 1
fi

PROJECT_NAME="mf-$MODULE_NAME"

echo ""
echo "📋 配置确认："
echo "   模块名称: $MODULE_NAME"
echo "   项目名称: $PROJECT_NAME"
echo "   端口号: $PORT"
echo "   显示名称: $APP_DISPLAY_NAME"
echo "   GitHub 用户名: $GITHUB_USERNAME"
echo ""

read -p "确认配置正确吗？(y/N): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "❌ 已取消设置"
    exit 1
fi

echo ""
echo "🔄 开始配置环境变量..."

# 更新 .env 文件
cat > .env << EOF
# 开发环境配置
NODE_ENV=development

# 应用基本信息
MODULE_NAME=$MODULE_NAME
APP_DISPLAY_NAME=$APP_DISPLAY_NAME
PROJECT_NAME=$PROJECT_NAME
PORT=$PORT

# GitHub 配置
GITHUB_USERNAME=$GITHUB_USERNAME

# 主应用配置
SHELL_URL=http://localhost:3000

# 当前应用配置
CURRENT_APP_URL=http://localhost:$PORT

# 路由配置
BASENAME=
EOF

# 更新 .env.production 文件
cat > .env.production << EOF
# 生产环境配置
NODE_ENV=production

# 应用基本信息
MODULE_NAME=$MODULE_NAME
APP_DISPLAY_NAME=$APP_DISPLAY_NAME
PROJECT_NAME=$PROJECT_NAME
PORT=$PORT

# GitHub 配置
GITHUB_USERNAME=$GITHUB_USERNAME

# 主应用配置
SHELL_URL=https://$GITHUB_USERNAME.github.io/mf-shell

# 当前应用配置
CURRENT_APP_URL=https://$GITHUB_USERNAME.github.io/$PROJECT_NAME

# 路由配置
BASENAME=/$PROJECT_NAME
EOF

# 更新 package.json
sed -i.bak "s/\"name\": \"mf-template\"/\"name\": \"$PROJECT_NAME\"/" package.json
sed -i.bak "s/\"description\": \"微前端子系统标准模板\"/\"description\": \"$APP_DISPLAY_NAME - 微前端子系统\"/" package.json
rm -f package.json.bak

# 更新 GitHub Actions 配置
if [ -f ".github/workflows/deploy.yml" ]; then
    sed -i.bak "s/PUBLIC_URL: https:\/\/luozyiii\.github\.io\/mf-template\//PUBLIC_URL: https:\/\/$GITHUB_USERNAME.github.io\/$PROJECT_NAME\//" .github/workflows/deploy.yml
    rm -f .github/workflows/deploy.yml.bak
fi

# 更新 404.html
if [ -f "public/404.html" ]; then
    sed -i.bak "s/\/mf-template/\/$PROJECT_NAME/g" public/404.html
    rm -f public/404.html.bak
fi

echo ""
echo "🧹 清理模板文件..."

# 删除模板相关文件
rm -f scripts/setup-template.sh
rm -f TEMPLATE_USAGE.md

echo ""
echo "✅ 模板设置完成！"
echo ""
echo "📋 下一步操作："
echo "   1. 检查生成的 .env 和 .env.production 文件"
echo "   2. 运行 'pnpm install' 安装依赖"
echo "   3. 运行 'pnpm dev' 启动开发服务器"
echo "   4. 根据需要修改页面内容和路由"
echo ""
echo "🚀 开始您的微前端开发之旅吧！"

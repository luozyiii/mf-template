import { Card, Space, Table, Tag, Typography } from 'antd';
import type React from 'react';

const { Title, Paragraph } = Typography;

const Feature2: React.FC = () => {
  // 示例配置数据
  const configData = [
    {
      key: '1',
      name: 'rsbuild.config.ts',
      description: 'Rsbuild 构建配置',
      status: 'required',
      category: '构建配置',
    },
    {
      key: '2',
      name: 'module-federation.config.ts',
      description: 'Module Federation 配置',
      status: 'required',
      category: '微前端',
    },
    {
      key: '3',
      name: 'deployment.ts',
      description: '部署环境配置',
      status: 'required',
      category: '部署配置',
    },
    {
      key: '4',
      name: 'authUtils.ts',
      description: '认证工具函数',
      status: 'required',
      category: '工具函数',
    },
    {
      key: '5',
      name: '404.html',
      description: 'SPA 路由重定向',
      status: 'required',
      category: 'GitHub Pages',
    },
    {
      key: '6',
      name: 'deploy.yml',
      description: 'GitHub Actions 部署流程',
      status: 'required',
      category: 'CI/CD',
    },
  ];

  const columns = [
    {
      title: '配置文件',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag
          color={
            category === '构建配置'
              ? 'blue'
              : category === '微前端'
                ? 'green'
                : category === '部署配置'
                  ? 'orange'
                  : category === '工具函数'
                    ? 'purple'
                    : category === 'GitHub Pages'
                      ? 'red'
                      : 'default'
          }
        >
          {category}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'required' ? 'red' : 'green'}>
          {status === 'required' ? '必需' : '可选'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginTop: 0 }}>
        功能模块2
      </Title>
      <Paragraph>
        这个页面展示了模板项目中包含的所有配置文件和它们的作用。
      </Paragraph>

      <Card title="模板配置文件清单" style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={configData}
          pagination={false}
          size="middle"
        />
      </Card>

      <Card title="使用说明" style={{ marginTop: 0 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={4}>🔧 配置文件修改</Title>
            <Paragraph>
              创建新项目时，需要修改以下变量：
              <ul>
                <li>
                  <code>项目名称</code>：package.json 中的 name 字段
                </li>
                <li>
                  <code>端口号</code>：rsbuild.config.ts 中的 server.port
                </li>
                <li>
                  <code>模块名</code>：module-federation.config.ts 中的 name
                </li>
                <li>
                  <code>URL 配置</code>：deployment.ts 中的各种 URL
                </li>
              </ul>
            </Paragraph>
          </div>
          <div>
            <Title level={4}>📁 目录结构</Title>
            <Paragraph>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                }}
              >
                {`mf-template/
├── .github/workflows/     # GitHub Actions 配置
├── public/               # 静态资源
├── src/
│   ├── components/       # 通用组件
│   ├── config/          # 配置文件
│   ├── pages/           # 页面组件
│   ├── routes/          # 路由配置
│   └── utils/           # 工具函数
├── package.json         # 项目配置
├── rsbuild.config.ts    # 构建配置
└── module-federation.config.ts  # 微前端配置`}
              </pre>
            </Paragraph>
          </div>
        </Space>
      </Card>

      {/* 添加更多内容来测试滚动功能 */}
      {Array.from({ length: 8 }, (_, index) => (
        <Card
          key={index}
          title={`配置示例 ${index + 1}`}
          style={{ marginBottom: '24px' }}
        >
          <Paragraph>
            这是第 {index + 1} 个配置示例卡片。这些卡片用于测试页面滚动功能。
          </Paragraph>
          <Paragraph>
            <Title level={5}>示例配置内容：</Title>
            <pre
              style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {`// 示例配置 ${index + 1}
export const config${index + 1} = {
  name: 'example-${index + 1}',
  version: '1.0.${index}',
  enabled: true,
  settings: {
    autoScroll: true,
    smooth: true,
    delay: ${index * 100}
  }
};`}
            </pre>
          </Paragraph>
          <Tag color="blue">配置 {index + 1}</Tag>
          <Tag color="green">已启用</Tag>
          <Tag color="orange">测试用途</Tag>
        </Card>
      ))}
    </div>
  );
};

export default Feature2;

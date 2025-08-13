import { Alert, Card, Space, Steps, Typography } from 'antd';
import type React from 'react';

const { Title, Paragraph, Text } = Typography;

const Feature1: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginTop: 0 }}>
        功能模块1
      </Title>
      <Paragraph>
        这是一个示例功能模块页面。您可以根据实际需求替换为具体的业务功能。
      </Paragraph>

      <Alert
        message="模板说明"
        description="此页面展示了如何创建一个标准的功能模块页面，包含标题、内容区域和操作按钮等基础元素。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title="开发步骤" style={{ marginBottom: '24px' }}>
        <Steps
          direction="vertical"
          current={-1}
          items={[
            {
              title: '复制模板项目',
              description:
                '将此模板项目复制到新的目录，并重命名为目标项目名称。',
            },
            {
              title: '修改配置文件',
              description:
                '更新 package.json、rsbuild.config.ts 等配置文件中的项目名称和端口。',
            },
            {
              title: '更新部署配置',
              description: '修改 deployment.ts 中的 URL 配置和 basename 设置。',
            },
            {
              title: '开发业务功能',
              description: '替换示例页面为实际的业务功能页面。',
            },
            {
              title: '配置 GitHub Actions',
              description: '设置 GitHub Pages 自动部署流程。',
            },
          ]}
        />
      </Card>

      <Card title="技术栈">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>前端框架：</Text>
            <Text>React 18 + TypeScript</Text>
          </div>
          <div>
            <Text strong>UI 组件库：</Text>
            <Text>Ant Design 5.x</Text>
          </div>
          <div>
            <Text strong>构建工具：</Text>
            <Text>Rsbuild + Module Federation</Text>
          </div>
          <div>
            <Text strong>路由管理：</Text>
            <Text>React Router 7.x</Text>
          </div>
          <div>
            <Text strong>部署平台：</Text>
            <Text>GitHub Pages</Text>
          </div>
        </Space>
      </Card>

      {/* 添加更多内容来测试滚动功能 */}
      {Array.from({ length: 10 }, (_, index) => (
        <Card
          key={index}
          title={`测试卡片 ${index + 1}`}
          style={{ marginBottom: '24px' }}
        >
          <Paragraph>
            这是第 {index + 1} 个测试卡片，用于测试页面滚动功能。
            当您在不同页面之间切换时，页面应该自动滚动到顶部。
          </Paragraph>
          <Paragraph>滚动功能特性：</Paragraph>
          <ul>
            <li>路由切换时自动滚动到顶部</li>
            <li>支持平滑滚动动画</li>
            <li>微前端环境下的跨应用滚动</li>
            <li>兼容不同的滚动容器</li>
          </ul>
          <Text type="secondary">
            卡片编号：{index + 1} | 当前时间：{new Date().toLocaleTimeString()}
          </Text>
        </Card>
      ))}

      <Alert
        message="滚动测试说明"
        description="请尝试滚动到页面底部，然后切换到其他页面，再切换回来，观察页面是否自动滚动到顶部。"
        type="success"
        showIcon
        style={{ marginBottom: '24px' }}
      />
    </div>
  );
};

export default Feature1;

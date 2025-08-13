import {
  AppstoreOutlined,
  ControlOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import type React from 'react';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginTop: 0 }}>
        微前端模板系统
      </Title>
      <Paragraph>
        这是一个微前端子系统的标准模板，包含了所有必要的配置和基础功能。
        您可以基于此模板快速创建新的微前端子系统。
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="模板特性"
              value={8}
              prefix={<AppstoreOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="配置文件"
              value={12}
              prefix={<SettingOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="页面组件"
              value={4}
              prefix={<UserOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="工具函数"
              value={6}
              prefix={<ControlOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      <Card title="模板功能" style={{ marginTop: '24px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={4}>✅ 完整的微前端配置</Title>
            <Paragraph>包含 Module Federation、路由、部署等完整配置</Paragraph>
          </div>
          <div>
            <Title level={4}>✅ 统一的认证系统</Title>
            <Paragraph>与主应用集成的认证和权限管理</Paragraph>
          </div>
          <div>
            <Title level={4}>✅ GitHub Pages 部署</Title>
            <Paragraph>支持自动化部署到 GitHub Pages</Paragraph>
          </div>
          <div>
            <Title level={4}>✅ 响应式布局</Title>
            <Paragraph>基于 Ant Design 的现代化 UI 组件</Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;

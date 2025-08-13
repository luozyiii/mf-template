import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import type React from 'react';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginTop: 0 }}>
        系统设置
      </Title>
      <Paragraph>这是一个示例设置页面，展示了常见的系统配置选项。</Paragraph>

      <Card title="基础配置" style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            theme: 'light',
            language: 'zh-CN',
            notifications: true,
            autoSave: false,
          }}
        >
          <Form.Item label="系统主题" name="theme" tooltip="选择系统的显示主题">
            <Select>
              <Option value="light">浅色主题</Option>
              <Option value="dark">深色主题</Option>
              <Option value="auto">跟随系统</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="显示语言"
            name="language"
            tooltip="选择系统的显示语言"
          >
            <Select>
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
              <Option value="ja-JP">日本語</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="系统名称"
            name="systemName"
            tooltip="自定义系统显示名称"
          >
            <Input placeholder="请输入系统名称" />
          </Form.Item>

          <Divider />

          <Form.Item
            label="推送通知"
            name="notifications"
            valuePropName="checked"
            tooltip="是否接收系统推送通知"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="自动保存"
            name="autoSave"
            valuePropName="checked"
            tooltip="是否自动保存用户操作"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
              <Button onClick={() => form.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="开发者选项">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={4}>🔧 调试模式</Title>
            <Paragraph>
              在开发环境中启用调试模式，显示更多的日志信息和开发工具。
            </Paragraph>
            <Switch
              defaultChecked={
                typeof window !== 'undefined' &&
                (window as any).__NODE_ENV__ === 'development'
              }
              disabled
            />
          </div>
          <div>
            <Title level={4}>📊 性能监控</Title>
            <Paragraph>
              启用性能监控，收集页面加载时间、用户交互等性能数据。
            </Paragraph>
            <Switch />
          </div>
          <div>
            <Title level={4}>🔍 错误追踪</Title>
            <Paragraph>启用错误追踪，自动收集和报告应用程序错误。</Paragraph>
            <Switch />
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Settings;

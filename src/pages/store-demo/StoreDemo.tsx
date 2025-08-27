import { DatabaseOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  message,
  Row,
  Space,
  Typography,
} from 'antd';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

const { Title, Text } = Typography;

const StoreDemo: React.FC = () => {
  const [currentData, setCurrentData] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      // @ts-expect-error - Module Federation 动态导入
      const { getStoreValue } = await import('mf-shared/store');
      
      const userinfo = getStoreValue('user');
      const appConfig = getStoreValue('app');
      
      setCurrentData({
        userinfo: userinfo || { name: '未设置', age: 0, role: 'guest' },
        appConfig: appConfig || {
          theme: 'light',
          language: 'zh-CN',
          version: '1.0.0',
        },
      });
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setIsConnected(false);
      // 设置默认数据
      setCurrentData({
        userinfo: { name: '未设置', age: 0, role: 'guest' },
        appConfig: { theme: 'light', language: 'zh-CN', version: '1.0.0' },
      });
    }
  }, []);

  useEffect(() => {
    refreshData();
    
    // 定期刷新数据
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const updateData = useCallback(async (key: string, value: any) => {
    try {
      // @ts-expect-error - Module Federation 动态导入
      const { setStoreValue } = await import('mf-shared/store');
      setStoreValue(key, value);
      message.success('数据已更新');
      setTimeout(refreshData, 100); // 延迟刷新以确保数据同步
    } catch (error) {
      console.error('Failed to update data:', error);
      message.error('更新失败');
    }
  }, [refreshData]);

  const updateUserName = () => {
    const number = Math.floor(Math.random() * 900) + 100;
    const newName = `模板用户${number}`;
    const newUser = { ...currentData.userinfo, name: newName };
    updateData('user', newUser);
  };

  const updateTheme = () => {
    const newTheme = currentData.appConfig?.theme === 'dark' ? 'light' : 'dark';
    const newConfig = { ...currentData.appConfig, theme: newTheme };
    updateData('app', newConfig);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>全局存储演示</Title>
      <Text type="secondary">
        这个页面展示了如何在模板应用中访问和修改全局存储的数据。
        数据变更会同步到主应用和其他子应用。
      </Text>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card size="small">
            <Space>
              <Text strong>连接状态：</Text>
              <Text type={isConnected ? 'success' : 'danger'}>
                {isConnected ? '已连接' : '未连接'}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                用户信息
              </Space>
            }
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="用户名">
                {currentData.userinfo?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="年龄">
                {currentData.userinfo?.age || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="角色">
                {currentData.userinfo?.role || '-'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Space>
              <Button type="primary" onClick={updateUserName}>
                更新用户名
              </Button>
              <Button onClick={refreshData}>
                刷新数据
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <DatabaseOutlined />
                应用配置
              </Space>
            }
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="主题">
                {currentData.appConfig?.theme || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="语言">
                {currentData.appConfig?.language || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="版本">
                {currentData.appConfig?.version || '-'}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Space>
              <Button onClick={updateTheme}>
                切换主题
              </Button>
              <Button onClick={refreshData}>
                刷新数据
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="数据详情" size="small">
            <div
              style={{
                background: '#f7f8fa',
                border: '1px solid #f0f0f0',
                borderRadius: 4,
                padding: 16,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12,
                lineHeight: 1.6,
                overflow: 'auto',
                maxHeight: 300,
              }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(currentData, null, 2)}
              </pre>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoreDemo;

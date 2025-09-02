import { DatabaseOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Divider, message, Row, Space, Typography } from 'antd';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const StoreDemo: React.FC = () => {
  const [currentData, setCurrentData] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const { t } = useTranslation();

  const refreshData = useCallback(async () => {
    try {
      // @ts-ignore - Module Federation 动态导入
      const { getStoreValue } = await import('mf-shared/store');

      const userinfo = getStoreValue('user');
      const appConfig = getStoreValue('app');

      setCurrentData({
        userinfo: userinfo || {
          name: t('storeDemo.notSet'),
          age: 0,
          role: t('storeDemo.defaultRole'),
        },
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
        userinfo: { name: t('storeDemo.notSet'), age: 0, role: t('storeDemo.defaultRole') },
        appConfig: { theme: 'light', language: 'zh-CN', version: '1.0.0' },
      });
    }
  }, [t]);

  useEffect(() => {
    refreshData();

    // 定期刷新数据
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const updateData = useCallback(
    async (key: string, value: any) => {
      try {
        // @ts-ignore - Module Federation 动态导入
        const { setStoreValue } = await import('mf-shared/store');
        setStoreValue(key, value);
        message.success(t('storeDemo.dataUpdated'));
        setTimeout(refreshData, 100); // 延迟刷新以确保数据同步
      } catch (error) {
        console.error('Failed to update data:', error);
        message.error(t('storeDemo.updateFailed'));
      }
    },
    [refreshData, t]
  );

  const updateUserName = () => {
    const number = Math.floor(Math.random() * 900) + 100;
    const newName = `${t('storeDemo.templateUser')}${number}`;
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
      <Title level={3}>{t('storeDemo.title')}</Title>
      <Text type="secondary">{t('storeDemo.description')}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card size="small">
            <Space>
              <Text strong>{t('storeDemo.connectionStatus')}：</Text>
              <Text type={isConnected ? 'success' : 'danger'}>
                {isConnected ? t('storeDemo.connected') : t('storeDemo.disconnected')}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                {t('storeDemo.userInfo')}
              </Space>
            }
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={t('storeDemo.username')}>
                {currentData.userinfo?.name || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('storeDemo.age')}>
                {currentData.userinfo?.age || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('storeDemo.role')}>
                {currentData.userinfo?.role || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Space>
              <Button type="primary" onClick={updateUserName}>
                {t('storeDemo.updateUsername')}
              </Button>
              <Button onClick={refreshData}>{t('storeDemo.refreshData')}</Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <DatabaseOutlined />
                {t('storeDemo.appConfig')}
              </Space>
            }
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={t('storeDemo.theme')}>
                {currentData.appConfig?.theme || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('storeDemo.language')}>
                {currentData.appConfig?.language || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('storeDemo.version')}>
                {currentData.appConfig?.version || '-'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Space>
              <Button onClick={updateTheme}>{t('storeDemo.toggleTheme')}</Button>
              <Button onClick={refreshData}>{t('storeDemo.refreshData')}</Button>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={t('storeDemo.dataDetails')} size="small">
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
              <pre style={{ margin: 0 }}>{JSON.stringify(currentData, null, 2)}</pre>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoreDemo;

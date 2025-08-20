import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  message,
  Space,
  Divider,
  Timeline,
  List,
  Descriptions,
} from 'antd';
import { UserOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';

import { getVal, setVal, subscribeVal, ensureMigrated } from '../store/keys';

const { Title, Text, Paragraph } = Typography;

// 添加滚动容器的样式
const scrollContainerStyle = {
  maxHeight: '300px',
  overflowY: 'auto' as const,
  padding: '8px 0',
  // 自定义滚动条样式
  scrollbarWidth: 'thin' as const,
  scrollbarColor: '#d9d9d9 transparent',
  // WebKit 浏览器滚动条样式
  WebkitScrollbar: {
    width: '6px',
  },
  WebkitScrollbarTrack: {
    background: 'transparent',
  },
  WebkitScrollbarThumb: {
    background: '#d9d9d9',
    borderRadius: '3px',
  },
  WebkitScrollbarThumbHover: {
    background: '#bfbfbf',
  },
};

const StoreDemo: React.FC = () => {
  const [_storeModule, setStoreModule] = useState<any>(null);
  const [currentData, setCurrentData] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);

  const notificationScrollRef = React.useRef<HTMLDivElement>(null);
  const unsubscribeFunctionsRef = React.useRef<(() => void)[]>([]);

  // 加载存储模块
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run once on mount and cleanup
  useEffect(() => {
    loadStoreModule();
    return () => {
      unsubscribeFunctionsRef.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeFunctionsRef.current = [];
    };
  }, []);

  const addNotification = useCallback((notification: any) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 9)]); // 保留最新10条
    setTimeout(() => {
      if (notificationScrollRef.current) {
        notificationScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const refreshData = useCallback(() => {
    try {
      ensureMigrated();
      const userinfo = getVal('user');
      const appConfig = getVal('app');
      const token = getVal('token');
      const permissions = getVal('roles');
      setCurrentData({
        userinfo: userinfo || {},
        appConfig: appConfig || {},
        token: token || '',
        permissions: permissions || {},
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, []);

  const loadStoreModule = useCallback(async () => {
    try {
      // @ts-ignore - 模块联邦动态导入
      const module = await import('mf-shared/store');
      setStoreModule(module);

      // 获取当前数据（短键 + 迁移）
      try {
        ensureMigrated();
        const userinfo = getVal('user');
        const appConfig = getVal('app');
        const token = getVal('token');
        const permissions = getVal('roles');
        setCurrentData({
          userinfo: userinfo || {},
          appConfig: appConfig || {},
          token: token || '',
          permissions: permissions || {},
        });
      } catch (e) {
        console.warn('Initial refresh failed', e);
      }

      // 清理之前的订阅
      unsubscribeFunctionsRef.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeFunctionsRef.current = [];

      // 订阅数据变化（短键 + 旧键兼容）
      const unsubscribeUserinfo = subscribeVal(
        'user',
        (_key: string, newVal: any) => {
          refreshData();
          message.success(`收到用户信息更新`);
          addNotification({
            type: 'userinfo',
            message: `用户信息更新: ${JSON.stringify(newVal)}`,
            time: new Date().toLocaleTimeString(),
          });
        }
      );

      const unsubscribeAppConfig = subscribeVal(
        'app',
        (_key: string, newVal: any) => {
          refreshData();
          message.info(`收到配置更新`);
          addNotification({
            type: 'config',
            message: `配置更新: ${JSON.stringify(newVal)}`,
            time: new Date().toLocaleTimeString(),
          });
        }
      );

      const unsubscribeNotifications = module.subscribeStore(
        'notifications',
        (_key: string, newVal: any) => {
          if (newVal?.message) {
            message.info(`收到通知: ${newVal.message}`);
            addNotification({
              type: 'notification',
              message: newVal.message,
              time: new Date().toLocaleTimeString(),
            });
          }
        }
      );

      // 保存取消订阅函数
      unsubscribeFunctionsRef.current = [
        unsubscribeUserinfo,
        unsubscribeAppConfig,
        unsubscribeNotifications,
      ];
    } catch (error) {
      console.error('Failed to load store module:', error);
    }
  }, [addNotification, refreshData]);

  // 注意：下两个函数必须在 loadStoreModule 之前声明，避免依赖顺序报错

  // 用户信息操作
  const updateUsername = () => {
    const curUser = (getVal('user') as any) || {};
    const number = Math.floor(Math.random() * 900) + 100;
    const newName = `用户${number}`;
    setVal('user', { ...curUser, name: newName });
    addNotification({
      type: 'userinfo',
      message: `用户名更新为: ${newName}`,
      time: new Date().toLocaleTimeString(),
    });
    refreshData();
    message.success(`用户名已更新: ${newName}`);
  };

  const updateAge = () => {
    const curUser = (getVal('user') as any) || {};
    const newAge = (Number(curUser?.age) || 0) + 1;
    setVal('user', { ...curUser, age: newAge });
    addNotification({
      type: 'userinfo',
      message: `年龄更新为: ${newAge}`,
      time: new Date().toLocaleTimeString(),
    });
    refreshData();
    message.success(`年龄已更新为: ${newAge}`);
  };

  const updateUserRoles = () => {
    const curUser = (getVal('user') as any) || {};
    let roles: string[] = Array.isArray(curUser?.roles)
      ? [...curUser.roles]
      : curUser?.role
        ? [curUser.role]
        : [];
    if (roles.includes('developer')) {
      roles = roles.filter((r) => r !== 'developer');
    } else {
      roles.push('developer');
    }
    const nextUser = { ...curUser, roles, role: roles[0] };
    setVal('user', nextUser);
    addNotification({
      type: 'userinfo',
      message: `角色更新: ${roles.join(', ') || '无'}`,
      time: new Date().toLocaleTimeString(),
    });
    refreshData();
    message.success('用户角色已更新');
  };

  // 应用配置操作
  const toggleTheme = () => {
    const curApp = (getVal('app') as any) || {};
    const newTheme = curApp?.theme === 'dark' ? 'light' : 'dark';
    setVal('app', { ...curApp, theme: newTheme });
    addNotification({
      type: 'config',
      message: `主题切换为: ${newTheme}`,
      time: new Date().toLocaleTimeString(),
    });
    refreshData();
    message.success(`主题已切换为: ${newTheme}`);
  };

  const toggleLanguage = () => {
    const curApp = (getVal('app') as any) || {};
    const newLang = curApp?.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    setVal('app', { ...curApp, language: newLang });
    addNotification({
      type: 'config',
      message: `语言切换为: ${newLang}`,
      time: new Date().toLocaleTimeString(),
    });
    refreshData();
    message.success(`语言已切换为: ${newLang}`);
  };

  const bumpVersion = () => {
    const curApp = (getVal('app') as any) || {};
    const cur = String(curApp?.version || '1.0.0');
    const parts = cur.split('.').map((p: string) => Number(p) || 0);
    const next = [parts[0], parts[1], (parts[2] || 0) + 1].join('.');
    setVal('app', { ...curApp, version: next });
    addNotification({
      type: 'config',
      message: `版本更新为: ${next}`,
      time: new Date().toLocaleTimeString(),
    });
    refreshData();
    message.success(`版本已更新为: ${next}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 添加自定义滚动条样式 */}
      <style>
        {`
          .notification-scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          .notification-scroll-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .notification-scroll-container::-webkit-scrollbar-thumb {
            background: #d9d9d9;
            border-radius: 3px;
          }
          .notification-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #bfbfbf;
          }
          .notification-scroll-container {
            /* 确保内容不会被截断 */
            box-sizing: border-box;
          }
          .notification-scroll-container .ant-timeline {
            /* 为Timeline添加适当的边距 */
            margin-bottom: 0;
          }
          .notification-scroll-container .ant-timeline-item:last-child {
            /* 确保最后一项有足够的底部空间 */
            padding-bottom: 8px;
          }
        `}
      </style>

      <Title level={2}>🗄️ Store 演示 - 子应用</Title>
      <Paragraph>
        演示如何通过全局 Store 同步用户信息与应用配置，并实时反映到主应用。
      </Paragraph>

      <Card
        title={
          <Space>
            <UserOutlined /> 用户信息管理
          </Space>
        }
        size="small"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="用户名">
                {currentData.userinfo?.name ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="年龄">
                {currentData.userinfo?.age ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="角色">
                {Array.isArray(currentData.userinfo?.roles)
                  ? currentData.userinfo.roles.join(', ')
                  : currentData.userinfo?.role || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: '#f7f8fa',
                border: '1px solid #f0f0f0',
                borderRadius: 4,
                padding: 8,
                height: 180,
                overflow: 'auto',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(currentData.userinfo || {}, null, 2)}
              </pre>
            </div>
          </Col>
        </Row>

        <Divider />
        <Space wrap>
          <Button type="primary" onClick={updateUsername}>
            更新用户名
          </Button>
          <Button onClick={updateAge}>更新年龄</Button>
          <Button onClick={updateUserRoles}>更新角色</Button>
        </Space>
      </Card>

      {/* 应用配置管理 */}
      <Card
        style={{ marginTop: 16 }}
        title={
          <Space>
            <SettingOutlined /> 应用配置管理
          </Space>
        }
        size="small"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="主题">
                {currentData.appConfig?.theme ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="语言">
                {currentData.appConfig?.language ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="版本">
                {currentData.appConfig?.version ?? '-'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <div
              style={{
                background: '#f7f8fa',
                border: '1px solid #f0f0f0',
                borderRadius: 4,
                padding: 8,
                height: 180,
                overflow: 'auto',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <pre style={{ margin: 0 }}>
                {JSON.stringify(currentData.appConfig || {}, null, 2)}
              </pre>
            </div>
          </Col>
        </Row>

        <Divider />
        <Space wrap>
          <Button onClick={toggleTheme}>切换主题</Button>
          <Button onClick={toggleLanguage}>切换语言</Button>
          <Button onClick={bumpVersion}>版本 +1</Button>
        </Space>
      </Card>
      <Card
        title={
          <Space>
            <BellOutlined /> 实时通知
          </Space>
        }
        style={{ marginTop: 16 }}
        size="small"
      >
        <div
          ref={notificationScrollRef}
          style={scrollContainerStyle}
          className="notification-scroll-container"
        >
          {notifications.length > 0 ? (
            <Timeline style={{ paddingRight: '8px' }}>
              {notifications.map((notif, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    notif.type === 'userinfo' ? (
                      <UserOutlined />
                    ) : notif.type === 'config' ? (
                      <SettingOutlined />
                    ) : (
                      <BellOutlined />
                    )
                  }
                  color={
                    notif.type === 'userinfo'
                      ? 'blue'
                      : notif.type === 'config'
                        ? 'green'
                        : 'orange'
                  }
                >
                  <div
                    style={{
                      fontSize: '12px',
                      paddingBottom: '8px',
                      lineHeight: '1.4',
                      minHeight: '32px',
                    }}
                  >
                    <div
                      style={{
                        marginBottom: '4px',
                        fontWeight: '500',
                        color: '#262626',
                      }}
                    >
                      {notif.message}
                    </div>
                    <Text
                      type="secondary"
                      style={{ fontSize: '11px', display: 'block' }}
                    >
                      {notif.time}
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Text type="secondary">暂无通知</Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StoreDemo;

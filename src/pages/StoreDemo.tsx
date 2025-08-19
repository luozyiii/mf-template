import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  message,
  Space,
  Tag,
  Divider,
  Alert,
  Statistic,
  Timeline,
  List,
} from 'antd';
import {
  DatabaseOutlined,
  SendOutlined,
  SyncOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

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
  const [storeModule, setStoreModule] = useState<any>(null);
  const [currentData, setCurrentData] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isStandalone, setIsStandalone] = useState(false);
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
      setIsConnected(true);

      // 检查是否为独立运行模式（使用本地变量，避免异步状态导致前缀判断错误）
      const globalStore = (window as any).globalStore;
      const storageKey = globalStore?.options?.storageKey;
      const standalone = storageKey === 'mf-template-store';
      setIsStandalone(standalone);

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
          setMessageCount((prev) => prev + 1);
          setLastUpdate(new Date().toLocaleTimeString());
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
          setMessageCount((prev) => prev + 1);
          setLastUpdate(new Date().toLocaleTimeString());
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
      setIsConnected(false);
    }
  }, [addNotification, refreshData]);

  // 注意：下两个函数必须在 loadStoreModule 之前声明，避免依赖顺序报错

  const updateFromChild = () => {
    const newName = `子应用用户${Math.floor(Math.random() * 1000)}`;
    const curUser = (getVal('user') as any) || {};
    setVal('user', { ...curUser, name: newName });
    setCurrentData((prev: any) => ({
      ...prev,
      userinfo: { ...(prev?.userinfo || {}), name: newName },
    }));
    message.success(`从子应用更新用户名: ${newName}`);
  };

  const updateChildConfig = () => {
    const newLanguage =
      currentData.appConfig?.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    const curApp = (getVal('app') as any) || {};
    setVal('app', { ...curApp, language: newLanguage });
    setCurrentData((prev: any) => ({
      ...prev,
      appConfig: { ...(prev?.appConfig || {}), language: newLanguage },
    }));
    message.success(`语言已切换为: ${newLanguage}`);
  };

  const sendToParent = () => {
    if (!storeModule) return;

    const childMessage = {
      id: Date.now(),
      message: '来自子应用的消息',
      timestamp: new Date().toISOString(),
      source: 'template-app',
    };

    storeModule.setStoreValue('childMessages', childMessage);
    message.success('消息已发送到主应用');
  };

  const clearNamespace = () => {
    if (!storeModule) return;
    try {
      const prefix = isStandalone ? 'mf-template-' : 'mf-shell-';
      storeModule.clearByPrefix(prefix);
      message.success('已清理命名空间数据');
      setCurrentData({
        userinfo: {},
        appConfig: {},
        token: '',
        permissions: {},
      });
      refreshData();
    } catch (_e) {
      message.error('清理失败');
    }
  };

  const writeLargeData = () => {
    if (!storeModule) return;
    const bigArray = Array.from({ length: 800 }, (_, i) => ({
      id: i,
      text: `模板记录-${i}`,
    }));
    try {
      storeModule.configureStrategy?.('mf-template-bigdata', {
        medium: 'local',
        encrypted: false,
      });
      storeModule.setStoreValue('mf-template-bigdata', bigArray);
      message.success('已写入模板大数据到命名空间（localStorage）');
    } catch {
      message.warning('当前环境不支持配置策略，已跳过');
    }
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
        这个页面演示了子应用如何与主应用进行实时数据通信。
        {isStandalone ? '当前为独立运行模式。' : '当前连接到主应用的全局存储。'}
      </Paragraph>

      <Row gutter={[24, 24]}>
        {/* 连接状态 */}
        <Col span={24}>
          <Alert
            message={isStandalone ? '独立运行模式' : '跨应用通信模式'}
            description={
              <>
                {isConnected
                  ? isStandalone
                    ? '✅ 子应用独立运行，使用本地存储'
                    : '✅ 已连接到主应用全局存储，可以实时通信'
                  : '❌ 未连接到存储系统'}{' '}
                <br />
                {`当前命名空间前缀：${isStandalone ? 'mf-template-store' : 'mf-shell-store'}`}
              </>
            }
            type={isConnected ? (isStandalone ? 'info' : 'success') : 'error'}
            showIcon
            icon={<DatabaseOutlined />}
          />
        </Col>

        {/* 统计信息 */}
        <Col span={24}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="运行模式"
                value={isStandalone ? '独立模式' : '集成模式'}
                prefix={<SwapOutlined />}
                valueStyle={{ color: isStandalone ? '#722ed1' : '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="接收消息"
                value={messageCount}
                prefix={<BellOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="最后更新"
                value={lastUpdate || '暂无'}
                prefix={<SyncOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="连接状态"
                value={isConnected ? '已连接' : '未连接'}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: isConnected ? '#3f8600' : '#cf1322' }}
              />
            </Col>
          </Row>
        </Col>

        {/* 数据展示和操作 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                当前数据状态
              </Space>
            }
            size="small"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>用户名: </Text>
                <Tag color="blue">{currentData.userinfo?.name || '未设置'}</Tag>
              </div>
              <div>
                <Text strong>年龄: </Text>
                <Tag color="green">{currentData.userinfo?.age || '未设置'}</Tag>
              </div>
              <div>
                <Text strong>主题: </Text>
                <Tag
                  color={
                    currentData.appConfig?.theme === 'dark' ? 'default' : 'gold'
                  }
                >
                  {currentData.appConfig?.theme || '未设置'}
                </Tag>
              </div>
              <div>
                <Text strong>语言: </Text>
                <Tag color="cyan">
                  {currentData.appConfig?.language || '未设置'}
                </Tag>
              </div>

              <Divider />

              <Space wrap>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={updateFromChild}
                  size="small"
                >
                  更新用户名
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  onClick={updateChildConfig}
                  size="small"
                >
                  切换语言
                </Button>
                {!isStandalone && (
                  <Button
                    icon={<BellOutlined />}
                    onClick={sendToParent}
                    size="small"
                  >
                    发送消息
                  </Button>
                )}
                <Button
                  icon={<SyncOutlined />}
                  onClick={() => refreshData()}
                  size="small"
                >
                  刷新数据
                </Button>
              </Space>

              <Space wrap style={{ marginTop: 8 }}>
                <Button
                  icon={<DatabaseOutlined />}
                  onClick={clearNamespace}
                  size="small"
                >
                  清理模板命名空间
                </Button>
                <Button
                  icon={<DatabaseOutlined />}
                  onClick={writeLargeData}
                  size="small"
                >
                  写入大数据（策略演示）
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* 消息通知 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <BellOutlined />
                实时通知
              </Space>
            }
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
                          minHeight: '32px', // 确保每个通知项有最小高度
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
                          style={{
                            fontSize: '11px',
                            display: 'block',
                          }}
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
        </Col>

        {/* 独立运行模式特殊演示 */}
        {isStandalone && (
          <Col span={24}>
            <Card
              title={
                <Space>
                  <SwapOutlined />
                  独立运行模式演示
                </Space>
              }
              size="small"
              style={{ border: '2px solid #722ed1' }}
            >
              <Alert
                message="独立运行模式特性"
                description="当前子应用正在独立运行，以下功能仅在独立模式下可用"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small" title="模块加载演示">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button
                        type="primary"
                        block
                        onClick={() => {
                          message.success('模块A加载成功');
                          addNotification({
                            type: 'module',
                            message: '模块A已加载',
                            time: new Date().toLocaleTimeString(),
                          });
                        }}
                      >
                        加载模块A
                      </Button>
                      <Button
                        block
                        onClick={() => {
                          message.success('模块B加载成功');
                          addNotification({
                            type: 'module',
                            message: '模块B已加载',
                            time: new Date().toLocaleTimeString(),
                          });
                        }}
                      >
                        加载模块B
                      </Button>
                    </Space>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card size="small" title="本地功能演示">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button
                        type="primary"
                        block
                        onClick={() => {
                          const data = {
                            timestamp: Date.now(),
                            value: Math.random(),
                          };
                          storeModule?.setStoreValue('localData', data);
                          message.success('本地数据已保存');
                        }}
                      >
                        保存本地数据
                      </Button>
                      <Button
                        block
                        onClick={() => {
                          const data = storeModule?.getStoreValue('localData');
                          message.info(`本地数据: ${JSON.stringify(data)}`);
                        }}
                      >
                        读取本地数据
                      </Button>
                    </Space>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card size="small" title="独立服务演示">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button
                        type="primary"
                        block
                        onClick={() => {
                          // 模拟独立服务调用
                          setTimeout(() => {
                            message.success('独立服务调用成功');
                            addNotification({
                              type: 'service',
                              message: '独立服务响应成功',
                              time: new Date().toLocaleTimeString(),
                            });
                          }, 1000);
                        }}
                      >
                        调用独立服务
                      </Button>
                      <Button
                        block
                        onClick={() => {
                          message.info('独立模式下的特殊功能');
                        }}
                      >
                        特殊功能
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        )}

        {/* 使用说明 */}
        <Col span={24}>
          <Card title="使用说明" size="small">
            <Row gutter={16}>
              <Col span={isStandalone ? 24 : 12}>
                <Title level={5}>
                  {isStandalone ? '独立运行模式说明' : '跨应用通信测试'}
                </Title>
                <List size="small">
                  {isStandalone ? (
                    <>
                      <List.Item>
                        <ClockCircleOutlined
                          style={{ color: '#1890ff', marginRight: 8 }}
                        />
                        当前为独立运行模式，使用本地存储
                      </List.Item>
                      <List.Item>
                        <ClockCircleOutlined
                          style={{ color: '#1890ff', marginRight: 8 }}
                        />
                        数据会持久化到 localStorage 并加密
                      </List.Item>
                      <List.Item>
                        <ClockCircleOutlined
                          style={{ color: '#1890ff', marginRight: 8 }}
                        />
                        可以测试模块的独立功能
                      </List.Item>
                      <List.Item>
                        <ClockCircleOutlined
                          style={{ color: '#1890ff', marginRight: 8 }}
                        />
                        访问 http://localhost:3000 体验集成模式
                      </List.Item>
                      <List.Item>
                        <ClockCircleOutlined
                          style={{ color: '#1890ff', marginRight: 8 }}
                        />
                        <a
                          href={process.env.MF_SHARED_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1890ff' }}
                        >
                          查看 MF-Shared 共享模块演示 🚀
                        </a>
                      </List.Item>
                    </>
                  ) : (
                    <>
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ color: '#52c41a', marginRight: 8 }}
                        />
                        在主应用中修改数据，观察此页面的实时更新
                      </List.Item>
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ color: '#52c41a', marginRight: 8 }}
                        />
                        在此页面修改数据，观察主应用的同步变化
                      </List.Item>
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ color: '#52c41a', marginRight: 8 }}
                        />
                        所有数据变化都会触发实时通知
                      </List.Item>
                      <List.Item>
                        <CheckCircleOutlined
                          style={{ color: '#52c41a', marginRight: 8 }}
                        />
                        <a
                          href={process.env.MF_SHARED_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#52c41a' }}
                        >
                          查看 MF-Shared 共享模块演示 🚀
                        </a>
                      </List.Item>
                    </>
                  )}
                </List>
              </Col>
              {!isStandalone && (
                <Col span={12}>
                  <Title level={5}>独立运行模式</Title>
                  <List size="small">
                    <List.Item>
                      <ClockCircleOutlined
                        style={{ color: '#1890ff', marginRight: 8 }}
                      />
                      直接访问 http://localhost:3003 进入独立模式
                    </List.Item>
                    <List.Item>
                      <ClockCircleOutlined
                        style={{ color: '#1890ff', marginRight: 8 }}
                      />
                      独立模式下使用本地存储，不与主应用通信
                    </List.Item>
                    <List.Item>
                      <ClockCircleOutlined
                        style={{ color: '#1890ff', marginRight: 8 }}
                      />
                      数据仍然会持久化到 localStorage
                    </List.Item>
                  </List>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoreDemo;

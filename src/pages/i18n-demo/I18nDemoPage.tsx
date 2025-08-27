import React from 'react';
import { Card, Space, Typography, Tag, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../../i18n';

const { Title, Text, Paragraph } = Typography;

/**
 * 国际化演示页面
 * 展示微前端环境中的多语言功能
 */
const I18nDemoPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ padding: '24px' }}>
      <Card title="模板应用国际化演示" style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>当前语言: </Text>
            <Tag color="blue">{i18n.language}</Tag>
          </div>
          
          <Divider />
          
          <Title level={4}>基础翻译演示</Title>
          <Space direction="vertical">
            <Text>应用标题: {t('app.title')}</Text>
            <Text>欢迎信息: {t('app.welcome')}</Text>
            <Text>加载状态: {t('app.loading')}</Text>
            <Text>成功状态: {t('app.success')}</Text>
            <Text>错误状态: {t('app.error')}</Text>
          </Space>
          
          <Divider />
          
          <Title level={4}>导航翻译演示</Title>
          <Space wrap>
            <Tag>{t('navigation.dashboard')}</Tag>
            <Tag>{t('navigation.storeDemo')}</Tag>
            <Tag>{t('navigation.dashboardWithPerm')}</Tag>
            <Tag>{t('navigation.settings')}</Tag>
          </Space>
          
          <Divider />
          
          <Title level={4}>模板特定翻译</Title>
          <Space direction="vertical">
            <Text>模板标题: {t('template.title')}</Text>
            <Text>模板描述: {t('template.description')}</Text>
            <Text>功能特性: {t('template.features')}</Text>
            <Text>系统架构: {t('template.architecture')}</Text>
          </Space>
          
          <Divider />
          
          <Title level={4}>演示功能翻译</Title>
          <Space direction="vertical">
            <Text>存储演示: {t('demo.storeTitle')}</Text>
            <Text>权限演示: {t('demo.permissionTitle')}</Text>
            <Text>当前用户: {t('demo.currentUser')}</Text>
            <Text>用户角色: {t('demo.userRole')}</Text>
          </Space>
          
          <Divider />
          
          <Title level={4}>支持的语言</Title>
          <Space wrap>
            {supportedLanguages.map((lang) => (
              <Tag 
                key={lang.code} 
                color={i18n.language === lang.code ? 'green' : 'default'}
              >
                {lang.name} ({lang.code})
              </Tag>
            ))}
          </Space>
          
          <Divider />
          
          <Paragraph type="secondary" style={{ fontSize: '12px' }}>
            这个页面展示了模板应用在微前端环境中的多语言功能。
            当主应用切换语言时，这里的所有文本会自动同步更新。
            支持13种语言的实时切换，展示了完整的国际化解决方案。
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};

export default I18nDemoPage;

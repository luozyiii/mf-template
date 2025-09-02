import type React from 'react';
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
      <Card title={t('i18nDemo.title')} style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>{t('i18nDemo.currentLanguage')}: </Text>
            <Tag color="blue">{i18n.language}</Tag>
          </div>

          <Divider />

          <Title level={4}>{t('i18nDemo.basicTranslation')}</Title>
          <Space direction="vertical">
            <Text>
              {t('i18nDemo.appTitle')}: {t('app.title')}
            </Text>
            <Text>
              {t('i18nDemo.welcomeMessage')}: {t('app.welcome')}
            </Text>
            <Text>
              {t('i18nDemo.loadingStatus')}: {t('app.loading')}
            </Text>
            <Text>
              {t('i18nDemo.successStatus')}: {t('app.success')}
            </Text>
            <Text>
              {t('i18nDemo.errorStatus')}: {t('app.error')}
            </Text>
          </Space>

          <Divider />

          <Title level={4}>{t('i18nDemo.navigationTranslation')}</Title>
          <Space wrap>
            <Tag>{t('navigation.dashboard')}</Tag>
            <Tag>{t('navigation.storeDemo')}</Tag>
            <Tag>{t('navigation.dashboardWithPerm')}</Tag>
            <Tag>{t('navigation.settings')}</Tag>
          </Space>

          <Divider />

          <Title level={4}>{t('i18nDemo.templateSpecificTranslation')}</Title>
          <Space direction="vertical">
            <Text>模板标题: {t('template.title')}</Text>
            <Text>模板描述: {t('template.description')}</Text>
            <Text>功能特性: {t('template.features')}</Text>
            <Text>系统架构: {t('template.architecture')}</Text>
          </Space>

          <Divider />

          <Title level={4}>{t('i18nDemo.demoFunctionTranslation')}</Title>
          <Space direction="vertical">
            <Text>存储演示: {t('demo.storeTitle')}</Text>
            <Text>权限演示: {t('demo.permissionTitle')}</Text>
            <Text>当前用户: {t('demo.currentUser')}</Text>
            <Text>用户角色: {t('demo.userRole')}</Text>
          </Space>

          <Divider />

          <Title level={4}>{t('i18nDemo.supportedLanguages')}</Title>
          <Space wrap>
            {supportedLanguages.map((lang) => (
              <Tag key={lang.code} color={i18n.language === lang.code ? 'green' : 'default'}>
                {lang.name} ({lang.code})
              </Tag>
            ))}
          </Space>

          <Divider />

          <Paragraph type="secondary" style={{ fontSize: '12px' }}>
            {t('i18nDemo.pageDescription')}
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};

export default I18nDemoPage;

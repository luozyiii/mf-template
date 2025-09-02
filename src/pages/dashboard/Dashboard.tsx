import {
  AppstoreOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  RocketOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import type React from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginTop: 0 }}>
        {t('template.title')}
      </Title>
      <Paragraph>{t('template.description')}</Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('template.features')}
              value={8}
              prefix={<AppstoreOutlined />}
              suffix={t('common.unit.items')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('demo.activeUsers')}
              value={1128}
              prefix={<UserOutlined />}
              suffix={t('common.unit.people')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('demo.systemPerformance')}
              value={98.5}
              prefix={<RocketOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('demo.dataProcessing')}
              value={2.5}
              prefix={<DatabaseOutlined />}
              suffix="GB"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                {t('template.architecture')}
              </Space>
            }
          >
            <Paragraph>{t('template.architectureDescription')}</Paragraph>
            <ul>
              <li>🚀 {t('template.feature.moduleFederation')}</li>
              <li>🎨 {t('template.feature.antDesign')}</li>
              <li>🔐 {t('template.feature.permission')}</li>
              <li>🌍 {t('template.feature.i18n')}</li>
              <li>📱 {t('template.feature.responsive')}</li>
              <li>⚡ {t('template.feature.performance')}</li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SettingOutlined />
                {t('template.techStack')}
              </Space>
            }
          >
            <Paragraph>{t('template.techStackDescription')}</Paragraph>
            <ul>
              <li>React 19 + TypeScript</li>
              <li>Webpack Module Federation</li>
              <li>Ant Design 5.x</li>
              <li>React Router 7</li>
              <li>React i18next</li>
              <li>CSS Modules</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import I18nDemoPage from '../pages/i18n-demo/I18nDemoPage';
import TemplateI18nProvider from '../i18n/I18nProvider';

/**
 * 带国际化支持的演示页面
 * 专门用于 Module Federation 暴露，展示国际化功能
 */
const I18nDemoWithI18n: React.FC = () => {
  return (
    <TemplateI18nProvider>
      <I18nDemoPage />
    </TemplateI18nProvider>
  );
};

export default I18nDemoWithI18n;

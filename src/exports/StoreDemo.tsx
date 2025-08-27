import React from 'react';
import StoreDemo from '../pages/store-demo/StoreDemo';
import TemplateI18nProvider from '../i18n/I18nProvider';

/**
 * 带国际化支持的 StoreDemo 组件
 * 专门用于 Module Federation 暴露
 */
const StoreDemoWithI18n: React.FC = () => {
  return (
    <TemplateI18nProvider>
      <StoreDemo />
    </TemplateI18nProvider>
  );
};

export default StoreDemoWithI18n;

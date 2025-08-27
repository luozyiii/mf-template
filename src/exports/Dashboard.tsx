import React from 'react';
import Dashboard from '../pages/dashboard/Dashboard';
import TemplateI18nProvider from '../i18n/I18nProvider';

/**
 * 带国际化支持的 Dashboard 组件
 * 专门用于 Module Federation 暴露
 */
const DashboardWithI18n: React.FC = () => {
  return (
    <TemplateI18nProvider>
      <Dashboard />
    </TemplateI18nProvider>
  );
};

export default DashboardWithI18n;

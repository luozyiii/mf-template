import type React from 'react';
import { I18nextProvider } from 'react-i18next';
import templateI18nInstance from './index';

interface TemplateI18nProviderProps {
  children: React.ReactNode;
}

/**
 * mf-template 应用的国际化提供者组件
 * 使用独立的 i18next 实例，避免与其他微前端应用冲突
 */
const TemplateI18nProvider: React.FC<TemplateI18nProviderProps> = ({ children }) => {
  return <I18nextProvider i18n={templateI18nInstance}>{children}</I18nextProvider>;
};

export default TemplateI18nProvider;

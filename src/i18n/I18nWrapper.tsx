import React from 'react';
import TemplateI18nProvider from './I18nProvider';
import useLanguageSync from './useLanguageSync';

interface I18nWrapperProps {
  children: React.ReactNode;
}

/**
 * 语言同步组件
 * 在 I18nProvider 内部使用，确保语言同步
 */
const LanguageSyncComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useLanguageSync();
  return <>{children}</>;
};

/**
 * 国际化包装器组件
 * 用于包装暴露给主应用的组件，确保它们具有国际化功能和语言同步
 */
const I18nWrapper: React.FC<I18nWrapperProps> = ({ children }) => {
  return (
    <TemplateI18nProvider>
      <LanguageSyncComponent>
        {children}
      </LanguageSyncComponent>
    </TemplateI18nProvider>
  );
};

export default I18nWrapper;

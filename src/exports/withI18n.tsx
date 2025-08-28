import React from 'react';
import TemplateI18nProvider from '../i18n/I18nProvider';

/**
 * 高阶组件：为 Module Federation 导出的组件添加国际化支持
 * 统一的 I18n 包装器，减少重复代码
 */
export function withI18n<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <TemplateI18nProvider>
        <Component {...props} />
      </TemplateI18nProvider>
    );
  };

  // 设置显示名称，便于调试
  WrappedComponent.displayName = `withI18n(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default withI18n;

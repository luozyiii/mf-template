import React from 'react';
import I18nWrapper from '../i18n/I18nWrapper';

/**
 * 高阶组件：为组件添加国际化支持
 * 用于包装需要暴露给主应用的组件
 */
function withI18n<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <I18nWrapper>
        <Component {...props} />
      </I18nWrapper>
    );
  };

  WrappedComponent.displayName = `withI18n(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default withI18n;

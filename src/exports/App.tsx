import type React from 'react';
import App from '../App';

/**
 * App 组件的 Module Federation 导出
 * App 组件本身已经包含了 I18nProvider，所以直接导出
 */
const AppForExport: React.FC = () => {
  return <App />;
};

export default AppForExport;

import I18nDemoPage from '../pages/i18n-demo/I18nDemoPage';
import { withI18n } from './withI18n';

/**
 * 带国际化支持的演示页面
 * 专门用于 Module Federation 暴露，展示国际化功能
 */
export default withI18n(I18nDemoPage);

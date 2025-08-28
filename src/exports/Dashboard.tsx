import Dashboard from '../pages/dashboard/Dashboard';
import { withI18n } from './withI18n';

/**
 * 带国际化支持的 Dashboard 组件
 * 专门用于 Module Federation 暴露
 */
export default withI18n(Dashboard);

import StoreDemo from '../pages/store-demo/StoreDemo';
import { withI18n } from './withI18n';

/**
 * 带国际化支持的 StoreDemo 组件
 * 专门用于 Module Federation 暴露
 */
export default withI18n(StoreDemo);

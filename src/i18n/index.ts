import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 动态导入翻译资源
const loadTranslationResource = async (languageCode: string) => {
  try {
    const resource = await import(`./resources/${languageCode}/common.json`);
    return resource.default;
  } catch (error) {
    console.warn(`Translation resource for ${languageCode} not found, using fallback`);
    // 回退到英文或中文
    if (languageCode.startsWith('zh')) {
      const zhCN = await import('./resources/zh-CN/common.json');
      return zhCN.default;
    } else {
      const enUS = await import('./resources/en-US/common.json');
      return enUS.default;
    }
  }
};

// 初始翻译资源配置（只加载基础语言）
import zhCN from './resources/zh-CN/common.json';
import enUS from './resources/en-US/common.json';
import jaJP from './resources/ja-JP/common.json';

const resources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
  'ja-JP': { translation: jaJP },
};

// 支持的语言列表（只包含实际有翻译文件的语言）
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en-US', name: 'English' },
  { code: 'ja-JP', name: '日本語' },
];

// 创建 mf-template 专用的 i18next 实例
const templateI18nInstance = i18n.createInstance();

templateI18nInstance.use(initReactI18next).init({
  resources,
  lng: 'zh-CN', // 默认语言
  fallbackLng: 'en-US', // 回退语言

  interpolation: {
    escapeValue: false, // React 已经处理了 XSS
  },

  react: {
    useSuspense: true, // 启用 Suspense 支持
  },

  // 调试配置
  debug: process.env.NODE_ENV === 'development',

  // 命名空间配置
  defaultNS: 'translation',
  ns: ['translation'],
});

// 动态加载翻译资源的函数
export const addLanguageResource = async (languageCode: string) => {
  if (!templateI18nInstance.hasResourceBundle(languageCode, 'translation')) {
    try {
      const resource = await loadTranslationResource(languageCode);
      templateI18nInstance.addResourceBundle(languageCode, 'translation', resource);
      console.log(`✅ Loaded translation resource for ${languageCode}`);
    } catch (error) {
      console.warn(`❌ Failed to load translation resource for ${languageCode}:`, error);
    }
  }
};

// 监听全局存储中的语言变化（当作为微前端运行时）
if (typeof window !== 'undefined') {
  // 延迟执行，确保全局存储已初始化
  setTimeout(async () => {
    try {
      const { getStoreValue, subscribeStore } = await import('mf-shared/store');

      // 获取初始语言设置
      const appConfig = getStoreValue('app') || {};
      if (appConfig.language && appConfig.language !== templateI18nInstance.language) {
        console.log(`🌐 Template: Syncing initial language to ${appConfig.language}`);
        templateI18nInstance.changeLanguage(appConfig.language);
      }

      // 订阅语言变化
      subscribeStore('app', (_key: string, newValue: any) => {
        if (newValue?.language && newValue.language !== templateI18nInstance.language) {
          console.log(`🌐 Template: Language changed to ${newValue.language}`);
          templateI18nInstance.changeLanguage(newValue.language);
        }
      });

      console.log('🌐 Template: Language sync initialized');
    } catch (error) {
      console.log('🌐 Template: Running in standalone mode, no language sync');
    }
  }, 100);
}

export default templateI18nInstance;

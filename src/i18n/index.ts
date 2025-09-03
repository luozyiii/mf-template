import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 动态导入翻译资源
const loadTranslationResource = async (languageCode: string) => {
  try {
    const resource = await import(`./resources/${languageCode}/common.json`);
    return resource.default;
  } catch (_error) {
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

// 语言持久化的 localStorage 键
const LANGUAGE_STORAGE_KEY = 'mf-template-language';

// 检测是否在微前端环境中运行
const isInMicroFrontend = (): boolean => {
  try {
    // 检查是否在 iframe 中
    if (window !== window.parent) return true;

    // 检查 URL 路径（更精确的检测）
    if (window.location.pathname.includes('/template')) return true;

    // 检查端口（主应用通常在 3000，模板应用独立运行在 3001）
    if (window.location.port === '3000') return true;

    // 检查是否存在微前端特有的全局变量或标识
    if ((window as any).__MICRO_FRONTEND_ENV__) return true;

    // 检查 Module Federation 容器
    if ((window as any).__webpack_require__?.cache) return true;

    return false;
  } catch (_error) {
    return false;
  }
};

// 获取保存的语言设置
const getSavedLanguage = async (): Promise<string> => {
  try {
    // 总是尝试从全局 store 读取（无论是否在微前端环境中）
    try {
      // @ts-ignore - Module Federation 动态导入
      const { getStoreValue } = await import('mf-shared/store');
      const appConfig = getStoreValue('app') || {};
      if (
        appConfig.language &&
        supportedLanguages.some((lang) => lang.code === appConfig.language)
      ) {
        console.log(`🌐 Template: Using language from global store: ${appConfig.language}`);
        return appConfig.language;
      }
    } catch (_error) {
      // Global store not available, continue with localStorage fallback
      console.log('🌐 Template: Global store not available, using localStorage');
    }

    const inMicroFrontend = isInMicroFrontend();

    if (inMicroFrontend) {
      // 微前端模式：回退到主应用的 localStorage 设置
      const shellLanguage = localStorage.getItem('mf-shell-language');
      if (shellLanguage && supportedLanguages.some((lang) => lang.code === shellLanguage)) {
        console.log(`🌐 Template: Using shell language from localStorage: ${shellLanguage}`);
        return shellLanguage;
      }
    }

    // 最后回退：读取自己的设置
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && supportedLanguages.some((lang) => lang.code === saved)) {
      console.log(`🌐 Template: Using template language from localStorage: ${saved}`);
      return saved;
    }
  } catch (error) {
    console.warn('Failed to read saved language:', error);
  }

  console.log('🌐 Template: Using default language: zh-CN');
  return 'zh-CN'; // 默认语言
};

// 保存语言设置
export const saveLanguage = async (languageCode: string): Promise<void> => {
  try {
    // 保存到本地 localStorage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    console.log(`🌐 Template: Saved language to localStorage: ${languageCode}`);

    // 尝试同步到全局store
    try {
      // @ts-ignore - Module Federation 动态导入
      const { getStoreValue, setStoreValue } = await import('mf-shared/store');

      // 获取现有的应用配置，保持其他设置不变
      const currentAppConfig = getStoreValue('app') || {};
      const updatedConfig = {
        ...currentAppConfig,
        language: languageCode,
      };

      setStoreValue('app', updatedConfig);
      console.log(`🌐 Template: Synced language to global store: ${languageCode}`);
    } catch (_error) {
      console.log('🌐 Template: Global store not available for sync');
    }
  } catch (error) {
    console.warn('Failed to save language:', error);
  }
};

// 创建 mf-template 专用的 i18next 实例
const templateI18nInstance = i18n.createInstance();

// 异步初始化 i18n 实例
const initializeI18n = async () => {
  const initialLanguage = await getSavedLanguage();

  await templateI18nInstance.use(initReactI18next).init({
    resources,
    lng: initialLanguage, // 使用保存的语言或默认语言
    fallbackLng: 'zh-CN', // 回退语言

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

  // 确保初始化完成后语言设置正确
  console.log(
    `🌐 Template i18n: Initialized successfully, current language: ${templateI18nInstance.language}`
  );

  // 如果当前语言与期望的不一致，强制设置
  if (templateI18nInstance.language !== initialLanguage) {
    console.log(`🌐 Template i18n: Language mismatch, forcing change to ${initialLanguage}`);
    templateI18nInstance.changeLanguage(initialLanguage);
  }
};

// 启动异步初始化
initializeI18n().catch((error) => {
  console.error('🌐 Template i18n: Failed to initialize:', error);
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
      (subscribeStore as any)('app', (_key: string, newValue: any, _oldValue: any) => {
        if (newValue?.language && newValue.language !== templateI18nInstance.language) {
          console.log(`🌐 Template: Language changed to ${newValue.language}`);
          templateI18nInstance.changeLanguage(newValue.language);
        }
      });

      console.log('🌐 Template: Language sync initialized');
    } catch (_error) {
      console.log('🌐 Template: Running in standalone mode, no language sync');
    }
  }, 100);
}

export default templateI18nInstance;

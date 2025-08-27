/**
 * 国际化工具函数
 * 提供翻译资源管理和语言检测功能
 */

import { supportedLanguages } from '../i18n';

/**
 * 检查是否为支持的语言代码
 */
export const isSupportedLanguage = (languageCode: string): boolean => {
  return supportedLanguages.some(lang => lang.code === languageCode);
};

/**
 * 获取语言的显示名称
 */
export const getLanguageDisplayName = (languageCode: string): string => {
  const language = supportedLanguages.find(lang => lang.code === languageCode);
  return language?.name || languageCode;
};

/**
 * 获取浏览器首选语言（如果支持的话）
 */
export const getBrowserPreferredLanguage = (): string => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
  
  // 精确匹配
  if (isSupportedLanguage(browserLang)) {
    return browserLang;
  }
  
  // 语言前缀匹配（如 'en' 匹配 'en-US'）
  const langPrefix = browserLang.split('-')[0];
  const matchedLang = supportedLanguages.find(lang => 
    lang.code.startsWith(langPrefix)
  );
  
  return matchedLang?.code || 'en-US';
};

/**
 * 格式化翻译键，支持嵌套对象访问
 */
export const formatTranslationKey = (namespace: string, key: string): string => {
  return `${namespace}.${key}`;
};

/**
 * 验证翻译资源的完整性
 */
export const validateTranslationResource = (resource: any): boolean => {
  if (!resource || typeof resource !== 'object') {
    return false;
  }
  
  // 检查必需的顶级键
  const requiredKeys = ['app', 'common', 'navigation'];
  return requiredKeys.every(key => key in resource);
};

/**
 * 获取回退语言
 */
export const getFallbackLanguage = (languageCode: string): string => {
  // 中文系列回退到中文
  if (languageCode.startsWith('zh')) {
    return 'zh-CN';
  }
  
  // 其他语言回退到英文
  return 'en-US';
};

/**
 * 语言代码标准化
 */
export const normalizeLanguageCode = (languageCode: string): string => {
  // 处理常见的语言代码变体
  const normalizeMap: Record<string, string> = {
    'zh': 'zh-CN',
    'zh-cn': 'zh-CN',
    'en': 'en-US',
    'en-us': 'en-US',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'es': 'es-ES',
    'ru': 'ru-RU',
    'ar': 'ar-SA',
    'pt': 'pt-BR',
    'it': 'it-IT',
    'nl': 'nl-NL',
    'tr': 'tr-TR',
  };
  
  const normalized = normalizeMap[languageCode.toLowerCase()];
  return normalized || languageCode;
};

/**
 * 检查是否为 RTL（从右到左）语言
 */
export const isRTLLanguage = (languageCode: string): boolean => {
  const rtlLanguages = ['ar-SA', 'he-IL', 'fa-IR'];
  return rtlLanguages.includes(languageCode);
};

/**
 * 获取语言的文本方向
 */
export const getTextDirection = (languageCode: string): 'ltr' | 'rtl' => {
  return isRTLLanguage(languageCode) ? 'rtl' : 'ltr';
};

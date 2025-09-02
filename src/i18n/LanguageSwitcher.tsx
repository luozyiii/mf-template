import type React from 'react';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { Select, Space, Spin } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '.';
import useSwitchLanguage from './useSwitchLanguage';
import useIsRemote from '../hooks/useIsRemote';
import { isRTLLanguage } from '../utils/i18nUtils';

interface LanguageSwitcherProps {
  style?: React.CSSProperties;
  size?: 'small' | 'middle' | 'large';
  showIcon?: boolean;
  showLabel?: boolean;
  loading?: boolean;
}

/**
 * 模板应用的语言切换器组件
 * 只在独立运行时显示，在微前端模式下隐藏（由主应用控制）
 * 优化版本：支持加载状态、RTL语言、性能优化
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  style,
  size = 'middle',
  showIcon = true,
  showLabel = false,
  loading = false,
}) => {
  const { t, i18n } = useTranslation();
  const { switchLanguage } = useSwitchLanguage();
  const isRemote = useIsRemote();
  const [, setForceUpdate] = useState(0);

  // 监听语言变化并强制更新
  useEffect(() => {
    const handleLanguageChange = () => {
      setForceUpdate((prev) => prev + 1);
    };

    i18n.on('languageChanged', handleLanguageChange);

    // 检查初始化状态并同步语言
    if (i18n.isInitialized) {
      // 尝试从全局store获取最新语言设置
      const syncLanguageFromGlobalStore = async () => {
        try {
          // @ts-ignore - Module Federation 动态导入
          const { getStoreValue } = await import('mf-shared/store');
          const appConfig = getStoreValue('app') || {};
          if (appConfig.language && appConfig.language !== i18n.language) {
            console.log(
              `🌐 LanguageSwitcher: Syncing to global store language: ${appConfig.language}`
            );
            i18n.changeLanguage(appConfig.language);
            return;
          }
        } catch (_error) {
          // Global store not available, use localStorage
        }

        // 回退到 localStorage
        const savedLanguage =
          localStorage.getItem('mf-template-language') || localStorage.getItem('mf-shell-language');
        if (savedLanguage && savedLanguage !== i18n.language) {
          console.log(`🌐 LanguageSwitcher: Using localStorage language: ${savedLanguage}`);
          i18n.changeLanguage(savedLanguage);
        }
      };

      syncLanguageFromGlobalStore();
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // 缓存语言选项，避免重复渲染
  const languageOptions = useMemo(
    () =>
      supportedLanguages.map((lang) => ({
        key: lang.code,
        value: lang.code,
        label: lang.name,
        style: { direction: isRTLLanguage(lang.code) ? 'rtl' : ('ltr' as const) },
      })),
    []
  );

  // 优化的语言切换处理函数
  const handleLanguageChange = useCallback(
    async (languageCode: string) => {
      try {
        await switchLanguage(languageCode);
      } catch (_error) {
        console.error('Failed to switch language:', _error);
      }
    },
    [switchLanguage]
  );

  // 当前语言的文本方向
  const currentDirection = isRTLLanguage(i18n.language) ? 'rtl' : 'ltr';

  // 如果是远程模式（嵌入在主应用中），不显示语言切换器
  if (isRemote) {
    return null;
  }

  return (
    <Space style={{ ...style, direction: currentDirection }}>
      {showIcon && <GlobalOutlined />}
      {showLabel && <span>{t('language.select')}</span>}
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        size={size}
        style={{ minWidth: 120 }}
        placeholder={t('language.select')}
        loading={loading}
        suffixIcon={loading ? <Spin size="small" /> : undefined}
        options={languageOptions}
        optionRender={(option) => (
          <div style={option.data.style as React.CSSProperties}>{option.data.label}</div>
        )}
      />
    </Space>
  );
};

export default LanguageSwitcher;

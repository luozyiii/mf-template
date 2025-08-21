import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 检查是否独立运行（没有主应用的全局存储）
const initStoreForStandalone = async () => {
  // 检查是否已经有globalStore（来自主应用）
  if (typeof window !== 'undefined' && (window as any).globalStore) {
    console.log('🗄️ Template app: Using existing GlobalStore from main app');
    return;
  }

  // 如果没有全局存储，说明是独立运行，需要初始化
  if (typeof window !== 'undefined' && !(window as any).globalStore) {
    try {
      // 动态导入存储模块并初始化
      const { initGlobalStore, setStoreValue } = await import(
        'mf-shared/store'
      );

      console.log('🗄️ Template app: Initializing GlobalStore for standalone mode');
      initGlobalStore({
        enablePersistence: true,
        enableEncryption: true,
        storageKey: 'mf-template-store',
      });

      // 设置一些默认数据
      setStoreValue('userinfo', {
        name: '独立用户',
        age: 25,
        role: 'user',
      });

      setStoreValue('appConfig', {
        theme: 'light',
        language: 'zh-CN',
        version: '1.0.0-standalone',
      });

      console.log(
        '🗄️ Template app: Global Store initialized for standalone mode'
      );
    } catch (error) {
      console.warn(
        'Template app: Failed to initialize store for standalone mode:',
        error
      );
    }
  } else {
    console.log('🗄️ Template app: Using existing global store from shell');
  }
};

const startApp = async () => {
  await initStoreForStandalone();

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

startApp();

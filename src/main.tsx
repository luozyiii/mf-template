import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreUtils } from './utils/storeUtils';

const startApp = async () => {
  // 初始化独立运行时的存储
  await StoreUtils.initStandaloneStore();

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

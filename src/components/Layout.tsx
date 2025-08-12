import React, { useState, useMemo } from 'react';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ControlOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { appRouteConfig } from '../config/routes.config';
import { AuthUtils } from '../utils/authUtils';
import styles from './Layout.module.css';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 检测是否在微前端环境中（iframe中运行）
  const isInMicroFrontend = window.parent !== window;

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        // 使用AuthUtils处理退出登录
        AuthUtils.logout();
      },
    },
  ];

  // 构建菜单项
  const menuItems = useMemo(() => {
    const moduleName = (process.env.MODULE_NAME as string) || 'template';
    return appRouteConfig.routes.map(route => ({
      key: route.path.replace(`/${moduleName}`, ''),
      icon:
        route.icon === 'DashboardOutlined' ? (
          <DashboardOutlined />
        ) : route.icon === 'AppstoreOutlined' ? (
          <AppstoreOutlined />
        ) : route.icon === 'SettingOutlined' ? (
          <SettingOutlined />
        ) : route.icon === 'ControlOutlined' ? (
          <ControlOutlined />
        ) : (
          <DashboardOutlined />
        ),
      label: route.name,
    }));
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 获取当前页面信息
  const getCurrentPageInfo = () => {
    const pathname = location.pathname;
    const moduleName = (process.env.MODULE_NAME as string) || 'template';
    const route = appRouteConfig.routes.find(
      r => r.path.replace(`/${moduleName}`, '') === pathname
    );

    if (route) {
      return {
        title: route.name,
        showBack: route.showBack || false,
        backPath: route.backPath?.replace('/template', '') || null,
      };
    }

    return {
      title: '模板系统',
      showBack: false,
      backPath: null,
    };
  };

  const currentPageInfo = getCurrentPageInfo();

  const handleBack = () => {
    if (currentPageInfo.backPath) {
      navigate(currentPageInfo.backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {currentPageInfo.title} -{' '}
          {(process.env.APP_DISPLAY_NAME as string) || '模板系统'}
        </title>
      </Helmet>
      <AntLayout className={styles.layout}>
        {!isInMicroFrontend && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={styles.sider}
            width={200}
          >
            <div
              className={`${styles.logo} ${collapsed ? styles.logoCollapsed : styles.logoExpanded}`}
            >
              {collapsed
                ? ((process.env.MODULE_NAME as string) || 'template')
                    .substring(0, 2)
                    .toUpperCase()
                : (process.env.APP_DISPLAY_NAME as string) || '模板系统'}
            </div>

            <div className={styles.menuContainer}>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className={styles.menu}
              />
            </div>

            {/* 折叠按钮 */}
            <div className={styles.collapseButtonContainer}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className={styles.collapseButton}
                title={collapsed ? '展开菜单' : '折叠菜单'}
              />
            </div>
          </Sider>
        )}
        <AntLayout
          className={`${styles.rightLayout} ${collapsed ? styles.rightLayoutCollapsed : ''}`}
        >
          <Header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.pageTitle}>
                {currentPageInfo.showBack && (
                  <Button
                    type="text"
                    icon={<LeftOutlined />}
                    onClick={handleBack}
                    className={styles.backButton}
                  />
                )}
                <span className={styles.pageTitleText}>
                  {currentPageInfo.title}
                </span>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.welcomeText}>
                {(process.env.APP_DISPLAY_NAME as string) || '模板系统'} -
                微前端子系统
              </div>

              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className={styles.userInfo}>
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    className={styles.userAvatar}
                  />
                  <span className={styles.userName}>
                    {(process.env.APP_DISPLAY_NAME as string) || '模板系统'}用户
                  </span>
                  <div className={styles.dropdownArrow}>▼</div>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content className={styles.content}>
            <div className={styles.pageTransition}>{children}</div>
          </Content>
        </AntLayout>
      </AntLayout>
    </>
  );
};

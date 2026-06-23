import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserRole, removeToken } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { Button, Icon } from './ui';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/products', label: 'Products', icon: 'box', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/inventory', label: 'Inventory', icon: 'chart', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/warehouses', label: 'Warehouses', icon: 'warehouse', roles: ['ADMIN'] },
    { path: '/suppliers', label: 'Suppliers', icon: 'users', roles: ['ADMIN', 'MANAGER'] },
    { path: '/reports', label: 'Reports', icon: 'chart', roles: ['ADMIN', 'MANAGER'] },
  ];
  const visibleNavItems = navItems.filter((item) => item.roles.includes(userRole));
  const activeItem = navItems.find((item) => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside className={`fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 lg:block ${collapsed ? 'w-20' : 'w-72'}`}>
        <div className="flex h-16 items-center justify-between px-4">
          <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950"><Icon name="box" /></span>
            {!collapsed && <span className="text-sm font-bold tracking-tight">InventoryPro</span>}
          </button>
          <Button type="button" variant="ghost" size="icon" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar">
            <Icon name="menu" />
          </Button>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {visibleNavItems.map((item) => {
            const active = item.path === location.pathname;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
                className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${active ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}
              >
                <Icon name={item.icon} />
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle navigation">
              <Icon name="menu" />
            </Button>
            <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <span>Inventory</span>
              <span>/</span>
              <span className="font-medium text-slate-900 dark:text-white">{activeItem?.label || 'Dashboard'}</span>
            </div>
            <div className="relative ml-auto hidden w-full max-w-md md:block">
              <Icon name="search" className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-slate-800" placeholder="Search inventory, products, reports..." />
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Notifications"><Icon name="bell" /></Button>
            <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme"><Icon name={isDark ? 'sun' : 'moon'} /></Button>
            <div className="hidden items-center gap-3 rounded-full border border-slate-200 px-2 py-1 dark:border-slate-800 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-slate-800">{userRole?.slice(0, 1) || 'U'}</span>
              <span className="pr-2 text-xs font-semibold text-slate-600 dark:text-slate-300">{userRole}</span>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout"><Icon name="logout" /></Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

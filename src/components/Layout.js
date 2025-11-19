import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, removeToken } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    removeToken();
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/products', label: 'Products', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/inventory', label: 'Inventory', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/warehouses', label: 'Warehouses', roles: ['ADMIN'] },
    { path: '/suppliers', label: 'Suppliers', roles: ['ADMIN', 'MANAGER'] },
    { path: '/reports', label: 'Reports', roles: ['ADMIN', 'MANAGER'] },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className={`${isDark ? 'bg-gray-800' : 'bg-blue-600'} text-white p-4`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Inventory Management</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Role: {userRole}</span>
            <button 
              onClick={toggleTheme} 
              className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          {navItems
            .filter(item => item.roles.includes(userRole))
            .map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-700'} px-3 py-1 rounded`}
              >
                {item.label}
              </button>
            ))}
        </div>
      </nav>
      <main className={`p-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{children}</main>
    </div>
  );
};

export default Layout;
import React, { useState, useEffect } from 'react';
import { inventoryAPI, productAPI } from '../services/api';
import { getUserRole } from '../utils/auth';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalStock: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const userRole = getUserRole();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, inventoryRes] = await Promise.all([
        productAPI.getAll(),
        inventoryAPI.getAll()
      ]);

      const products = productsRes.data;
      const inventory = inventoryRes.data;

      const lowStock = inventory.filter(item => {
        const product = products.find(p => p.id === item.product_id);
        return product && item.stock_level < (product.min_stock_level || 0);
      }).map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product_name: product?.name || 'Unknown',
          min_stock_level: product?.min_stock_level || 0
        };
      });

      setStats({
        totalProducts: products.length,
        lowStockItems: lowStock.length,
        totalStock: inventory.reduce((sum, item) => sum + item.stock_level, 0)
      });

      setLowStockProducts(lowStock.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProducts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.lowStockItems}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Stock</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalStock}</p>
        </div>
      </div>

      {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Low Stock Alerts</h2>
          {lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left dark:text-white">Product</th>
                    <th className="px-4 py-2 text-left dark:text-white">Current Stock</th>
                    <th className="px-4 py-2 text-left dark:text-white">Min Level</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((item, index) => (
                    <tr key={index} className="border-t dark:border-gray-600">
                      <td className="px-4 py-2 dark:text-white">{item.product_name}</td>
                      <td className="px-4 py-2 text-red-600 dark:text-red-400">{item.stock_level}</td>
                      <td className="px-4 py-2 dark:text-white">{item.min_stock_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No low stock items</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
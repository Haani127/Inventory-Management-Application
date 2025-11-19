import React, { useState, useEffect } from 'react';
import { inventoryAPI, productAPI, warehouseAPI } from '../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('low-stock');
  const [reportData, setReportData] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({
    warehouse_id: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    generateReport();
  }, [reportType]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await warehouseAPI.getAll();
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const generateReport = async () => {
    try {
      const inventoryResponse = await inventoryAPI.getAll();
      const inventory = inventoryResponse.data;

      if (reportType === 'low-stock') {
        const lowStockItems = inventory.filter(item => {
          const product = products.find(p => p.id === item.product_id);
          return product && item.stock_level < product.min_stock_level;
        });
        setReportData(lowStockItems);
      } else if (reportType === 'stock-levels') {
        setReportData(inventory);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown';
  };

  const exportToCSV = () => {
    const headers = reportType === 'low-stock' 
      ? ['Product', 'Warehouse', 'Current Stock', 'Min Level', 'Shortage']
      : ['Product', 'Warehouse', 'Stock Level'];

    const csvData = reportData.map(item => {
      const product = products.find(p => p.id === item.product_id);
      const baseData = [
        getProductName(item.product_id),
        getWarehouseName(item.warehouse_id),
        item.stock_level
      ];

      if (reportType === 'low-stock') {
        return [
          ...baseData,
          product?.min_stock_level || 0,
          (product?.min_stock_level || 0) - item.stock_level
        ];
      }
      return baseData;
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report.csv`;
    a.click();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="low-stock">Low Stock Report</option>
              <option value="stock-levels">Current Stock Levels</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Warehouse</label>
            <select
              value={filters.warehouse_id}
              onChange={(e) => setFilters({...filters, warehouse_id: e.target.value})}
              className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Warehouses</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 mr-2"
            >
              Generate Report
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
          <h2 className="text-lg font-semibold dark:text-white">
            {reportType === 'low-stock' ? 'Low Stock Items' : 'Current Stock Levels'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total items: {reportData.length}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left dark:text-white">Product</th>
                <th className="px-4 py-3 text-left dark:text-white">Warehouse</th>
                <th className="px-4 py-3 text-left dark:text-white">Current Stock</th>
                {reportType === 'low-stock' && (
                  <>
                    <th className="px-4 py-3 text-left dark:text-white">Min Level</th>
                    <th className="px-4 py-3 text-left dark:text-white">Shortage</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reportData
                .filter(item => !filters.warehouse_id || item.warehouse_id.toString() === filters.warehouse_id)
                .map((item, index) => {
                  const product = products.find(p => p.id === item.product_id);
                  return (
                    <tr key={index} className="border-t dark:border-gray-600">
                      <td className="px-4 py-3 dark:text-white">{getProductName(item.product_id)}</td>
                      <td className="px-4 py-3 dark:text-white">{getWarehouseName(item.warehouse_id)}</td>
                      <td className={`px-4 py-3 font-semibold ${
                        reportType === 'low-stock' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {item.stock_level}
                      </td>
                      {reportType === 'low-stock' && (
                        <>
                          <td className="px-4 py-3 dark:text-white">{product?.min_stock_level || 0}</td>
                          <td className="px-4 py-3 text-red-600 dark:text-red-400 font-semibold">
                            {(product?.min_stock_level || 0) - item.stock_level}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
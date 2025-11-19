import React, { useState, useEffect } from 'react';
import { inventoryAPI, productAPI, warehouseAPI } from '../services/api';
import { getUserRole } from '../utils/auth';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showStockForm, setShowStockForm] = useState(false);
  const [stockFormType, setStockFormType] = useState('in');
  const [formData, setFormData] = useState({
    product_id: '',
    warehouse_id: '',
    quantity: ''
  });
  const userRole = getUserRole();
  const canAdjustStock = userRole === 'EMPLOYEE' || userRole === 'ADMIN';

  useEffect(() => {
    fetchInventory();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

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

  const handleStockAdjustment = async (e) => {
    e.preventDefault();
    try {
      const adjustmentData = {
        ...formData,
        quantity: parseInt(formData.quantity)
      };

      if (stockFormType === 'in') {
        await inventoryAPI.stockIn(adjustmentData);
      } else {
        await inventoryAPI.stockOut(adjustmentData);
      }

      fetchInventory();
      resetForm();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Error adjusting stock. Please check the quantity and try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      warehouse_id: '',
      quantity: ''
    });
    setShowStockForm(false);
  };

  const openStockForm = (type) => {
    setStockFormType(type);
    setShowStockForm(true);
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown';
  };

  const getStockStatus = (item) => {
    const product = products.find(p => p.id === item.product_id);
    if (!product) return 'normal';
    return item.stock_level < product.min_stock_level ? 'low' : 'normal';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory</h1>
        {canAdjustStock && (
          <div className="space-x-2">
            <button
              onClick={() => openStockForm('in')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Stock In
            </button>
            <button
              onClick={() => openStockForm('out')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Stock Out
            </button>
          </div>
        )}
      </div>

      {showStockForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            {stockFormType === 'in' ? 'Stock In' : 'Stock Out'}
          </h2>
          <form onSubmit={handleStockAdjustment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Product</label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Warehouse</label>
              <select
                value={formData.warehouse_id}
                onChange={(e) => setFormData({...formData, warehouse_id: e.target.value})}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="1"
                required
              />
            </div>
            <div className="md:col-span-3 flex space-x-2">
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${
                  stockFormType === 'in' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {stockFormType === 'in' ? 'Add Stock' : 'Remove Stock'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left dark:text-white">Product</th>
                <th className="px-4 py-3 text-left dark:text-white">SKU</th>
                <th className="px-4 py-3 text-left dark:text-white">Warehouse</th>
                <th className="px-4 py-3 text-left dark:text-white">Stock Level</th>
                <th className="px-4 py-3 text-left dark:text-white">Min Level</th>
                <th className="px-4 py-3 text-left dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => {
                const product = products.find(p => p.id === item.product_id);
                const status = getStockStatus(item);
                return (
                  <tr key={`${item.product_id}-${item.warehouse_id}`} className="border-t dark:border-gray-600">
                    <td className="px-4 py-3 dark:text-white">{getProductName(item.product_id)}</td>
                    <td className="px-4 py-3 dark:text-white">{product?.sku || 'N/A'}</td>
                    <td className="px-4 py-3 dark:text-white">{getWarehouseName(item.warehouse_id)}</td>
                    <td className={`px-4 py-3 font-semibold ${
                      status === 'low' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {item.stock_level}
                    </td>
                    <td className="px-4 py-3 dark:text-white">{product?.min_stock_level || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        status === 'low' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {status === 'low' ? 'Low Stock' : 'Normal'}
                      </span>
                    </td>
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

export default Inventory;
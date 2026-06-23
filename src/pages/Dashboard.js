import React, { useEffect, useMemo, useState } from 'react';
import { inventoryAPI, productAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
import { Badge, Card, DataTable, Icon, Loader } from '../components/ui';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, lowStockItems: 0, totalStock: 0 });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [inventoryMix, setInventoryMix] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = getUserRole();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, inventoryRes] = await Promise.all([productAPI.getAll(), inventoryAPI.getAll()]);
      const products = productsRes.data;
      const inventory = inventoryRes.data;
      const lowStock = inventory.filter((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return product && item.stock_level < (product.min_stock_level || 0);
      }).map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return { ...item, product_name: product?.name || 'Unknown', min_stock_level: product?.min_stock_level || 0 };
      });

      setStats({
        totalProducts: products.length,
        lowStockItems: lowStock.length,
        totalStock: inventory.reduce((sum, item) => sum + item.stock_level, 0),
      });
      setLowStockProducts(lowStock.slice(0, 5));
      setInventoryMix(inventory.slice(0, 6).map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return { name: product?.name || 'Unknown', stock: item.stock_level };
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxStock = useMemo(() => Math.max(...inventoryMix.map((item) => item.stock), 1), [inventoryMix]);
  const kpis = [
    { label: 'Products', value: stats.totalProducts, icon: 'box', note: 'Active catalog items', tone: 'blue' },
    { label: 'Low Stock', value: stats.lowStockItems, icon: 'alert', note: 'Need attention', tone: stats.lowStockItems ? 'orange' : 'green' },
    { label: 'Orders', value: stats.totalStock, icon: 'chart', note: 'Units currently tracked', tone: 'slate' },
    { label: 'Revenue', value: '$0', icon: 'chart', note: 'No revenue API available', tone: 'slate' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overview</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Inventory Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Card key={item.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{loading ? '-' : item.value}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Icon name={item.icon} />
              </span>
            </div>
            <div className="mt-4"><Badge tone={item.tone}>{item.note}</Badge></div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Inventory Mix</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Top stock levels from current inventory data</p>
            </div>
            {loading && <Loader />}
          </div>
          <div className="space-y-4">
            {inventoryMix.length ? inventoryMix.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-slate-500">{item.stock}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-3 rounded-full bg-slate-950 transition-all duration-200 dark:bg-white" style={{ width: `${Math.max(8, (item.stock / maxStock) * 100)}%` }} />
                </div>
              </div>
            )) : <p className="py-10 text-center text-sm text-slate-500">No inventory data available.</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="mt-5 space-y-4">
            {lowStockProducts.length ? lowStockProducts.map((item) => (
              <div key={`${item.product_id}-${item.warehouse_id}`} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                <div>
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Stock is {item.stock_level}, below minimum {item.min_stock_level}</p>
                </div>
              </div>
            )) : <p className="py-10 text-center text-sm text-slate-500">No recent stock alerts.</p>}
          </div>
        </Card>
      </div>

      {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
        <DataTable
          columns={[
            { key: 'product_name', header: 'Product' },
            { key: 'stock_level', header: 'Current Stock' },
            { key: 'min_stock_level', header: 'Min Level' },
            { key: 'status', header: 'Status', sortable: false, render: () => <Badge tone="orange">Low Stock</Badge> },
          ]}
          data={lowStockProducts}
          loading={loading}
          emptyMessage="No low stock items"
          pageSize={5}
        />
      )}
    </div>
  );
};

export default Dashboard;

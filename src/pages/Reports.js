import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { inventoryAPI, productAPI, warehouseAPI } from '../services/api';
import { Badge, Button, Card, DataTable, Select, useToast } from '../components/ui';

const Reports = () => {
  const [reportType, setReportType] = useState('low-stock');
  const [reportData, setReportData] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [filters, setFilters] = useState({ warehouse_id: '', date_from: '', date_to: '' });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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

  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      const inventoryResponse = await inventoryAPI.getAll();
      const inventory = inventoryResponse.data;
      if (reportType === 'low-stock') {
        setReportData(inventory.filter((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return product && item.stock_level < product.min_stock_level;
        }));
      } else {
        setReportData(inventory);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast('Unable to generate report', 'error');
    } finally {
      setLoading(false);
    }
  }, [reportType, products, toast]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchWarehouses()]);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (products.length > 0) generateReport();
  }, [generateReport, products]);

  const visibleData = useMemo(() => reportData.filter((item) =>
    !filters.warehouse_id || item.warehouse_id.toString() === filters.warehouse_id
  ).map((item, index) => {
    const product = products.find((p) => p.id === item.product_id);
    const warehouse = warehouses.find((w) => w.id === item.warehouse_id);
    return {
      ...item,
      id: `${item.product_id}-${item.warehouse_id}-${index}`,
      productName: product?.name || 'Unknown',
      warehouseName: warehouse?.name || 'Unknown',
      minLevel: product?.min_stock_level || 0,
      shortage: (product?.min_stock_level || 0) - item.stock_level,
    };
  }), [reportData, filters.warehouse_id, products, warehouses]);

  const getProductName = (productId) => products.find((p) => p.id === productId)?.name || 'Unknown';
  const getWarehouseName = (warehouseId) => warehouses.find((w) => w.id === warehouseId)?.name || 'Unknown';

  const exportToCSV = () => {
    const headers = reportType === 'low-stock'
      ? ['Product', 'Warehouse', 'Current Stock', 'Min Level', 'Shortage']
      : ['Product', 'Warehouse', 'Stock Level'];

    const csvData = reportData.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      const baseData = [getProductName(item.product_id), getWarehouseName(item.warehouse_id), item.stock_level];
      if (reportType === 'low-stock') {
        return [...baseData, product?.min_stock_level || 0, (product?.min_stock_level || 0) - item.stock_level];
      }
      return baseData;
    });

    const csvContent = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report.csv`;
    a.click();
    toast('CSV export started');
  };

  const columns = [
    { key: 'productName', header: 'Product' },
    { key: 'warehouseName', header: 'Warehouse' },
    { key: 'stock_level', header: 'Current Stock', render: (item) => <span className="font-semibold">{item.stock_level}</span> },
    ...(reportType === 'low-stock' ? [
      { key: 'minLevel', header: 'Min Level' },
      { key: 'shortage', header: 'Shortage', render: (item) => <Badge tone="red">{item.shortage}</Badge> },
    ] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Analytics</p>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Select label="Report Type" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="low-stock">Low Stock Report</option>
            <option value="stock-levels">Current Stock Levels</option>
          </Select>
          <Select label="Warehouse" value={filters.warehouse_id} onChange={(e) => setFilters({ ...filters, warehouse_id: e.target.value })}>
            <option value="">All Warehouses</option>
            {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
          </Select>
          <div className="flex gap-2">
            <Button type="button" onClick={generateReport}>Generate</Button>
            <Button type="button" variant="secondary" icon="download" onClick={exportToCSV} disabled={!reportData.length}>Export CSV</Button>
          </div>
        </div>
      </Card>

      <DataTable columns={columns} data={visibleData} loading={loading} emptyMessage="No report rows available." />
    </div>
  );
};

export default Reports;

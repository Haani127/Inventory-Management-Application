import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { inventoryAPI, productAPI, warehouseAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
import { Badge, Button, DataTable, Input, Modal, Select, useToast } from '../components/ui';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showStockForm, setShowStockForm] = useState(false);
  const [stockFormType, setStockFormType] = useState('in');
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ product_id: '', warehouse_id: '', quantity: '' });
  const userRole = getUserRole();
  const canAdjustStock = userRole === 'EMPLOYEE' || userRole === 'ADMIN';
  const toast = useToast();

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getAll();
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast('Unable to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await warehouseAPI.getAll();
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
    fetchWarehouses();
  }, [fetchInventory, fetchProducts, fetchWarehouses]);

  const handleStockAdjustment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const adjustmentData = { ...formData, quantity: parseInt(formData.quantity, 10) };
      if (stockFormType === 'in') {
        await inventoryAPI.stockIn(adjustmentData);
      } else {
        await inventoryAPI.stockOut(adjustmentData);
      }
      toast(stockFormType === 'in' ? 'Stock added' : 'Stock removed');
      fetchInventory();
      resetForm();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast('Error adjusting stock. Please check the quantity and try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ product_id: '', warehouse_id: '', quantity: '' });
    setShowStockForm(false);
  };

  const openStockForm = (type) => {
    setStockFormType(type);
    setShowStockForm(true);
  };

  const enrichedInventory = useMemo(() => inventory.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    const warehouse = warehouses.find((w) => w.id === item.warehouse_id);
    const status = !product || item.stock_level <= 0 ? 'out' : item.stock_level < product.min_stock_level ? 'low' : 'in';
    return { ...item, id: `${item.product_id}-${item.warehouse_id}`, productName: product?.name || 'Unknown', sku: product?.sku || 'N/A', minLevel: product?.min_stock_level || 0, warehouseName: warehouse?.name || 'Unknown', status };
  }).filter((item) => {
    const matchesSearch = `${item.productName} ${item.sku} ${item.warehouseName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = !warehouseFilter || item.warehouse_id.toString() === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  }), [inventory, products, warehouses, searchTerm, warehouseFilter]);

  const statusBadge = (status) => {
    if (status === 'out') return <Badge tone="red">Out of Stock</Badge>;
    if (status === 'low') return <Badge tone="orange">Low Stock</Badge>;
    return <Badge tone="green">In Stock</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Operations</p>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        </div>
        {canAdjustStock && (
          <div className="flex gap-2">
            <Button type="button" variant="success" icon="plus" onClick={() => openStockForm('in')}>Stock In</Button>
            <Button type="button" variant="danger" icon="arrowDown" onClick={() => openStockForm('out')}>Stock Out</Button>
          </div>
        )}
      </div>

      <DataTable
        columns={[
          { key: 'productName', header: 'Product', render: (item) => <div><p className="font-semibold text-slate-950 dark:text-white">{item.productName}</p><p className="text-xs text-slate-500">{item.sku}</p></div> },
          { key: 'warehouseName', header: 'Warehouse' },
          { key: 'stock_level', header: 'Stock Level', render: (item) => <span className="font-semibold">{item.stock_level}</span> },
          { key: 'minLevel', header: 'Min Level' },
          { key: 'status', header: 'Status', render: (item) => statusBadge(item.status) },
        ]}
        data={enrichedInventory}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={(
          <Select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)} className="w-48">
            <option value="">All Warehouses</option>
            {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
          </Select>
        )}
        emptyMessage="No inventory records found."
      />

      <Modal open={showStockForm} title={stockFormType === 'in' ? 'Stock In' : 'Stock Out'} onClose={resetForm} footer={(
        <>
          <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
          <Button type="submit" form="stock-form" variant={stockFormType === 'in' ? 'success' : 'danger'} disabled={saving}>{saving ? 'Processing...' : stockFormType === 'in' ? 'Add Stock' : 'Remove Stock'}</Button>
        </>
      )}>
        <form id="stock-form" onSubmit={handleStockAdjustment} className="space-y-4">
          <Select label="Product" value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} required>
            <option value="">Select Product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>)}
          </Select>
          <Select label="Warehouse" value={formData.warehouse_id} onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })} required>
            <option value="">Select Warehouse</option>
            {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
          </Select>
          <Input label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} min="1" required />
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;

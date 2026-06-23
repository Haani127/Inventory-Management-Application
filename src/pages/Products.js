import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { productAPI, supplierAPI } from '../services/api';
import { getUserRole } from '../utils/auth';
import { Badge, Button, DataTable, Icon, Input, Modal, Select, Textarea, useToast } from '../components/ui';

const emptyForm = { name: '', sku: '', description: '', supplier_id: '', min_stock_level: '' };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const userRole = getUserRole();
  const canEdit = userRole === 'ADMIN' || userRole === 'MANAGER';
  const toast = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast('Unable to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await supplierAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, [fetchProducts, fetchSuppliers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
        toast('Product updated');
      } else {
        await productAPI.create(formData);
        toast('Product created');
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast('Unable to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await productAPI.delete(deleteId);
      toast('Product deleted');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast('Unable to delete product', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProduct(null);
    setShowForm(false);
  };

  const filteredProducts = useMemo(() => products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  ), [products, searchTerm]);

  const columns = [
    { key: 'name', header: 'Name', render: (product) => <div><p className="font-semibold text-slate-950 dark:text-white">{product.name}</p><p className="text-xs text-slate-500">{product.sku}</p></div> },
    { key: 'description', header: 'Description', render: (product) => <span className="line-clamp-2">{product.description || 'No description'}</span> },
    { key: 'supplier_id', header: 'Supplier', sortValue: (product) => suppliers.find((s) => s.id === product.supplier_id)?.name || '', render: (product) => suppliers.find((s) => s.id === product.supplier_id)?.name || 'N/A' },
    { key: 'min_stock_level', header: 'Min Stock', render: (product) => <Badge tone="blue">{product.min_stock_level || 0} units</Badge> },
    ...(canEdit ? [{ key: 'actions', header: 'Actions', sortable: false, render: (product) => (
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" size="icon" title="Edit product" onClick={() => handleEdit(product)}><Icon name="edit" /></Button>
        <Button type="button" variant="ghost" size="icon" title="Delete product" onClick={() => setDeleteId(product.id)}><Icon name="trash" /></Button>
      </div>
    ) }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Catalog</p>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        </div>
        {canEdit && <Button type="button" icon="plus" onClick={() => setShowForm(true)}>Add Product</Button>}
      </div>

      <DataTable columns={columns} data={filteredProducts} loading={loading} searchValue={searchTerm} onSearchChange={setSearchTerm} emptyMessage="No products match your search." />

      <Modal open={showForm} title={editingProduct ? 'Edit Product' : 'Add Product'} onClose={resetForm} footer={(
        <>
          <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
          <Button type="submit" form="product-form" disabled={saving}>{saving ? 'Saving...' : editingProduct ? 'Update' : 'Create'}</Button>
        </>
      )}>
        <form id="product-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="SKU" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
          <div className="sm:col-span-2"><Textarea label="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" /></div>
          <Select label="Supplier" value={formData.supplier_id || ''} onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}>
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
          </Select>
          <Input label="Min Stock Level" type="number" min="0" value={formData.min_stock_level || ''} onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })} />
        </form>
      </Modal>

      <Modal open={Boolean(deleteId)} title="Delete Product" onClose={() => setDeleteId(null)} footer={(
        <>
          <Button type="button" variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
        </>
      )}>
        This will permanently remove the selected product. This action cannot be undone.
      </Modal>
    </div>
  );
};

export default Products;

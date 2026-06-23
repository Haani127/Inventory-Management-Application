import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { warehouseAPI } from '../services/api';
import { Button, DataTable, Icon, Input, Modal, useToast } from '../components/ui';

const emptyForm = { name: '', location: '' };

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const toast = useToast();

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await warehouseAPI.getAll();
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast('Unable to load warehouses', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingWarehouse) {
        await warehouseAPI.update(editingWarehouse.id, formData);
        toast('Warehouse updated');
      } else {
        await warehouseAPI.create(formData);
        toast('Warehouse created');
      }
      fetchWarehouses();
      resetForm();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      toast('Unable to save warehouse', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData(warehouse);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await warehouseAPI.delete(deleteId);
      toast('Warehouse deleted');
      fetchWarehouses();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      toast('Unable to delete warehouse', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingWarehouse(null);
    setShowForm(false);
  };

  const filteredWarehouses = useMemo(() => warehouses.filter((warehouse) =>
    `${warehouse.name} ${warehouse.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [warehouses, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Locations</p>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
        </div>
        <Button type="button" icon="plus" onClick={() => setShowForm(true)}>Add Warehouse</Button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name', render: (warehouse) => <span className="font-semibold text-slate-950 dark:text-white">{warehouse.name}</span> },
          { key: 'location', header: 'Location' },
          { key: 'actions', header: 'Actions', sortable: false, render: (warehouse) => (
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="icon" title="Edit warehouse" onClick={() => handleEdit(warehouse)}><Icon name="edit" /></Button>
              <Button type="button" variant="ghost" size="icon" title="Delete warehouse" onClick={() => setDeleteId(warehouse.id)}><Icon name="trash" /></Button>
            </div>
          ) },
        ]}
        data={filteredWarehouses}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No warehouses found."
      />

      <Modal open={showForm} title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'} onClose={resetForm} footer={(
        <>
          <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
          <Button type="submit" form="warehouse-form" disabled={saving}>{saving ? 'Saving...' : editingWarehouse ? 'Update' : 'Create'}</Button>
        </>
      )}>
        <form id="warehouse-form" onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
        </form>
      </Modal>

      <Modal open={Boolean(deleteId)} title="Delete Warehouse" onClose={() => setDeleteId(null)} footer={(
        <>
          <Button type="button" variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
        </>
      )}>
        This will permanently remove the selected warehouse.
      </Modal>
    </div>
  );
};

export default Warehouses;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supplierAPI } from '../services/api';
import { Button, DataTable, Icon, Input, Modal, useToast } from '../components/ui';

const emptyForm = { name: '', contact_person: '', email: '' };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const toast = useToast();

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await supplierAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast('Unable to load suppliers', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSupplier) {
        await supplierAPI.update(editingSupplier.id, formData);
        toast('Supplier updated');
      } else {
        await supplierAPI.create(formData);
        toast('Supplier created');
      }
      fetchSuppliers();
      resetForm();
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast('Unable to save supplier', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await supplierAPI.delete(deleteId);
      toast('Supplier deleted');
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast('Unable to delete supplier', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingSupplier(null);
    setShowForm(false);
  };

  const filteredSuppliers = useMemo(() => suppliers.filter((supplier) =>
    `${supplier.name} ${supplier.contact_person} ${supplier.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  ), [suppliers, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Procurement</p>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        </div>
        <Button type="button" icon="plus" onClick={() => setShowForm(true)}>Add Supplier</Button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name', render: (supplier) => <span className="font-semibold text-slate-950 dark:text-white">{supplier.name}</span> },
          { key: 'contact_person', header: 'Contact Person' },
          { key: 'email', header: 'Email', render: (supplier) => <a className="text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white" href={`mailto:${supplier.email}`}>{supplier.email}</a> },
          { key: 'actions', header: 'Actions', sortable: false, render: (supplier) => (
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" size="icon" title="Edit supplier" onClick={() => handleEdit(supplier)}><Icon name="edit" /></Button>
              <Button type="button" variant="ghost" size="icon" title="Delete supplier" onClick={() => setDeleteId(supplier.id)}><Icon name="trash" /></Button>
            </div>
          ) },
        ]}
        data={filteredSuppliers}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        emptyMessage="No suppliers found."
      />

      <Modal open={showForm} title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'} onClose={resetForm} footer={(
        <>
          <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
          <Button type="submit" form="supplier-form" disabled={saving}>{saving ? 'Saving...' : editingSupplier ? 'Update' : 'Create'}</Button>
        </>
      )}>
        <form id="supplier-form" onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Contact Person" value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </form>
      </Modal>

      <Modal open={Boolean(deleteId)} title="Delete Supplier" onClose={() => setDeleteId(null)} footer={(
        <>
          <Button type="button" variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
        </>
      )}>
        This will permanently remove the selected supplier.
      </Modal>
    </div>
  );
};

export default Suppliers;

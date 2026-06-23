import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Button, Card, Icon, Input, Select, useToast } from '../components/ui';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'EMPLOYEE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.register(formData);
      toast('Registration successful. Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-950"><Icon name="box" /></span>
            <span className="font-bold">InventoryPro</span>
          </div>
          <div className="max-w-xl">
            <p className="text-sm font-medium text-slate-400">Portfolio-grade SaaS dashboard</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">Invite operators, managers, and admins into a focused inventory workflow.</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Create workspace access</p>
                <h2 className="text-2xl font-bold tracking-tight">Register</h2>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme"><Icon name={isDark ? 'sun' : 'moon'} /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <Select label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </Select>
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already registered? <Link to="/login" className="font-semibold text-slate-950 hover:underline dark:text-white">Sign in</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;

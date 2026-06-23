import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { Button, Card, Icon, Input } from '../components/ui';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(credentials);
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
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
            <p className="text-sm font-medium text-slate-400">Inventory Management Application</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">Run stock, suppliers, and locations from one clean workspace.</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome back</p>
                <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme"><Icon name={isDark ? 'sun' : 'moon'} /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required />
              <Input label="Password" type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No account? <Link to="/register" className="font-semibold text-slate-950 hover:underline dark:text-white">Create one</Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

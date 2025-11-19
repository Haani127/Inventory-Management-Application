import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Warehouses from './pages/Warehouses';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => setAuthenticated(isAuthenticated());
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <ThemeProvider>
      <Router>
      <Routes>
        <Route 
          path="/login" 
          element={authenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={authenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={authenticated ? "/dashboard" : "/login"} />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Layout>
                <Inventory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Layout>
                <Warehouses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Layout>
                <Suppliers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
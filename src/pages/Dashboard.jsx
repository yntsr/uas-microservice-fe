import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { healthAPI, productsAPI } from '../api';
import Products from '../components/Products';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [health, setHealth] = useState({ gateway: '-', services: {} });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      // Load products first (critical for initial load)
      await loadProducts();
      setIsLoading(false);
    };
    
    initializeData();
    
    // Check health in background (non-blocking)
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      // Check both services
      const [authHealth, productHealth] = await Promise.all([
        healthAPI.checkAuth().catch(() => ({ data: { status: 'DOWN' } })),
        healthAPI.checkProduct().catch(() => ({ data: { status: 'DOWN' } }))
      ]);
      setHealth({
        gateway: 'UP',
        services: {
          auth: authHealth.data.status === 'OK' ? 'UP' : 'DOWN',
          product: productHealth.data.status === 'OK' ? 'UP' : 'DOWN'
        }
      });
    } catch (error) {
      setHealth({ gateway: 'DOWN', services: { product: 'DOWN', auth: 'DOWN' } });
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-top">
            <div className="user-info">
              <span>{user?.name || user?.username}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </div>
          <h1>🛒 Dashboard Microservice</h1>
          <p className="subtitle">Sistem Manajemen Produk</p>
        </header>

        <main className="tab-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Memuat data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-top">
          <div className="user-info">
            <span>{user?.name || user?.username}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
        <h1>🛒 Dashboard Microservice</h1>
        <p className="subtitle">Sistem Manajemen Produk</p>
      </header>

      <main className="tab-content">
        <Products products={products} onRefresh={loadProducts} />
      </main>
    </div>
  );
};

export default Dashboard;

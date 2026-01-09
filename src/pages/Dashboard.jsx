import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { healthAPI, productsAPI } from '../api';
import Products from '../components/Products';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [health, setHealth] = useState({ gateway: '-', services: {} });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    checkHealth();
    loadProducts();
    
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await healthAPI.check();
      setHealth(response.data);
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

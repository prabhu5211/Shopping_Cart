import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Login from './components/Login';
import ItemList from './components/ItemList';
import Cart from './components/Cart';
import Orders from './components/Orders';
import ProductDetail from './components/ProductDetail';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(
        'https://shopping-cart-br9a.onrender.com/api/users/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/items" element={<ItemList onLogout={handleLogout} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/" element={<Navigate to="/items" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

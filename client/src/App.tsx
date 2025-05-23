import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminProtectedRoute from './components/Auth/AdminProtectedRoute'; 
import AdminProductsPage from './pages/AdminProductsPage';   

import { Toaster } from 'react-hot-toast'; 

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: '',
          duration: 3500,
          style: {
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-bg-tertiary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          },
          success: {
            duration: 2500,
            iconTheme: {
              primary: 'var(--color-amd-red)',
              secondary: 'var(--color-text-primary)',
            },
          },
          error: {
              duration: 4000,
              iconTheme: {
              primary: 'var(--color-amd-red)',
              secondary: 'var(--color-text-primary)',
            },
          },
          loading: {
            iconTheme: {
              primary: 'var(--color-amd-red)',
              secondary: 'transparent',
            }
          }
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productId" element={<ProductDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          <Route path="cuenta" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="admin/products" element={<AdminProtectedRoute> {/* Usando el guard de admin */} <AdminProductsPage /></AdminProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import HeroBanner from './components/HeroBanner';
import BrandPillars from './components/BrandPillars';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import appData from '../server/data.json';
import './App.css';

const initialProducts = (appData.products || []).slice(0, 5);

function MainApp() {
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'admin'
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Theme State
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('thread_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('thread_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('thread_theme', 'light');
    }
  }, [isDark]);

  // Load products from Express backend
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.warn('Backend API connection offline or pending, using initial state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <main className="main-content">
        {currentView === 'catalog' ? (
          <>
            {/* Google-style Centerpiece Search Hero */}
            <HeroSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              products={products}
              onSelectProduct={(p) => setSelectedProductDetail(p)}
            />

            {/* Visual Lifestyle Banner */}
            <HeroBanner
              onExplore={() => {
                const el = document.getElementById('product-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Brand Ethical Pillars */}
            <BrandPillars />

            {/* Product Catalog Grid with Filters */}
            <ProductGrid
              products={products}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onOpenDetail={(p) => setSelectedProductDetail(p)}
            />
          </>
        ) : (
          /* Admin Dashboard Module (RBAC Protected) */
          <AdminDashboard
            products={products}
            setProducts={setProducts}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateAdmin={() => setCurrentView('admin')} />

      {/* Product Detail Modal / Drawer */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
          onReviewAdded={(updatedProduct) => {
            setSelectedProductDetail(updatedProduct);
            setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          }}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer />

      {/* Simulated Checkout Flow Modal */}
      <CheckoutModal
        onOrderComplete={(order) => {
          // reload products to update stock numbers
          loadProducts();
        }}
      />

      {/* Sign In & Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

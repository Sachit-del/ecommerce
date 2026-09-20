import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Package,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  DollarSign,
  ShoppingBag,
  RefreshCw,
  Check,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ products, setProducts, onOpenAuthModal, onNavigateCatalog }) {
  const { currentUser, isAdmin, getIdToken } = useAuth();

  const getAdminHeaders = async (includeContentType = false) => ({
    ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${await getIdToken()}`
  });

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [productFormError, setProductFormError] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Heavyweight Tees',
    price: '',
    stock: '',
    description: '',
    fabric: '100% GOTS Certified Organic Cotton (280 GSM)',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    sizes: 'S, M, L, XL',
    colors: 'Oat Chalk (#F3EFEA), Carbon Slate (#22252A)'
  });

  // Fetch Analytics from Backend with x-user-email
  const fetchAnalytics = async () => {
    if (!currentUser || !isAdmin) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics', { headers: await getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [currentUser, isAdmin, products]);

  // -------------------------------------------------------------------------
  // 403 Unauthorized Access Block Guard
  // -------------------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div style={{
        maxWidth: '900px',
        margin: '60px auto',
        padding: '0 24px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'var(--google-red-surface)',
          border: '1px solid var(--google-red-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 32px',
          boxShadow: 'var(--shadow-dropdown)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--google-red)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(217, 48, 37, 0.3)'
          }}>
            <Lock size={32} />
          </div>

          <span style={{
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--google-red)',
            marginBottom: '8px'
          }}>
            HTTP 403 Forbidden — Access Denied
          </span>

          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '12px'
          }}>
            Restricted Administrator Portal
          </h2>

          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}>
            You are currently signed in as <strong>{currentUser?.email || 'Guest / Unauthenticated'}</strong>.
            THREAD administrative endpoints and inventory controllers are strictly restricted to verified system admins:
            <br />
            <code style={{ fontSize: '13px', color: 'var(--google-blue)', marginTop: '6px', display: 'inline-block' }}>
              admin@gmail.com &bull; sachitmohite6@gmail.com
            </code>
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <button
              onClick={onOpenAuthModal}
              className="btn-google-primary"
              style={{ fontSize: '14px', padding: '10px 22px' }}
            >
              Sign In with Authorized Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // CRUD Handlers
  // -------------------------------------------------------------------------
  const handleOpenAddModal = () => {
    setProductFormError('');
    setFormData({
      name: '',
      category: 'Heavyweight Tees',
      price: '',
      stock: '',
      description: '',
      fabric: '100% GOTS Certified Organic Cotton (280 GSM)',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      sizes: 'S, M, L, XL',
      colors: 'Oat Chalk (#F3EFEA), Carbon Slate (#22252A)'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductFormError('');
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      fabric: product.fabric,
      imageUrl: product.images?.[0] || '',
      sizes: product.sizes?.join(', ') || 'S, M, L, XL',
      colors: product.colors?.map(c => `${c.name} (${c.hex})`).join(', ') || ''
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    if (!formData.name.trim() || formData.price === '' || formData.stock === '') {
      setProductFormError('Product name, price, and stock are required.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setProductFormError('Enter a valid price and a whole-number stock value of 0 or more.');
      return;
    }

    // Parse colors
    const colorsParsed = formData.colors.split(',').map(c => {
      const match = c.match(/(.*)\((.*)\)/);
      if (match) {
        return { name: match[1].trim(), hex: match[2].trim() };
      }
      return { name: c.trim(), hex: '#22252A' };
    });

    const sizesParsed = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name: formData.name,
      category: formData.category,
      price,
      stock,
      description: formData.description,
      fabric: formData.fabric,
      images: [formData.imageUrl],
      sizes: sizesParsed,
      colors: colorsParsed
    };

    try {
      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: await getAdminHeaders(true),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data.product : p));
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Product update failed');
        }
        setEditingProduct(null);
      } else {
        // POST create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: await getAdminHeaders(true),
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          setProducts(prev => [data.product, ...prev]);
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Product creation failed');
        }
        setIsAddModalOpen(false);
      }
      setProductFormError('');
      fetchAnalytics();
    } catch (err) {
      console.error(err);
      setProductFormError(err.message || 'Unable to save this product. Please try again.');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
        headers: await getAdminHeaders()
      });

      if (res.ok || res.status === 404) {
        setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      } else throw new Error('Product deletion failed');
      setDeletingProduct(null);
      fetchAnalytics();
    } catch (err) {
      console.error(err);
      setDeletingProduct(null);
    }
  };

  // Filter products for inventory table
  const inventoryFiltered = products.filter(p => {
    if (inventoryCategory !== 'All' && p.category !== inventoryCategory) return false;
    if (inventorySearch.trim()) {
      const q = inventorySearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="admin-dashboard" style={{
      maxWidth: '1280px',
      margin: '0 auto 80px auto',
      padding: '24px'
    }}>
      {/* Admin Top Header Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '20px 24px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--google-blue-surface)',
            color: 'var(--google-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
              THREAD Central Console
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Authenticated as: <strong style={{ color: 'var(--google-blue)' }}>{currentUser.email}</strong> (Admin Access Verified)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchAnalytics}
            className="btn-google-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={loadingAnalytics ? 'animate-spin' : ''} /> Refresh Data
          </button>
          <button
            onClick={handleOpenAddModal}
            className="btn-google-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px'
            }}
          >
            <Plus size={16} /> Add Clothing Item
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Revenue */}
        <div className="card-google" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--google-blue-surface)', color: 'var(--google-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Total Revenue</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
              ${analyticsData?.summary?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '54,820.00'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--google-green)', fontWeight: '600' }}>+18.4% this week</div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card-google" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--google-green-surface)', color: 'var(--google-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Total Orders</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {analyticsData?.summary?.totalOrders || 428}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--google-green)', fontWeight: '600' }}>99.2% fulfillment rate</div>
          </div>
        </div>

        {/* Active Products */}
        <div className="card-google" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--google-yellow-surface)', color: '#B06000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Active Products</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {products.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Across 4 categories</div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card-google" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-md)', backgroundColor: lowStockCount > 0 ? 'var(--google-red-surface)' : 'var(--google-green-surface)', color: lowStockCount > 0 ? 'var(--google-red)' : 'var(--google-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Low Stock Alerts</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: lowStockCount > 0 ? 'var(--google-red)' : 'var(--text-primary)' }}>
              {lowStockCount} items
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Under 10 units remaining</div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Chart 1: Revenue & Order Trends (AreaChart) */}
        <div className="card-google" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Revenue & Volume Trajectory (7-Day)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Daily gross income and customer order counts</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--google-blue)', fontWeight: '600' }}>Live Synced</span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData?.revenueTrend || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1A73E8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-dropdown)',
                    fontSize: '13px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1A73E8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Sales Distribution (Pie/Donut Chart) */}
        <div className="card-google" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Category Sales Distribution
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Revenue share by minimalist garment category</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.categorySales || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {(analyticsData?.categorySales || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#1A73E8'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `$${val.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Volume Bar Chart */}
      <div className="card-google" style={{ padding: '24px', marginBottom: '40px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Top-Selling Minimalist Pieces
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Units sold & revenue generation across all organic styles</p>
        </div>

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData?.topProducts || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={180} tick={{ fill: 'var(--text-primary)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              />
              <Bar dataKey="unitsSold" fill="#1E8E3E" radius={[0, 4, 4, 0]} name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent customer purchases */}
      <div className="card-google" style={{ overflow: 'hidden', marginBottom: '40px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-primary)' }}>Recent Purchases</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Orders placed by customers appear here after checkout.</p>
        </div>
        {(analyticsData?.recentOrders || []).length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <tr>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Order</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Purchaser Email</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Items</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 20px', fontWeight: '600', color: 'var(--text-primary)' }}>{order.id}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{order.customer}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{order.email || 'Not provided'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{order.itemsCount}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>${order.total.toFixed(2)}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--google-green)', fontWeight: '600' }}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ padding: '24px', margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>No purchases yet.</p>
        )}
      </div>

      {/* Inventory Management Table (CRUD) */}
      <div className="card-google" style={{ overflow: 'hidden' }}>
        {/* Table Header Controls */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Active Inventory Management ({inventoryFiltered.length})
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Real-time stock controllers with automatic low-stock notifications (&lt; 10 units)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search filter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              width: '220px'
            }}>
              <Search size={14} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search SKU or name..."
                value={inventorySearch}
                onChange={e => setInventorySearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Category filter */}
            <select
              value={inventoryCategory}
              onChange={e => setInventoryCategory(e.target.value)}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Heavyweight Tees">Heavyweight Tees</option>
              <option value="Hoodies & Sweats">Hoodies & Sweats</option>
              <option value="Minimal Pants">Minimal Pants</option>
              <option value="Outerwear">Outerwear</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Item</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>SKU</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Price</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Stock Level</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryFiltered.map((p) => {
                const isLow = p.stock > 0 && p.stock < 10;
                const isOut = p.stock === 0;

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Item */}
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.images?.[0] || ''}
                          alt={p.name}
                          style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', objectFit: 'cover', backgroundColor: 'var(--bg-tertiary)' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Rating: {p.rating} ★ ({p.reviewsCount})</div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {p.sku}
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {p.category}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      ${Number(p.price || 0).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '700', color: isLow ? '#B06000' : (isOut ? 'var(--google-red)' : 'var(--text-primary)') }}>
                          {p.stock} units
                        </span>
                        {isLow && (
                          <span title="Low stock (<10)" style={{ color: 'var(--google-yellow)', display: 'flex' }}>
                            <AlertTriangle size={15} />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      {isOut ? (
                        <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--google-red-surface)', color: 'var(--google-red)', fontSize: '11px', fontWeight: '600' }}>
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--google-yellow-surface)', color: '#B06000', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          Low Stock Alert
                        </span>
                      ) : (
                        <span style={{ padding: '3px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--google-green-surface)', color: 'var(--google-green)', fontSize: '11px', fontWeight: '600' }}>
                          Optimal
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          aria-label="Edit item"
                          className="btn-ghost"
                          style={{ padding: '6px', borderRadius: '50%', color: 'var(--google-blue)' }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          aria-label="Delete item"
                          className="btn-ghost"
                          style={{ padding: '6px', borderRadius: '50%', color: 'var(--google-red)' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          MODAL: ADD / EDIT PRODUCT
         ------------------------------------------------------------------------- */}
      {(isAddModalOpen || editingProduct) && (
        <div className="modal-overlay" onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-modal)',
              overflowY: 'auto',
              padding: '24px',
              border: '1px solid var(--border-color)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                {editingProduct ? `Edit "${editingProduct.name}"` : 'Add Minimalist Clothing Item'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Heavyweight Boxy Tee"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Heavyweight Tees">Heavyweight Tees</option>
                    <option value="Hoodies & Sweats">Hoodies & Sweats</option>
                    <option value="Minimal Pants">Minimal Pants</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="48.00"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                  Fabric & Craft Details
                </label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={e => setFormData({ ...formData, fabric: e.target.value })}
                  placeholder="100% GOTS Organic Cotton (280 GSM)"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Structural silhouette details, drape, styling notes..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              {productFormError && (
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--google-red-surface)', color: 'var(--google-red)', fontSize: '12.5px' }}>
                  {productFormError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-google-primary"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------
          MODAL: CONFIRM DELETE
         ------------------------------------------------------------------------- */}
      {deletingProduct && (
        <div className="modal-overlay" onClick={() => setDeletingProduct(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-modal)',
              padding: '24px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--google-red-surface)',
              color: 'var(--google-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Delete Product?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Are you sure you want to remove <strong>"{deletingProduct.name}"</strong> from THREAD catalog? This action will remove it from active store inventory immediately.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setDeletingProduct(null)}
                className="btn-google-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="btn-google-primary"
                style={{ backgroundColor: 'var(--google-red)' }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

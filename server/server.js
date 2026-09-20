import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProducts, initialAnalytics, adminAccounts } from './productsData.js';
import { requireAdmin, buildDemoAdminToken, DEMO_ADMIN_PASSWORD, ALLOWED_ADMIN_EMAILS } from './authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email']
}));
app.use(express.json());

const persistedData = fs.existsSync(dataFilePath)
  ? JSON.parse(fs.readFileSync(dataFilePath, 'utf8'))
  : {};

// In-Memory Database state
let products = Array.isArray(persistedData.products) ? persistedData.products : [...initialProducts];
let analytics = persistedData.analytics || JSON.parse(JSON.stringify(initialAnalytics));
let orders = Array.isArray(persistedData.orders) ? persistedData.orders : [];

function persistData() {
  const payload = {
    admins: adminAccounts || [],
    products,
    analytics,
    orders
  };

  fs.writeFileSync(dataFilePath, JSON.stringify(payload, null, 2), 'utf8');
}

// Helper to recalculate summary analytics
function refreshAnalytics() {
  const lowStock = products.filter(p => p.stock < 10).length;
  analytics.summary.activeProductsCount = products.length;
  analytics.summary.lowStockCount = lowStock;
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const adminEntry = (adminAccounts || []).find(account =>
    String(account.email || '').trim().toLowerCase() === normalizedEmail
  );

  if (
    adminEntry &&
    String(password) === String(adminEntry.password || DEMO_ADMIN_PASSWORD)
  ) {
    const user = {
      email: normalizedEmail,
      name: normalizedEmail === 'sachitmohite6@gmail.com' ? 'Sachit Mohite' : 'Administrator',
      role: 'admin',
      avatar: 'A'
    };

    return res.json({
      success: true,
      user,
      token: buildDemoAdminToken(normalizedEmail)
    });
  }

  return res.json({
    success: true,
    user: {
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: 'customer',
      avatar: normalizedEmail[0].toUpperCase()
    },
    token: null
  });
});

// -------------------------------------------------------------
// Product Endpoints
// -------------------------------------------------------------

// GET /api/products with search, category, sort, price filter
app.get('/api/products', (req, res) => {
  const { category, search, sort, minPrice, maxPrice } = req.query;

  let filtered = [...products];

  if (category && category !== 'All' && category !== 'All Products') {
    filtered = filtered.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Sorting
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  res.json({
    success: true,
    count: filtered.length,
    products: filtered
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ success: true, product });
});

// POST /api/products (Admin protected)
app.post('/api/products', requireAdmin, (req, res) => {
  const { name, category, price, stock, description, fabric, images, colors, sizes } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({ error: "Name, price, and stock are required" });
  }

  const newProduct = {
    id: `th-${Date.now().toString().slice(-4)}`,
    name,
    sku: `TH-${category ? category.slice(0, 3).toUpperCase() : 'APP'}-${Math.floor(10 + Math.random() * 90)}`,
    category: category || "Heavyweight Tees",
    price: parseFloat(price),
    originalPrice: parseFloat(price) * 1.15,
    rating: 5.0,
    reviewsCount: 1,
    stock: parseInt(stock, 10),
    isFeatured: req.body.isFeatured || false,
    isNew: true,
    description: description || "Crafted with refined minimalist design and organic materials.",
    fabric: fabric || "100% GOTS Certified Organic Cotton.",
    origin: req.body.origin || "Ethically crafted in Portugal.",
    images: images && images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: colors && colors.length > 0 ? colors : [
      { name: "Oat Chalk", hex: "#F3EFEA" },
      { name: "Carbon Slate", hex: "#22252A" }
    ],
    sizes: sizes && sizes.length > 0 ? sizes : ["S", "M", "L", "XL"],
    sizingGuide: req.body.sizingGuide || {
      S: { chest: "41 in / 104 cm", length: "27.5 in / 70 cm", shoulder: "19.5 in / 50 cm" },
      M: { chest: "44 in / 112 cm", length: "28.5 in / 72 cm", shoulder: "20.5 in / 52 cm" },
      L: { chest: "47 in / 119 cm", length: "29.5 in / 75 cm", shoulder: "21.5 in / 55 cm" },
      XL: { chest: "50 in / 127 cm", length: "30.5 in / 77 cm", shoulder: "22.5 in / 57 cm" }
    },
    reviews: []
  };

  products.unshift(newProduct);
  refreshAnalytics();
  persistData();

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: newProduct
  });
});

// PUT /api/products/:id (Admin protected)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const existing = products[index];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : existing.price,
    stock: req.body.stock !== undefined ? parseInt(req.body.stock, 10) : existing.stock
  };

  products[index] = updated;
  refreshAnalytics();
  persistData();

  res.json({
    success: true,
    message: "Product updated successfully",
    product: updated
  });
});

// DELETE /api/products/:id (Admin protected)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const removed = products.splice(index, 1)[0];
  refreshAnalytics();
  persistData();

  res.json({
    success: true,
    message: `Product '${removed.name}' deleted successfully`,
    id: req.params.id
  });
});

// POST /api/products/:id/reviews (Public customer feedback)
app.post('/api/products/:id/reviews', (req, res) => {
  const { user, rating, comment } = req.body;
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    user: user || "Verified Shopper",
    rating: parseInt(rating, 10) || 5,
    date: "Just now",
    comment: comment || "Exceptional quality and clean fit."
  };

  product.reviews = [newReview, ...(product.reviews || [])];
  product.reviewsCount = (product.reviewsCount || 0) + 1;

  // recalculate average rating
  const totalStars = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  product.rating = +(totalStars / product.reviews.length).toFixed(2);

  res.status(201).json({
    success: true,
    message: "Review added",
    product
  });
});

// -------------------------------------------------------------
// Analytics Endpoints (Admin Protected)
// -------------------------------------------------------------
app.get('/api/admin/analytics', requireAdmin, (req, res) => {
  refreshAnalytics();
  res.json({
    success: true,
    analytics: {
      ...analytics,
      summary: {
        ...analytics.summary,
        activeProductsCount: products.length,
        lowStockCount: products.filter(p => p.stock < 10).length
      },
      recentOrders: orders.slice(0, 10)
    }
  });
});

// -------------------------------------------------------------
// Orders / Simulated Checkout Endpoint
// -------------------------------------------------------------
app.post('/api/orders', (req, res) => {
  const { customer, email, items, shippingAddress, paymentMethod, promoCode } = req.body;

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const normalizedItems = [];
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }
    if (quantity > product.stock) {
      return res.status(409).json({ error: `Insufficient stock for '${product.name}'` });
    }
    normalizedItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: product.sizes.includes(item.size) ? item.size : product.sizes[0]
    });
  }

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = { THREAD10: 0.1, GOOGLE10: 0.1, THREAD20: 0.2 }[String(promoCode || '').trim().toUpperCase()] || 0;
  const discount = subtotal * discountRate;
  const shipping = subtotal >= 100 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  normalizedItems.forEach(item => {
    const product = products.find(p => p.id === item.id);
    product.stock -= item.quantity;
  });

  const orderId = `ORD-TH-${Date.now().toString().slice(-6)}`;
  const orderRecord = {
    id: orderId,
    date: new Date().toISOString(),
    customer: String(customer || 'Guest Customer').trim().slice(0, 120),
    email: String(email || '').trim().slice(0, 254),
    itemsCount: normalizedItems.reduce((acc, i) => acc + i.quantity, 0),
    total: +total.toFixed(2),
    items: normalizedItems,
    status: "Confirmed",
    paymentMethod: paymentMethod || "Google Pay",
    shippingAddress: String(shippingAddress || '').trim().slice(0, 300)
  };

  orders.unshift(orderRecord);

  // Update live analytics
  analytics.summary.totalRevenue += orderRecord.total;
  analytics.summary.totalOrders += 1;
  analytics.summary.averageOrderValue = +(analytics.summary.totalRevenue / analytics.summary.totalOrders).toFixed(2);
  refreshAnalytics();
  persistData();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: orderRecord
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`[THREAD Server] Backend API running at http://localhost:${PORT}`);
});

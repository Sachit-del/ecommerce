import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, RotateCcw } from 'lucide-react';
import ProductCard from './ProductCard';
import { CATEGORIES } from './HeroSearch';

export default function ProductGrid({
  products,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenDetail
}) {
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(300);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All Products' && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Price filter
      if (item.price > maxPrice) return false;

      // In stock filter
      if (onlyInStock && item.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, maxPrice, onlyInStock, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All Products');
    setMaxPrice(300);
    setOnlyInStock(false);
    setSortBy('popular');
  };

  return (
    <section id="product-catalog" className="product-catalog" style={{
      maxWidth: '1280px',
      margin: '0 auto 80px auto',
      padding: '0 24px'
    }}>
      {/* Section Header & Controls */}
      <div className="catalog-header" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '28px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px'
          }}>
            {selectedCategory === 'All Products' ? 'Complete Collection' : selectedCategory}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Showing {filteredProducts.length} of {products.length} sustainable minimalist pieces
          </p>
        </div>

        {/* Filter Toggle & Sorting Dropdown */}
        <div className="catalog-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-google-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: showFilters ? 'var(--google-blue-surface)' : 'var(--bg-secondary)',
              borderColor: showFilters ? 'var(--google-blue-border)' : 'var(--border-color)',
              color: showFilters ? 'var(--google-blue)' : 'var(--text-primary)'
            }}
          >
            <SlidersHorizontal size={15} />
            Filters {maxPrice < 300 || onlyInStock ? '• 1+' : ''}
          </button>

          {/* Sort Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 14px',
            backgroundColor: 'var(--bg-primary)'
          }}>
            <ArrowUpDown size={14} color="var(--text-secondary)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '13.5px',
                fontFamily: 'inherit',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Filter Drawer / Panel */}
      {showFilters && (
        <div className="catalog-filter-panel" style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-dropdown)'
        }}>
          {/* Price Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Max Price</span>
              <span style={{ color: 'var(--google-blue)', fontWeight: '700' }}>${maxPrice}</span>
            </div>
            <input
              type="range"
              min="40"
              max="300"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--google-blue)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>$40</span>
              <span>$300</span>
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--google-blue)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                In-Stock Items Only
              </span>
            </label>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginLeft: '28px' }}>
              Hide items currently sold out or in pre-production
            </p>
          </div>

          {/* Reset Filters */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={resetFilters}
              className="btn-ghost"
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={14} /> Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '64px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'var(--text-muted)'
          }}>
            <SlidersHorizontal size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No matching minimalist essentials
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            Try adjusting your search keywords, price filter, or selecting "All Products" to discover our full capsule.
          </p>
          <button onClick={resetFilters} className="btn-google-primary">
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
}

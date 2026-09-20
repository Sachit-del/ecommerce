import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const parsed = require('./data.json');

export const initialProducts = parsed.products || [];
export const initialAnalytics = parsed.analytics || {
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    activeProductsCount: 0,
    lowStockCount: 0
  },
  revenueTrend: [],
  categorySales: [],
  topProducts: []
};

export const adminAccounts = parsed.admins || [];


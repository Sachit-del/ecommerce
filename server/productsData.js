import parsed from './data.json' with { type: 'json' };

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


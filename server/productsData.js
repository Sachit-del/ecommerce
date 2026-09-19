import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const parsed = JSON.parse(raw);

export const initialProducts = (parsed.products || []).slice(0, 5);
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


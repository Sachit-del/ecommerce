import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
export const firestoreEnabled = Boolean(serviceAccountJson);

let database;

function getDatabase() {
  if (!firestoreEnabled) return null;
  if (!database) {
    if (!getApps().length) {
      initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
    }
    database = getFirestore();
  }
  return database;
}

export async function loadFirestoreData(fallbackData = {}) {
  const db = getDatabase();
  if (!db) return null;

  const [productsSnapshot, ordersSnapshot, settingsSnapshot] = await Promise.all([
    db.collection('products').get(),
    db.collection('orders').orderBy('date', 'desc').limit(100).get(),
    db.collection('settings').doc('analytics').get()
  ]);

  const products = productsSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(product => (
      product.id &&
      typeof product.name === 'string' &&
      product.name.trim() &&
      Number.isFinite(Number(product.price))
    ))
    .map(product => ({
      ...product,
      price: Number(product.price),
      stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0
    }));
  const orders = ordersSnapshot.docs.map(doc => doc.data());
  const analytics = settingsSnapshot.exists ? settingsSnapshot.data() : null;

  if (products.length === 0 && Array.isArray(fallbackData.products) && fallbackData.products.length > 0) {
    const batch = db.batch();
    fallbackData.products.forEach(product => {
      batch.set(db.collection('products').doc(product.id), product);
    });
    (fallbackData.orders || []).forEach(order => {
      batch.set(db.collection('orders').doc(order.id), order);
    });
    if (fallbackData.analytics) {
      batch.set(db.collection('settings').doc('analytics'), fallbackData.analytics);
    }
    await batch.commit();
  }

  return {
    products: products.length > 0 ? products : (fallbackData.products || []),
    orders: orders.length > 0 ? orders : (fallbackData.orders || []),
    analytics: analytics || fallbackData.analytics || null
  };
}

export async function saveProduct(product) {
  const db = getDatabase();
  if (db) await db.collection('products').doc(product.id).set(product);
}

export async function deleteProduct(productId) {
  const db = getDatabase();
  if (db) await db.collection('products').doc(productId).delete();
}

export async function saveOrder(order) {
  const db = getDatabase();
  if (db) await db.collection('orders').doc(order.id).set(order);
}

export async function saveAnalytics(analytics) {
  const db = getDatabase();
  if (db) await db.collection('settings').doc('analytics').set(analytics);
}

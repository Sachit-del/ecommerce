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

export async function loadFirestoreData() {
  const db = getDatabase();
  if (!db) return null;

  const [productsSnapshot, ordersSnapshot, settingsSnapshot] = await Promise.all([
    db.collection('products').get(),
    db.collection('orders').orderBy('date', 'desc').limit(100).get(),
    db.collection('settings').doc('analytics').get()
  ]);

  return {
    products: productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    orders: ordersSnapshot.docs.map(doc => doc.data()),
    analytics: settingsSnapshot.exists ? settingsSnapshot.data() : null
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

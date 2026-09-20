import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { adminAccounts } from './productsData.js';

export const ALLOWED_ADMIN_EMAILS = (adminAccounts || []).map(account => account.email || '').filter(Boolean);

export const DEMO_ADMIN_PASSWORD = 'admin123';
export const MIN_PASSWORD_LENGTH = 8;

export function buildDemoAdminToken(email) {
  return `demo-admin.${encodeURIComponent(String(email || '').trim().toLowerCase())}`;
}

function decodeDemoAdminToken(token) {
  try {
    const raw = token.replace(/^demo-admin\./, '');
    return {
      email: decodeURIComponent(raw),
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 12
    };
  } catch {
    return null;
  }
}

let firebaseAuth;

async function getFirebaseAuth() {
  if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    initializeApp(serviceAccount ? { credential: cert(JSON.parse(serviceAccount)) } : undefined);
  }
  if (!firebaseAuth) {
    const { getAuth } = await import('firebase-admin/auth');
    firebaseAuth = getAuth();
  }
  return firebaseAuth;
}

export async function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) {
    return res.status(403).json({
      success: false,
      error: '403 Forbidden: Missing Firebase ID token',
      message: 'Access restricted to authenticated administrators.'
    });
  }

  const token = authorization.slice(7);

  if (token.startsWith('demo-admin.')) {
    const payload = decodeDemoAdminToken(token);
    const normalizedEmail = String(payload?.email || '').trim().toLowerCase();

    if (payload && payload.role === 'admin' && ALLOWED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) {
      req.adminUser = { uid: `demo-${normalizedEmail.replace(/[^a-z0-9]/gi, '')}`, email: normalizedEmail, role: 'admin' };
      return next();
    }

    return res.status(401).json({
      success: false,
      error: '401 Unauthorized: Invalid demo admin token'
    });
  }

  try {
    const decodedToken = await (await getFirebaseAuth()).verifyIdToken(token);
    const normalizedEmail = String(decodedToken.email || '').trim().toLowerCase();

    if (!ALLOWED_ADMIN_EMAILS.map(e => e.toLowerCase()).includes(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        error: '403 Unauthorized: Access strictly restricted',
        message: 'Access denied. Administrator privileges are required.'
      });
    }

    req.adminUser = { uid: decodedToken.uid, email: normalizedEmail, role: 'admin' };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      error: '401 Unauthorized: Invalid Firebase ID token'
    });
  }

}

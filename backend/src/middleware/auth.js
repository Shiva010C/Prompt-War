import { auth } from '../config/firebase.js';

/**
 * Middleware: Verifies Firebase ID Token from Authorization header.
 * Attaches decoded token data to req.user.
 */
export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token.' });
  }
}

/**
 * Middleware: Only allows users with custom claim { admin: true }.
 * Must be chained AFTER verifyToken.
 */
export function requireAdmin(req, res, next) {
  if (!req.user?.admin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  }
  next();
}

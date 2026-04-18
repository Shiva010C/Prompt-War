import { auth } from '../config/firebase.js';

/**
 * POST /api/auth/set-admin
 * Super-admin only (called directly or via setup script).
 * Sets custom claim { admin: true } on a Firebase user by email.
 * Body: { email: string, secret: string }
 *
 * Secured via a server-side SECRET (not token) to bootstrap the first admin.
 */
export async function setAdminClaim(req, res) {
  const { email, secret } = req.body;

  if (secret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid secret.' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    res.json({ success: true, message: `User ${email} granted admin access.` });
  } catch (err) {
    console.error('Error setting admin claim:', err);
    if (err.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found. They must sign up first.' });
    }
    res.status(500).json({ error: 'Failed to set admin claim.' });
  }
}

/**
 * GET /api/auth/me
 * Returns the decoded token info for the currently logged-in user.
 */
export async function getMe(req, res) {
  res.json({
    success: true,
    data: {
      uid: req.user.uid,
      email: req.user.email,
      isAdmin: req.user.admin === true,
    },
  });
}

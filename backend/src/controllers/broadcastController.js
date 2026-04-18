import { db } from '../config/firebase.js';
import admin from '../config/firebase.js';

/**
 * POST /api/admin/broadcast
 * Admin only: Sends a global stadium announcement. All users listening via Firestore will be notified.
 * Body: { message: string, type: 'info' | 'success' | 'error' }
 */
export async function sendBroadcast(req, res) {
  const { message, type } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (message.length > 280) {
    return res.status(400).json({ error: 'Message must be 280 characters or fewer.' });
  }

  const validTypes = ['info', 'success', 'error', 'warning'];
  const broadcastType = validTypes.includes(type) ? type : 'info';

  try {
    const ref = await db.collection('broadcasts').add({
      message: message.trim(),
      type: broadcastType,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      sentBy: req.user.email,
    });

    res.status(201).json({
      success: true,
      broadcastId: ref.id,
      message: 'Broadcast sent to all attendees.',
    });
  } catch (err) {
    console.error('Error sending broadcast:', err);
    res.status(500).json({ error: 'Failed to send broadcast.' });
  }
}

/**
 * GET /api/broadcasts/latest
 * Public: Returns the most recent broadcast (for reconnecting clients).
 */
export async function getLatestBroadcast(req, res) {
  try {
    const snapshot = await db.collection('broadcasts')
      .orderBy('sentAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) return res.json({ success: true, data: null });

    const doc = snapshot.docs[0];
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (err) {
    console.error('Error fetching broadcast:', err);
    res.status(500).json({ error: 'Failed to fetch broadcast.' });
  }
}

/**
 * POST /api/admin/broadcast/clear
 * Admin only: Deletes the most recent broadcast document so it no longer shows on user screens.
 */
export async function clearLatestBroadcast(req, res) {
  try {
    const snapshot = await db.collection('broadcasts')
      .orderBy('sentAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.json({ success: true, message: 'No active broadcast to clear.' });
    }

    const docId = snapshot.docs[0].id;
    await db.collection('broadcasts').doc(docId).delete();

    res.json({ success: true, message: 'Broadcast cleared successfully.' });
  } catch (err) {
    console.error('Error clearing broadcast:', err);
    res.status(500).json({ error: 'Failed to clear broadcast.' });
  }
}

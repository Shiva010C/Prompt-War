import { db } from '../config/firebase.js';
import admin from '../config/firebase.js';

/**
 * POST /api/incidents
 * Authenticated user: Triggers an incident (SOS, medical, security, lost).
 * Body: { type: 'sos' | 'medical' | 'security' | 'lost', location?: string }
 */
export async function createIncident(req, res) {
  const { type, location } = req.body;

  const validTypes = ['sos', 'medical', 'security', 'lost'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
  }

  try {
    const ref = await db.collection('incidents').add({
      type,
      location: location || 'Unknown',
      status: 'active',
      userId: req.user.uid,
      userEmail: req.user.email || 'guest',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`🚨 INCIDENT [${type.toUpperCase()}] created: ${ref.id} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      incidentId: ref.id,
      message: 'Incident reported. Help is on the way.',
    });
  } catch (err) {
    console.error('Error creating incident:', err);
    res.status(500).json({ error: 'Failed to report incident.' });
  }
}

/**
 * GET /api/admin/incidents
 * Admin only: Returns all active incidents.
 */
export async function getActiveIncidents(req, res) {
  try {
    const snapshot = await db.collection('incidents')
      .where('status', '==', 'active')
      .orderBy('timestamp', 'desc')
      .get();

    const incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: incidents });
  } catch (err) {
    console.error('Error fetching incidents:', err);
    res.status(500).json({ error: 'Failed to fetch incidents.' });
  }
}

/**
 * PATCH /api/admin/incidents/:incidentId/resolve
 * Admin only: Marks an incident as resolved.
 */
export async function resolveIncident(req, res) {
  const { incidentId } = req.params;

  try {
    const ref = db.collection('incidents').doc(incidentId);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Incident not found.' });

    await ref.update({
      status: 'resolved',
      resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
      resolvedBy: req.user.email,
    });

    res.json({ success: true, message: `Incident ${incidentId} resolved.` });
  } catch (err) {
    console.error('Error resolving incident:', err);
    res.status(500).json({ error: 'Failed to resolve incident.' });
  }
}

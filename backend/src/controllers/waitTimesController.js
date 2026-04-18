import { db } from '../config/firebase.js';

/**
 * GET /api/wait-times
 * Returns current wait times for all zones from Firestore.
 */
export async function getWaitTimes(req, res) {
  try {
    const snapshot = await db.collection('wait_times').get();
    const waitTimes = {};
    snapshot.forEach(doc => {
      waitTimes[doc.id] = doc.data();
    });
    res.json({ success: true, data: waitTimes });
  } catch (err) {
    console.error('Error fetching wait times:', err);
    res.status(500).json({ error: 'Failed to fetch wait times.' });
  }
}

/**
 * POST /api/admin/wait-times
 * Admin only: Updates wait time for a specific zone.
 * Body: { zone: string, estimatedWaitMinutes: number }
 */
export async function updateWaitTime(req, res) {
  const { zone, estimatedWaitMinutes } = req.body;

  if (!zone || estimatedWaitMinutes === undefined) {
    return res.status(400).json({ error: 'zone and estimatedWaitMinutes are required.' });
  }

  if (typeof estimatedWaitMinutes !== 'number' || estimatedWaitMinutes < 0 || estimatedWaitMinutes > 120) {
    return res.status(400).json({ error: 'estimatedWaitMinutes must be a number between 0 and 120.' });
  }

  try {
    await db.collection('wait_times').doc(zone).set({
      estimatedWaitMinutes,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.email,
    }, { merge: true });

    res.json({ success: true, message: `Wait time for "${zone}" updated.` });
  } catch (err) {
    console.error('Error updating wait time:', err);
    res.status(500).json({ error: 'Failed to update wait time.' });
  }
}

/**
 * POST /api/admin/wait-times/seed
 * Admin only: Seeds default wait times for all known zones.
 */
export async function seedWaitTimes(req, res) {
  const defaults = {
    restroomNorth: 12,
    restroomSouth: 4,
    foodMain: 25,
    foodUpper: 2,
  };

  try {
    const batch = db.batch();
    for (const [zone, minutes] of Object.entries(defaults)) {
      const ref = db.collection('wait_times').doc(zone);
      batch.set(ref, { estimatedWaitMinutes: minutes, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    res.json({ success: true, message: 'Wait times seeded.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed wait times.' });
  }
}

import { db } from '../config/firebase.js';
import admin from '../config/firebase.js';

/**
 * POST /api/orders/place
 * Authenticated user places a food order. Creates order in Firestore.
 * Body: { items: [{ name, price, qty }] }
 */
export async function placeOrder(req, res) {
  const { items } = req.body;
  const userId = req.user.uid;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item.' });
  }

  // Validate items structure
  for (const item of items) {
    if (!item.name || typeof item.price !== 'number' || typeof item.qty !== 'number') {
      return res.status(400).json({ error: 'Each item must have name, price (number), and qty (number).' });
    }
    if (item.qty < 1 || item.qty > 20) {
      return res.status(400).json({ error: 'Item quantity must be between 1 and 20.' });
    }
    if (item.price < 0 || item.price > 1000) {
      return res.status(400).json({ error: 'Item price out of acceptable range.' });
    }
  }

  const totalCost = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    const orderRef = await db.collection('orders').add({
      userId,
      userEmail: req.user.email || 'guest',
      items,
      totalCost,
      status: 'Received',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      orderId: orderRef.id,
      status: 'Received',
      estimatedReadyMinutes: 12,
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order.' });
  }
}

/**
 * GET /api/orders/my
 * Returns all orders for the authenticated user.
 */
export async function getMyOrders(req, res) {
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
}

/**
 * PATCH /api/admin/orders/:orderId/status
 * Admin only: Updates order status. E.g., 'Received' -> 'Preparing' -> 'Ready'
 */
export async function updateOrderStatus(req, res) {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['Received', 'Preparing', 'Ready', 'Completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const ref = db.collection('orders').doc(orderId);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Order not found.' });

    await ref.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.json({ success: true, message: `Order ${orderId} updated to "${status}".` });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order.' });
  }
}

/**
 * GET /api/admin/orders
 * Admin only: Returns all pending/active orders.
 */
export async function getAllOrders(req, res) {
  try {
    const snapshot = await db.collection('orders')
      .where('status', 'in', ['Received', 'Preparing', 'Ready'])
      .orderBy('createdAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
}

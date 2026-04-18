import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getWaitTimes, updateWaitTime, seedWaitTimes } from '../controllers/waitTimesController.js';
import { placeOrder, getMyOrders, updateOrderStatus, getAllOrders } from '../controllers/ordersController.js';
import { sendBroadcast, getLatestBroadcast } from '../controllers/broadcastController.js';
import { createIncident, getActiveIncidents, resolveIncident } from '../controllers/incidentsController.js';
import { setAdminClaim, getMe } from '../controllers/authController.js';

const router = express.Router();

// --- Public Routes ---
router.get('/wait-times', apiLimiter, getWaitTimes);
router.get('/broadcasts/latest', apiLimiter, getLatestBroadcast);

// --- Authenticated User Routes ---
router.get('/auth/me', verifyToken, getMe);
router.post('/orders/place', verifyToken, apiLimiter, placeOrder);
router.get('/orders/my', verifyToken, getMyOrders);
router.post('/incidents', verifyToken, apiLimiter, createIncident);

// --- Admin-Only Routes ---
router.post('/admin/wait-times', verifyToken, requireAdmin, updateWaitTime);
router.post('/admin/wait-times/seed', verifyToken, requireAdmin, seedWaitTimes);
router.post('/admin/broadcast', verifyToken, requireAdmin, sendBroadcast);
router.get('/admin/orders', verifyToken, requireAdmin, getAllOrders);
router.patch('/admin/orders/:orderId/status', verifyToken, requireAdmin, updateOrderStatus);
router.get('/admin/incidents', verifyToken, requireAdmin, getActiveIncidents);
router.patch('/admin/incidents/:incidentId/resolve', verifyToken, requireAdmin, resolveIncident);

// --- Bootstrap Route (Secret-Protected) ---
router.post('/auth/set-admin', setAdminClaim);

export default router;

import { auth } from '../lib/firebase.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

/**
 * Makes an authenticated API call to the backend.
 * Automatically attaches the Firebase ID Token.
 */
async function apiCall(endpoint, options = {}) {
  const currentUser = auth.currentUser;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (currentUser) {
    const token = await currentUser.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────
// Wait Times
// ─────────────────────────────────────────────
export const getWaitTimes = () => apiCall('/wait-times');

export const updateWaitTime = (zone, estimatedWaitMinutes) =>
  apiCall('/admin/wait-times', {
    method: 'POST',
    body: JSON.stringify({ zone, estimatedWaitMinutes }),
  });

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────
export const placeOrder = (items) =>
  apiCall('/orders/place', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });

export const getMyOrders = () => apiCall('/orders/my');

// ─────────────────────────────────────────────
// Incidents (SOS)
// ─────────────────────────────────────────────
export const reportIncident = (type, location) =>
  apiCall('/incidents', {
    method: 'POST',
    body: JSON.stringify({ type, location }),
  });

// ─────────────────────────────────────────────
// Broadcasts
// ─────────────────────────────────────────────
export const sendBroadcast = (message, type = 'info') =>
  apiCall('/admin/broadcast', {
    method: 'POST',
    body: JSON.stringify({ message, type }),
  });

export const getLatestBroadcast = () => apiCall('/broadcasts/latest');

// ─────────────────────────────────────────────
// Admin Order Management
// ─────────────────────────────────────────────
export const updateOrderStatus = (orderId, status) =>
  apiCall(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const getAllOrders = () => apiCall('/admin/orders');

// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────
export const getMe = () => apiCall('/auth/me');

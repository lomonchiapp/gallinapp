/**
 * Cloud Functions para Webhooks
 * Manejo de webhooks de pasarelas de pago y servicios externos
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ============================================================================
// TIPOS
// ============================================================================

interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

interface RevenueCatWebhookEvent {
  api_version: string;
  event: {
    type: string;
    id: string;
    app_user_id: string;
    product_id?: string;
    price_in_purchased_currency?: number;
    currency?: string;
    subscriber?: any;
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Verifica la firma de un webhook de Stripe
 */
function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // En producción, usar stripe.webhooks.constructEvent
  // Por ahora, verificación simplificada
  if (!signature || !secret) return false;
  
  // Stripe usa formato: t=timestamp,v1=signature
  const parts = signature.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
  const sig = parts.find(p => p.startsWith('v1='))?.slice(3);
  
  if (!timestamp || !sig) return false;
  
  // Verificar que no es muy antiguo (5 minutos)
  const timestampNum = parseInt(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (now - timestampNum > 300) return false;
  
  return true;
}

/**
 * Registra un evento de webhook para auditoría
 */
async function logWebhookEvent(
  source: 'stripe' | 'revenuecat' | 'other',
  eventType: string,
  eventId: string,
  status: 'received' | 'processed' | 'failed',
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await db.collection('_webhookLogs').add({
      source,
      eventType,
      eventId,
      status,
      metadata,
      timestamp: admin.firestore.Timestamp.now(),
    });
  } catch (error) {
    functions.logger.error('Error logging webhook event', error);
  }
}

// ============================================================================
// STRIPE WEBHOOKS
// ============================================================================

/**
 * Webhook para eventos de Stripe
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe?.webhook_secret;
  
  // Verificar firma (simplificado para desarrollo)
  if (webhookSecret && !verifyStripeSignature(req.rawBody.toString(), signature, webhookSecret)) {
    functions.logger.warn('Invalid Stripe webhook signature');
    res.status(401).send('Invalid signature');
    return;
  }
  
  try {
    const event: StripeWebhookEvent = req.body;
    
    functions.logger.info('Stripe webhook received', {
      type: event.type,
      id: event.id,
    });
    
    await logWebhookEvent('stripe', event.type, event.id, 'received');
    
    switch (event.type) {
      case 'checkout.session.completed': {
        // Suscripción o pago completado
        const session = event.data.object;
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription;
        
        if (userId && subscriptionId) {
          await db.collection('users').doc(userId).update({
            'subscription.stripeSubscriptionId': subscriptionId,
            'subscription.status': 'active',
            'subscription.startDate': admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
          });
          
          functions.logger.info('Subscription activated via Stripe', { userId, subscriptionId });
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Buscar usuario por stripeCustomerId
        const usersSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .limit(1)
          .get();
        
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            'subscription.status': subscription.status,
            updatedAt: admin.firestore.Timestamp.now(),
          });
          
          functions.logger.info('Subscription updated', {
            userId: userDoc.id,
            status: subscription.status,
          });
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        const usersSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .limit(1)
          .get();
        
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            'subscription.status': 'canceled',
            'subscription.endDate': admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
          });
          
          functions.logger.info('Subscription canceled', { userId: userDoc.id });
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        // Registrar pago exitoso
        functions.logger.info('Payment succeeded', {
          customerId,
          amount: invoice.amount_paid,
          currency: invoice.currency,
        });
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        // Buscar usuario y notificar
        const usersSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .limit(1)
          .get();
        
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          
          // Actualizar estado
          await userDoc.ref.update({
            'subscription.status': 'past_due',
            updatedAt: admin.firestore.Timestamp.now(),
          });
          
          // Crear notificación para el admin
          await db.collection('admin_notifications').add({
            type: 'payment_failed',
            title: 'Pago fallido',
            message: `El pago del usuario ${userDoc.data().email} ha fallado`,
            data: { userId: userDoc.id },
            read: false,
            createdAt: admin.firestore.Timestamp.now(),
          });
          
          functions.logger.warn('Payment failed', { userId: userDoc.id });
        }
        break;
      }
      
      default:
        functions.logger.info('Unhandled Stripe event type', { type: event.type });
    }
    
    await logWebhookEvent('stripe', event.type, event.id, 'processed');
    res.status(200).json({ received: true });
    
  } catch (error) {
    functions.logger.error('Error processing Stripe webhook', error);
    await logWebhookEvent('stripe', 'unknown', 'unknown', 'failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).send('Webhook processing failed');
  }
});

// ============================================================================
// REVENUECAT WEBHOOKS
// ============================================================================

/**
 * Webhook para eventos de RevenueCat
 */
export const revenueCatWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  
  // Verificar autorización básica de RevenueCat
  const authHeader = req.headers.authorization;
  const expectedAuth = functions.config().revenuecat?.webhook_auth;
  
  if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
    functions.logger.warn('Invalid RevenueCat webhook authorization');
    res.status(401).send('Unauthorized');
    return;
  }
  
  try {
    const event: RevenueCatWebhookEvent = req.body;
    const eventData = event.event;
    
    functions.logger.info('RevenueCat webhook received', {
      type: eventData.type,
      id: eventData.id,
      appUserId: eventData.app_user_id,
    });
    
    await logWebhookEvent('revenuecat', eventData.type, eventData.id, 'received');
    
    const userId = eventData.app_user_id;
    
    // Verificar que el userId existe
    if (!userId) {
      functions.logger.warn('No app_user_id in RevenueCat webhook');
      res.status(200).json({ received: true, warning: 'No user ID' });
      return;
    }
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      functions.logger.warn('User not found for RevenueCat webhook', { userId });
      res.status(200).json({ received: true, warning: 'User not found' });
      return;
    }
    
    switch (eventData.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL': {
        // Nueva compra o renovación
        const productId = eventData.product_id || 'unknown';
        const plan = productId.includes('pro') ? 'PRO' : 
                     productId.includes('enterprise') ? 'ENTERPRISE' : 'BASIC';
        
        await userRef.update({
          'subscription.plan': plan,
          'subscription.status': 'active',
          'subscription.revenueCatProductId': productId,
          'subscription.lastRenewal': admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
        });
        
        functions.logger.info('Subscription activated via RevenueCat', { userId, plan, productId });
        break;
      }
      
      case 'CANCELLATION': {
        // Suscripción cancelada
        await userRef.update({
          'subscription.status': 'canceled',
          updatedAt: admin.firestore.Timestamp.now(),
        });
        
        functions.logger.info('Subscription canceled via RevenueCat', { userId });
        break;
      }
      
      case 'EXPIRATION': {
        // Suscripción expirada
        await userRef.update({
          'subscription.status': 'expired',
          'subscription.plan': 'FREE',
          'subscription.endDate': admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
        });
        
        functions.logger.info('Subscription expired via RevenueCat', { userId });
        break;
      }
      
      case 'BILLING_ISSUE': {
        // Problema de facturación
        await userRef.update({
          'subscription.status': 'past_due',
          updatedAt: admin.firestore.Timestamp.now(),
        });
        
        // Notificar admin
        await db.collection('admin_notifications').add({
          type: 'subscription_billing_issue',
          title: 'Problema de facturación',
          message: `El usuario ${userDoc.data()?.email} tiene problemas de pago`,
          data: { userId },
          read: false,
          createdAt: admin.firestore.Timestamp.now(),
        });
        
        functions.logger.warn('Billing issue via RevenueCat', { userId });
        break;
      }
      
      case 'SUBSCRIBER_ALIAS': {
        // Usuario vinculado a otro ID
        functions.logger.info('Subscriber alias created', { userId });
        break;
      }
      
      default:
        functions.logger.info('Unhandled RevenueCat event type', { type: eventData.type });
    }
    
    await logWebhookEvent('revenuecat', eventData.type, eventData.id, 'processed');
    res.status(200).json({ received: true });
    
  } catch (error) {
    functions.logger.error('Error processing RevenueCat webhook', error);
    await logWebhookEvent('revenuecat', 'unknown', 'unknown', 'failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).send('Webhook processing failed');
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Endpoint de salud para monitoreo
 */
export const healthCheck = functions.https.onRequest(async (req, res) => {
  try {
    // Verificar conexión a Firestore
    await db.collection('_health').doc('check').set({
      timestamp: admin.firestore.Timestamp.now(),
    });
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        firestore: 'ok',
        functions: 'ok',
      },
    });
  } catch (error) {
    functions.logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});


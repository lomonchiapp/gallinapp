/**
 * Alerts Service
 * Sistema de alertas automatizadas para monitoreo
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Inicializar si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// === TIPOS ===

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertCategory = 
  | 'error_rate' 
  | 'performance' 
  | 'security' 
  | 'business' 
  | 'subscription'
  | 'system';

export interface Alert {
  id?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  source: string;
  timestamp: admin.firestore.Timestamp;
  resolved: boolean;
  resolvedAt?: admin.firestore.Timestamp;
  resolvedBy?: string;
  metadata?: Record<string, unknown>;
  notificationsSent: string[];
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: AlertCategory;
  severity: AlertSeverity;
  condition: {
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    threshold: number;
    timeWindowMinutes: number;
  };
  actions: {
    sendEmail?: boolean;
    sendPush?: boolean;
    createIncident?: boolean;
  };
  cooldownMinutes: number;
  lastTriggered?: admin.firestore.Timestamp;
}

export interface AlertNotificationConfig {
  emails: string[];
  webhooks?: string[];
  slackWebhook?: string;
}

// === CONSTANTES ===

const ALERTS_COLLECTION = '_alerts';
const RULES_COLLECTION = '_alertRules';
const CONFIG_COLLECTION = '_alertConfig';

// Reglas predefinidas
const DEFAULT_RULES: Omit<AlertRule, 'id'>[] = [
  {
    name: 'Error Rate Alto',
    description: 'Tasa de errores superior al 5%',
    enabled: true,
    category: 'error_rate',
    severity: 'high',
    condition: {
      metric: 'error_rate',
      operator: '>',
      threshold: 5,
      timeWindowMinutes: 5,
    },
    actions: {
      sendEmail: true,
      sendPush: true,
      createIncident: true,
    },
    cooldownMinutes: 30,
  },
  {
    name: 'Error Rate Crítico',
    description: 'Tasa de errores superior al 10%',
    enabled: true,
    category: 'error_rate',
    severity: 'critical',
    condition: {
      metric: 'error_rate',
      operator: '>',
      threshold: 10,
      timeWindowMinutes: 5,
    },
    actions: {
      sendEmail: true,
      sendPush: true,
      createIncident: true,
    },
    cooldownMinutes: 15,
  },
  {
    name: 'Latencia Alta',
    description: 'Tiempo de respuesta promedio superior a 3 segundos',
    enabled: true,
    category: 'performance',
    severity: 'medium',
    condition: {
      metric: 'avg_latency_ms',
      operator: '>',
      threshold: 3000,
      timeWindowMinutes: 10,
    },
    actions: {
      sendEmail: true,
      sendPush: false,
      createIncident: false,
    },
    cooldownMinutes: 60,
  },
  {
    name: 'Intento de Ataque Detectado',
    description: 'Múltiples intentos bloqueados por rate limiting',
    enabled: true,
    category: 'security',
    severity: 'high',
    condition: {
      metric: 'blocked_requests',
      operator: '>',
      threshold: 50,
      timeWindowMinutes: 5,
    },
    actions: {
      sendEmail: true,
      sendPush: true,
      createIncident: true,
    },
    cooldownMinutes: 15,
  },
  {
    name: 'Pago Fallido',
    description: 'Un pago de suscripción ha fallado',
    enabled: true,
    category: 'subscription',
    severity: 'high',
    condition: {
      metric: 'payment_failed',
      operator: '>=',
      threshold: 1,
      timeWindowMinutes: 1,
    },
    actions: {
      sendEmail: true,
      sendPush: false,
      createIncident: false,
    },
    cooldownMinutes: 0, // Sin cooldown para pagos
  },
  {
    name: 'Nueva Suscripción PRO',
    description: 'Un usuario ha actualizado a plan PRO',
    enabled: true,
    category: 'business',
    severity: 'info',
    condition: {
      metric: 'new_pro_subscription',
      operator: '>=',
      threshold: 1,
      timeWindowMinutes: 1,
    },
    actions: {
      sendEmail: false,
      sendPush: false,
      createIncident: false,
    },
    cooldownMinutes: 0,
  },
];

// === SERVICIO ===

class AlertsService {
  /**
   * Inicializa reglas predefinidas si no existen
   */
  async initializeDefaultRules(): Promise<void> {
    const rulesRef = db.collection(RULES_COLLECTION);
    const snapshot = await rulesRef.limit(1).get();

    if (snapshot.empty) {
      console.log('Initializing default alert rules...');
      
      const batch = db.batch();
      
      for (const rule of DEFAULT_RULES) {
        const docRef = rulesRef.doc();
        batch.set(docRef, {
          ...rule,
          id: docRef.id,
          createdAt: admin.firestore.Timestamp.now(),
        });
      }
      
      await batch.commit();
      console.log(`Created ${DEFAULT_RULES.length} default alert rules`);
    }
  }

  /**
   * Crea una nueva alerta
   */
  async createAlert(
    alert: Omit<Alert, 'id' | 'timestamp' | 'resolved' | 'notificationsSent'>
  ): Promise<string> {
    const alertDoc: Omit<Alert, 'id'> = {
      ...alert,
      timestamp: admin.firestore.Timestamp.now(),
      resolved: false,
      notificationsSent: [],
    };

    const docRef = await db.collection(ALERTS_COLLECTION).add(alertDoc);
    
    console.log(`Alert created: ${docRef.id} - ${alert.title}`);

    // Enviar notificaciones según severidad
    await this.sendAlertNotifications(docRef.id, alertDoc);

    return docRef.id;
  }

  /**
   * Resuelve una alerta
   */
  async resolveAlert(alertId: string, userId: string): Promise<void> {
    await db.collection(ALERTS_COLLECTION).doc(alertId).update({
      resolved: true,
      resolvedAt: admin.firestore.Timestamp.now(),
      resolvedBy: userId,
    });

    console.log(`Alert resolved: ${alertId} by ${userId}`);
  }

  /**
   * Obtiene alertas activas
   */
  async getActiveAlerts(limit: number = 50): Promise<Alert[]> {
    const snapshot = await db.collection(ALERTS_COLLECTION)
      .where('resolved', '==', false)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Alert));
  }

  /**
   * Obtiene alertas por categoría
   */
  async getAlertsByCategory(
    category: AlertCategory,
    includeResolved: boolean = false,
    limit: number = 50
  ): Promise<Alert[]> {
    let query = db.collection(ALERTS_COLLECTION)
      .where('category', '==', category)
      .orderBy('timestamp', 'desc');

    if (!includeResolved) {
      query = query.where('resolved', '==', false);
    }

    const snapshot = await query.limit(limit).get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Alert));
  }

  /**
   * Evalúa métricas contra reglas de alerta
   */
  async evaluateMetrics(metrics: Record<string, number>): Promise<void> {
    const rulesSnapshot = await db.collection(RULES_COLLECTION)
      .where('enabled', '==', true)
      .get();

    const now = admin.firestore.Timestamp.now();

    for (const ruleDoc of rulesSnapshot.docs) {
      const rule = ruleDoc.data() as AlertRule;
      
      // Verificar cooldown
      if (rule.lastTriggered) {
        const cooldownMs = rule.cooldownMinutes * 60 * 1000;
        const timeSinceLastTrigger = now.toMillis() - rule.lastTriggered.toMillis();
        
        if (timeSinceLastTrigger < cooldownMs) {
          continue;
        }
      }

      const metricValue = metrics[rule.condition.metric];
      if (metricValue === undefined) continue;

      // Evaluar condición
      const triggered = this.evaluateCondition(
        metricValue,
        rule.condition.operator,
        rule.condition.threshold
      );

      if (triggered) {
        console.log(`Rule triggered: ${rule.name} (${metricValue} ${rule.condition.operator} ${rule.condition.threshold})`);
        
        // Crear alerta
        await this.createAlert({
          title: rule.name,
          message: `${rule.description}. Valor actual: ${metricValue}`,
          severity: rule.severity,
          category: rule.category,
          source: 'metric_monitor',
          metadata: {
            metric: rule.condition.metric,
            value: metricValue,
            threshold: rule.condition.threshold,
            ruleId: rule.id,
          },
        });

        // Actualizar última ejecución
        await ruleDoc.ref.update({
          lastTriggered: now,
        });
      }
    }
  }

  /**
   * Evalúa una condición
   */
  private evaluateCondition(
    value: number,
    operator: AlertRule['condition']['operator'],
    threshold: number
  ): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      case '==': return value === threshold;
      case '!=': return value !== threshold;
      default: return false;
    }
  }

  /**
   * Envía notificaciones para una alerta
   */
  private async sendAlertNotifications(alertId: string, alert: Omit<Alert, 'id'>): Promise<void> {
    const notificationsSent: string[] = [];

    try {
      // Obtener configuración de notificaciones
      const configDoc = await db.collection(CONFIG_COLLECTION).doc('notifications').get();
      const config = configDoc.data() as AlertNotificationConfig | undefined;

      // Solo enviar notificaciones para severidad alta o crítica
      if (!['critical', 'high'].includes(alert.severity)) {
        return;
      }

      // Enviar emails
      if (config?.emails && config.emails.length > 0) {
        // TODO: Integrar con servicio de email (SendGrid, Mailgun, etc.)
        console.log(`Would send email to: ${config.emails.join(', ')}`);
        notificationsSent.push('email');
      }

      // Enviar a Slack
      if (config?.slackWebhook) {
        await this.sendSlackNotification(config.slackWebhook, alert);
        notificationsSent.push('slack');
      }

      // Enviar a webhooks personalizados
      if (config?.webhooks) {
        for (const webhook of config.webhooks) {
          await this.sendWebhookNotification(webhook, alert);
          notificationsSent.push(`webhook:${webhook}`);
        }
      }

      // Actualizar alertas con notificaciones enviadas
      if (notificationsSent.length > 0) {
        await db.collection(ALERTS_COLLECTION).doc(alertId).update({
          notificationsSent,
        });
      }
    } catch (error) {
      console.error('Error sending alert notifications:', error);
    }
  }

  /**
   * Envía notificación a Slack
   */
  private async sendSlackNotification(webhookUrl: string, alert: Omit<Alert, 'id'>): Promise<void> {
    const severityEmoji: Record<AlertSeverity, string> = {
      critical: '🚨',
      high: '⚠️',
      medium: '📢',
      low: 'ℹ️',
      info: '📋',
    };

    const payload = {
      text: `${severityEmoji[alert.severity]} *${alert.title}*`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${severityEmoji[alert.severity]} ${alert.title}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: alert.message,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Severity:* ${alert.severity.toUpperCase()} | *Category:* ${alert.category} | *Source:* ${alert.source}`,
            },
          ],
        },
      ],
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Envía notificación a webhook personalizado
   */
  private async sendWebhookNotification(webhookUrl: string, alert: Omit<Alert, 'id'>): Promise<void> {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'gallinapp_alert',
        alert: {
          ...alert,
          timestamp: alert.timestamp.toDate().toISOString(),
        },
      }),
    });
  }

  /**
   * Limpia alertas antiguas resueltas
   */
  async cleanupOldAlerts(daysToKeep: number = 30): Promise<number> {
    const cutoff = admin.firestore.Timestamp.fromMillis(
      Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    );

    const snapshot = await db.collection(ALERTS_COLLECTION)
      .where('resolved', '==', true)
      .where('resolvedAt', '<', cutoff)
      .limit(500)
      .get();

    if (snapshot.empty) {
      return 0;
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Cleaned up ${snapshot.size} old alerts`);
    return snapshot.size;
  }
}

export const alertsService = new AlertsService();
export default alertsService;


"use strict";
/**
 * Alerts Service
 * Sistema de alertas automatizadas para monitoreo
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertsService = void 0;
const admin = __importStar(require("firebase-admin"));
// Inicializar si no está inicializado
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// === CONSTANTES ===
const ALERTS_COLLECTION = '_alerts';
const RULES_COLLECTION = '_alertRules';
const CONFIG_COLLECTION = '_alertConfig';
// Reglas predefinidas
const DEFAULT_RULES = [
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
    async initializeDefaultRules() {
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
    async createAlert(alert) {
        const alertDoc = {
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
    async resolveAlert(alertId, userId) {
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
    async getActiveAlerts(limit = 50) {
        const snapshot = await db.collection(ALERTS_COLLECTION)
            .where('resolved', '==', false)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    /**
     * Obtiene alertas por categoría
     */
    async getAlertsByCategory(category, includeResolved = false, limit = 50) {
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
        }));
    }
    /**
     * Evalúa métricas contra reglas de alerta
     */
    async evaluateMetrics(metrics) {
        const rulesSnapshot = await db.collection(RULES_COLLECTION)
            .where('enabled', '==', true)
            .get();
        const now = admin.firestore.Timestamp.now();
        for (const ruleDoc of rulesSnapshot.docs) {
            const rule = ruleDoc.data();
            // Verificar cooldown
            if (rule.lastTriggered) {
                const cooldownMs = rule.cooldownMinutes * 60 * 1000;
                const timeSinceLastTrigger = now.toMillis() - rule.lastTriggered.toMillis();
                if (timeSinceLastTrigger < cooldownMs) {
                    continue;
                }
            }
            const metricValue = metrics[rule.condition.metric];
            if (metricValue === undefined)
                continue;
            // Evaluar condición
            const triggered = this.evaluateCondition(metricValue, rule.condition.operator, rule.condition.threshold);
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
    evaluateCondition(value, operator, threshold) {
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
    async sendAlertNotifications(alertId, alert) {
        const notificationsSent = [];
        try {
            // Obtener configuración de notificaciones
            const configDoc = await db.collection(CONFIG_COLLECTION).doc('notifications').get();
            const config = configDoc.data();
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
        }
        catch (error) {
            console.error('Error sending alert notifications:', error);
        }
    }
    /**
     * Envía notificación a Slack
     */
    async sendSlackNotification(webhookUrl, alert) {
        const severityEmoji = {
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
    async sendWebhookNotification(webhookUrl, alert) {
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
    async cleanupOldAlerts(daysToKeep = 30) {
        const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
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
exports.alertsService = new AlertsService();
exports.default = exports.alertsService;
//# sourceMappingURL=alerts.service.js.map
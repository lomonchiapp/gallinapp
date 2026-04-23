"use strict";
/**
 * Firebase Cloud Functions for Gallinapp
 * Funciones centralizadas para admin, ventas PRO, webhooks y más
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledNCFExpirationCheck = exports.scheduledWebhookLogsCleanup = exports.scheduledRateLimitCleanup = exports.healthCheck = exports.revenueCatWebhook = exports.stripeWebhook = exports.transmitirDocumentoFiscal = exports.generarNCF = exports.getNCFConfig = exports.validarIdFiscal = exports.getResumenVentas = exports.cancelarVenta = exports.registrarPagoVenta = exports.generarDocumentoFiscal = exports.generarNumeroVenta = void 0;
const functions = __importStar(require("firebase-functions"));
const rateLimit_1 = require("./middleware/rateLimit");
// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================
// Admin user management
__exportStar(require("./admin/users"), exports);
// Admin notifications
__exportStar(require("./admin/notifications"), exports);
// Bootstrap del primer admin + helper hasAnyAdmin
__exportStar(require("./admin/bootstrap"), exports);
// Sync globalRole → custom claims
__exportStar(require("./admin/claims-sync"), exports);
// ============================================================================
// VENTAS PRO FUNCTIONS
// ============================================================================
// Ventas profesionales multi-país
var ventas_pro_1 = require("./ventas-pro");
Object.defineProperty(exports, "generarNumeroVenta", { enumerable: true, get: function () { return ventas_pro_1.generarNumeroVenta; } });
Object.defineProperty(exports, "generarDocumentoFiscal", { enumerable: true, get: function () { return ventas_pro_1.generarDocumentoFiscal; } });
Object.defineProperty(exports, "registrarPagoVenta", { enumerable: true, get: function () { return ventas_pro_1.registrarPagoVenta; } });
Object.defineProperty(exports, "cancelarVenta", { enumerable: true, get: function () { return ventas_pro_1.cancelarVenta; } });
Object.defineProperty(exports, "getResumenVentas", { enumerable: true, get: function () { return ventas_pro_1.getResumenVentas; } });
// Funciones fiscales (la aplicación no maneja impuestos; getTaxRates eliminado)
var fiscal_1 = require("./ventas-pro/fiscal");
Object.defineProperty(exports, "validarIdFiscal", { enumerable: true, get: function () { return fiscal_1.validarIdFiscal; } });
Object.defineProperty(exports, "getNCFConfig", { enumerable: true, get: function () { return fiscal_1.getNCFConfig; } });
Object.defineProperty(exports, "generarNCF", { enumerable: true, get: function () { return fiscal_1.generarNCF; } });
Object.defineProperty(exports, "transmitirDocumentoFiscal", { enumerable: true, get: function () { return fiscal_1.transmitirDocumentoFiscal; } });
// ============================================================================
// WEBHOOKS
// ============================================================================
// Webhooks para pasarelas de pago
var webhooks_1 = require("./webhooks");
Object.defineProperty(exports, "stripeWebhook", { enumerable: true, get: function () { return webhooks_1.stripeWebhook; } });
Object.defineProperty(exports, "revenueCatWebhook", { enumerable: true, get: function () { return webhooks_1.revenueCatWebhook; } });
Object.defineProperty(exports, "healthCheck", { enumerable: true, get: function () { return webhooks_1.healthCheck; } });
// ============================================================================
// ALERTS & MONITORING
// ============================================================================
// Sistema de alertas
__exportStar(require("./alerts"), exports);
// ============================================================================
// MIDDLEWARE (exportado para uso interno)
// ============================================================================
// Middleware utilities
__exportStar(require("./middleware"), exports);
// ============================================================================
// SCHEDULED FUNCTIONS
// ============================================================================
// Ejecutar limpieza de rate limits cada día a las 3 AM
exports.scheduledRateLimitCleanup = functions.pubsub
    .schedule('0 3 * * *')
    .timeZone('America/Santo_Domingo')
    .onRun(async () => {
    const result = await (0, rateLimit_1.cleanupExpiredRateLimits)();
    console.log(`Rate limit cleanup completed: ${result.deleted} entries deleted`);
});
// Limpieza de webhooks logs antiguos (cada semana)
exports.scheduledWebhookLogsCleanup = functions.pubsub
    .schedule('0 4 * * 0') // Domingos a las 4 AM
    .timeZone('America/Santo_Domingo')
    .onRun(async () => {
    const admin = await Promise.resolve().then(() => __importStar(require('firebase-admin')));
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    const db = admin.firestore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const snapshot = await db.collection('_webhookLogs')
        .where('timestamp', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .limit(500)
        .get();
    if (snapshot.empty) {
        console.log('No webhook logs to cleanup');
        return;
    }
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Webhook logs cleanup completed: ${snapshot.size} entries deleted`);
});
// Verificación de NCFs por vencer (diario)
exports.scheduledNCFExpirationCheck = functions.pubsub
    .schedule('0 8 * * *') // Todos los días a las 8 AM
    .timeZone('America/Santo_Domingo')
    .onRun(async () => {
    const admin = await Promise.resolve().then(() => __importStar(require('firebase-admin')));
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    const db = admin.firestore();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    // Buscar granjas con NCF por vencer
    const farmsSnapshot = await db.collection('farms').get();
    for (const farmDoc of farmsSnapshot.docs) {
        const ncfConfigDoc = await db.doc(`farms/${farmDoc.id}/configuracion/ncf`).get();
        if (!ncfConfigDoc.exists)
            continue;
        const ncfConfig = ncfConfigDoc.data();
        const fechaVencimiento = ncfConfig.fechaVencimiento?.toDate();
        if (fechaVencimiento && fechaVencimiento < thirtyDaysFromNow) {
            const diasRestantes = Math.ceil((fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            // Crear notificación
            await db.collection(`farms/${farmDoc.id}/notifications`).add({
                tipo: 'NCF_POR_VENCER',
                titulo: 'NCF por vencer',
                mensaje: `Los NCF de su granja vencerán en ${diasRestantes} días. Solicite nuevos a la DGII.`,
                leida: false,
                createdAt: admin.firestore.Timestamp.now(),
            });
            console.log(`NCF expiration alert sent for farm ${farmDoc.id}`);
        }
    }
});
//# sourceMappingURL=index.js.map
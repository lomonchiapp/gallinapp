"use strict";
/**
 * Security Middleware for Firebase Cloud Functions
 * Validación de entrada, sanitización y logging de seguridad
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
exports.logSecurityEvent = logSecurityEvent;
exports.extractRequestInfo = extractRequestInfo;
exports.sanitizeString = sanitizeString;
exports.sanitizeObject = sanitizeObject;
exports.validateInput = validateInput;
exports.withValidation = withValidation;
exports.verifyAuthentication = verifyAuthentication;
exports.requireAuth = requireAuth;
exports.verifyFarmAccess = verifyFarmAccess;
exports.verifyAdminRole = verifyAdminRole;
exports.detectSuspiciousActivity = detectSuspiciousActivity;
const admin = __importStar(require("firebase-admin"));
// Inicializar si no está inicializado
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
const SECURITY_LOGS_COLLECTION = '_securityLogs';
// === LOGGING DE SEGURIDAD ===
/**
 * Registra un evento de seguridad
 */
async function logSecurityEvent(entry) {
    try {
        await db.collection(SECURITY_LOGS_COLLECTION).add({
            ...entry,
            timestamp: admin.firestore.Timestamp.now(),
        });
    }
    catch (error) {
        console.error('Failed to log security event:', error);
    }
}
/**
 * Extrae información del request para logging
 */
function extractRequestInfo(request) {
    const ip = (request.headers['x-forwarded-for'] ||
        request.headers['x-real-ip'] ||
        request.ip ||
        'unknown');
    return {
        ip: Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim(),
        userAgent: request.headers['user-agent'] || 'unknown',
        path: request.path || 'unknown',
    };
}
// === VALIDACIÓN DE ENTRADA ===
/**
 * Sanitiza string para prevenir XSS
 */
function sanitizeString(input) {
    if (typeof input !== 'string')
        return '';
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}
/**
 * Sanitiza un objeto recursivamente
 */
function sanitizeObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeString(value);
        }
        else if (Array.isArray(value)) {
            result[key] = value.map(item => typeof item === 'string' ? sanitizeString(item) :
                typeof item === 'object' && item !== null ? sanitizeObject(item) :
                    item);
        }
        else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
/**
 * Valida datos según reglas
 */
function validateInput(data, rules) {
    const errors = [];
    for (const rule of rules) {
        const value = data[rule.field];
        // Requerido
        if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push(`${rule.field} es requerido`);
            continue;
        }
        if (value === undefined || value === null)
            continue;
        // Validar tipo
        switch (rule.type) {
            case 'string':
                if (typeof value !== 'string') {
                    errors.push(`${rule.field} debe ser texto`);
                }
                else {
                    if (rule.maxLength && value.length > rule.maxLength) {
                        errors.push(`${rule.field} excede el máximo de ${rule.maxLength} caracteres`);
                    }
                    if (rule.minLength && value.length < rule.minLength) {
                        errors.push(`${rule.field} debe tener al menos ${rule.minLength} caracteres`);
                    }
                    if (rule.pattern && !rule.pattern.test(value)) {
                        errors.push(`${rule.field} tiene formato inválido`);
                    }
                }
                break;
            case 'number':
                if (typeof value !== 'number' || isNaN(value)) {
                    errors.push(`${rule.field} debe ser un número`);
                }
                else {
                    if (rule.min !== undefined && value < rule.min) {
                        errors.push(`${rule.field} debe ser mayor o igual a ${rule.min}`);
                    }
                    if (rule.max !== undefined && value > rule.max) {
                        errors.push(`${rule.field} debe ser menor o igual a ${rule.max}`);
                    }
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    errors.push(`${rule.field} debe ser verdadero o falso`);
                }
                break;
            case 'email':
                if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.push(`${rule.field} debe ser un email válido`);
                }
                break;
            case 'phone':
                if (typeof value !== 'string' || !/^[\d\s\-\+\(\)]+$/.test(value)) {
                    errors.push(`${rule.field} debe ser un teléfono válido`);
                }
                break;
            case 'taxId':
                if (typeof value !== 'string' || value.length < 8) {
                    errors.push(`${rule.field} debe ser un identificador fiscal válido`);
                }
                break;
            case 'array':
                if (!Array.isArray(value)) {
                    errors.push(`${rule.field} debe ser una lista`);
                }
                break;
            case 'object':
                if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                    errors.push(`${rule.field} debe ser un objeto`);
                }
                break;
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Middleware de validación para HTTP functions
 */
function withValidation(rules) {
    return (request, response, next) => {
        const data = request.body;
        const result = validateInput(data, rules);
        if (!result.valid) {
            const requestInfo = extractRequestInfo(request);
            logSecurityEvent({
                type: 'validation_error',
                ...requestInfo,
                details: {
                    errors: result.errors,
                    data: sanitizeObject(data),
                },
            });
            response.status(400).json({
                error: 'Validation Error',
                message: 'Los datos proporcionados son inválidos',
                details: result.errors,
            });
            return;
        }
        // Sanitizar datos
        request.body = sanitizeObject(data);
        next();
    };
}
// === VERIFICACIÓN DE AUTENTICACIÓN ===
/**
 * Verifica que el request tenga autenticación válida
 */
async function verifyAuthentication(request) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, error: 'No authorization header' };
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return { valid: true, uid: decodedToken.uid };
    }
    catch (error) {
        const requestInfo = extractRequestInfo(request);
        logSecurityEvent({
            type: 'auth_failure',
            ...requestInfo,
            details: {
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        return { valid: false, error: 'Invalid token' };
    }
}
/**
 * Middleware de autenticación para HTTP functions
 */
function requireAuth(request, response, next) {
    verifyAuthentication(request).then(result => {
        if (!result.valid) {
            response.status(401).json({
                error: 'Unauthorized',
                message: 'Autenticación requerida',
            });
            return;
        }
        // Agregar uid al request para uso posterior
        request.uid = result.uid;
        next();
    });
}
// === VERIFICACIÓN DE PERMISOS ===
/**
 * Verifica si un usuario tiene acceso a una granja
 */
async function verifyFarmAccess(userId, farmId) {
    try {
        // Verificar si es propietario
        const farmDoc = await db.collection('farms').doc(farmId).get();
        if (farmDoc.exists && farmDoc.data()?.ownerId === userId) {
            return { hasAccess: true, role: 'owner' };
        }
        // Verificar si es colaborador
        const memberDoc = await db
            .collection('farms')
            .doc(farmId)
            .collection('members')
            .doc(userId)
            .get();
        if (memberDoc.exists) {
            return { hasAccess: true, role: memberDoc.data()?.role || 'member' };
        }
        return { hasAccess: false };
    }
    catch (error) {
        console.error('Error verifying farm access:', error);
        return { hasAccess: false };
    }
}
/**
 * Verifica si un usuario es administrador
 */
async function verifyAdminRole(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        return userDoc.exists && userDoc.data()?.role === 'admin';
    }
    catch (error) {
        console.error('Error verifying admin role:', error);
        return false;
    }
}
// === DETECCIÓN DE ACTIVIDAD SOSPECHOSA ===
/**
 * Detecta patrones de actividad sospechosa
 */
async function detectSuspiciousActivity(request, context) {
    const requestInfo = extractRequestInfo(request);
    const userId = context?.auth?.uid;
    // Verificar si la IP está en blacklist
    const blacklistDoc = await db.collection('_securityConfig').doc('blacklist').get();
    const blacklist = blacklistDoc.data()?.ips || [];
    if (blacklist.includes(requestInfo.ip)) {
        await logSecurityEvent({
            type: 'blocked_request',
            ...requestInfo,
            userId,
            details: { reason: 'IP in blacklist' },
        });
        return { suspicious: true, reason: 'Blocked IP' };
    }
    // Verificar patrones de User-Agent sospechosos
    const suspiciousUserAgents = ['curl', 'wget', 'python-requests', 'scrapy'];
    const userAgentLower = requestInfo.userAgent.toLowerCase();
    if (suspiciousUserAgents.some(ua => userAgentLower.includes(ua))) {
        await logSecurityEvent({
            type: 'suspicious_activity',
            ...requestInfo,
            userId,
            details: {
                reason: 'Suspicious User-Agent',
                userAgent: requestInfo.userAgent,
            },
        });
        // No bloquear, solo registrar
    }
    return { suspicious: false };
}
// === EXPORTS ===
exports.default = {
    logSecurityEvent,
    extractRequestInfo,
    sanitizeString,
    sanitizeObject,
    validateInput,
    withValidation,
    verifyAuthentication,
    requireAuth,
    verifyFarmAccess,
    verifyAdminRole,
    detectSuspiciousActivity,
};
//# sourceMappingURL=security.js.map
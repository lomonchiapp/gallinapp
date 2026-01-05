/**
 * Security Middleware for Firebase Cloud Functions
 * Validación de entrada, sanitización y logging de seguridad
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Inicializar si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const SECURITY_LOGS_COLLECTION = '_securityLogs';

// === TIPOS ===

interface SecurityLogEntry {
  timestamp: admin.firestore.Timestamp;
  type: 'auth_failure' | 'rate_limit' | 'validation_error' | 'suspicious_activity' | 'blocked_request';
  ip: string;
  userId?: string;
  userAgent?: string;
  path: string;
  details: Record<string, unknown>;
}

interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'taxId' | 'array' | 'object';
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  sanitize?: boolean;
}

// === LOGGING DE SEGURIDAD ===

/**
 * Registra un evento de seguridad
 */
export async function logSecurityEvent(
  entry: Omit<SecurityLogEntry, 'timestamp'>
): Promise<void> {
  try {
    await db.collection(SECURITY_LOGS_COLLECTION).add({
      ...entry,
      timestamp: admin.firestore.Timestamp.now(),
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

/**
 * Extrae información del request para logging
 */
export function extractRequestInfo(request: functions.https.Request): {
  ip: string;
  userAgent: string;
  path: string;
} {
  const ip = (
    request.headers['x-forwarded-for'] || 
    request.headers['x-real-ip'] || 
    request.ip || 
    'unknown'
  ) as string;
  
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
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
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
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) :
        typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) :
        item
      );
    } else if (typeof value === 'object' && value !== null) {
      (result as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  
  return result;
}

/**
 * Valida datos según reglas
 */
export function validateInput(
  data: Record<string, unknown>,
  rules: ValidationRule[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const rule of rules) {
    const value = data[rule.field];
    
    // Requerido
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.field} es requerido`);
      continue;
    }
    
    if (value === undefined || value === null) continue;
    
    // Validar tipo
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${rule.field} debe ser texto`);
        } else {
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
        } else {
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
export function withValidation(rules: ValidationRule[]) {
  return (
    request: functions.https.Request,
    response: functions.Response,
    next: () => void
  ) => {
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
export async function verifyAuthentication(
  request: functions.https.Request
): Promise<{ valid: boolean; uid?: string; error?: string }> {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'No authorization header' };
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return { valid: true, uid: decodedToken.uid };
  } catch (error) {
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
export function requireAuth(
  request: functions.https.Request,
  response: functions.Response,
  next: () => void
): void {
  verifyAuthentication(request).then(result => {
    if (!result.valid) {
      response.status(401).json({
        error: 'Unauthorized',
        message: 'Autenticación requerida',
      });
      return;
    }
    
    // Agregar uid al request para uso posterior
    (request as unknown as Record<string, string>).uid = result.uid!;
    next();
  });
}

// === VERIFICACIÓN DE PERMISOS ===

/**
 * Verifica si un usuario tiene acceso a una granja
 */
export async function verifyFarmAccess(
  userId: string,
  farmId: string
): Promise<{ hasAccess: boolean; role?: string }> {
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
  } catch (error) {
    console.error('Error verifying farm access:', error);
    return { hasAccess: false };
  }
}

/**
 * Verifica si un usuario es administrador
 */
export async function verifyAdminRole(userId: string): Promise<boolean> {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    return userDoc.exists && userDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return false;
  }
}

// === DETECCIÓN DE ACTIVIDAD SOSPECHOSA ===

/**
 * Detecta patrones de actividad sospechosa
 */
export async function detectSuspiciousActivity(
  request: functions.https.Request,
  context?: functions.https.CallableContext
): Promise<{ suspicious: boolean; reason?: string }> {
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

export default {
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


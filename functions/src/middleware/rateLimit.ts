/**
 * Rate Limiting Middleware for Firebase Cloud Functions
 * Implementa rate limiting por IP y por usuario
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Inicializar Firestore si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const RATE_LIMIT_COLLECTION = '_rateLimits';

interface RateLimitConfig {
  maxRequests: number;      // Número máximo de requests
  windowMs: number;         // Ventana de tiempo en milisegundos
  message?: string;         // Mensaje de error personalizado
  keyGenerator?: (request: functions.https.Request, context?: functions.https.CallableContext) => string;
}

interface RateLimitEntry {
  count: number;
  windowStart: admin.firestore.Timestamp;
  blocked?: boolean;
  blockedUntil?: admin.firestore.Timestamp;
}

// Configuraciones predefinidas
export const RATE_LIMIT_PRESETS = {
  // Rate limit estándar: 100 requests por minuto
  standard: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    message: 'Demasiadas solicitudes. Por favor, espera un momento.',
  },
  
  // Rate limit estricto: 10 requests por minuto (para operaciones sensibles)
  strict: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: 'Has excedido el límite de intentos. Espera antes de intentar de nuevo.',
  },
  
  // Rate limit para autenticación: 5 intentos por 15 minutos
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    message: 'Demasiados intentos de autenticación. Intenta de nuevo en 15 minutos.',
  },
  
  // Rate limit para pagos: 3 intentos por hora
  payment: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000,
    message: 'Has excedido el límite de intentos de pago. Intenta más tarde.',
  },
  
  // Rate limit relajado: 1000 requests por minuto (para operaciones de lectura)
  relaxed: {
    maxRequests: 1000,
    windowMs: 60 * 1000,
    message: 'Demasiadas solicitudes.',
  },
} as const;

/**
 * Genera una clave única para el rate limiting
 */
function generateKey(
  request: functions.https.Request,
  context?: functions.https.CallableContext,
  customGenerator?: RateLimitConfig['keyGenerator']
): string {
  if (customGenerator) {
    return customGenerator(request, context);
  }
  
  // Priorizar userId si está disponible
  if (context?.auth?.uid) {
    return `user_${context.auth.uid}`;
  }
  
  // Fallback a IP
  const ip = request.headers['x-forwarded-for'] || 
             request.headers['x-real-ip'] || 
             request.ip || 
             'unknown';
             
  const cleanIp = Array.isArray(ip) ? ip[0] : ip.split(',')[0].trim();
  return `ip_${cleanIp.replace(/[.:/]/g, '_')}`;
}

/**
 * Verifica y actualiza el rate limit
 */
async function checkRateLimit(
  key: string,
  functionName: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const docRef = db.collection(RATE_LIMIT_COLLECTION).doc(`${functionName}_${key}`);
  const now = admin.firestore.Timestamp.now();
  
  try {
    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      const data = doc.data() as RateLimitEntry | undefined;
      
      // Verificar si está bloqueado temporalmente
      if (data?.blocked && data.blockedUntil && data.blockedUntil.toMillis() > now.toMillis()) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: data.blockedUntil.toDate(),
        };
      }
      
      // Verificar si la ventana expiró
      const windowStart = data?.windowStart;
      const windowExpired = !windowStart || 
        (now.toMillis() - windowStart.toMillis()) > config.windowMs;
      
      if (windowExpired) {
        // Nueva ventana
        transaction.set(docRef, {
          count: 1,
          windowStart: now,
          blocked: false,
        });
        
        return {
          allowed: true,
          remaining: config.maxRequests - 1,
          resetAt: new Date(now.toMillis() + config.windowMs),
        };
      }
      
      // Incrementar contador
      const newCount = (data?.count || 0) + 1;
      const remaining = Math.max(0, config.maxRequests - newCount);
      
      if (newCount > config.maxRequests) {
        // Bloquear hasta que termine la ventana
        const blockedUntil = admin.firestore.Timestamp.fromMillis(
          windowStart.toMillis() + config.windowMs
        );
        
        transaction.update(docRef, {
          count: newCount,
          blocked: true,
          blockedUntil,
        });
        
        return {
          allowed: false,
          remaining: 0,
          resetAt: blockedUntil.toDate(),
        };
      }
      
      transaction.update(docRef, { count: newCount });
      
      return {
        allowed: true,
        remaining,
        resetAt: new Date(windowStart.toMillis() + config.windowMs),
      };
    });
    
    return result;
  } catch (error) {
    // En caso de error, permitir el request pero loguear
    console.error('Rate limit check failed:', error);
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(now.toMillis() + config.windowMs),
    };
  }
}

/**
 * Middleware de rate limiting para funciones HTTP
 */
export function rateLimitHttp(
  config: RateLimitConfig | keyof typeof RATE_LIMIT_PRESETS
) {
  const resolvedConfig = typeof config === 'string' 
    ? RATE_LIMIT_PRESETS[config] 
    : config;
    
  return async (
    request: functions.https.Request,
    response: functions.Response,
    next: () => void
  ) => {
    const functionName = request.path.split('/').pop() || 'unknown';
    const key = generateKey(request, undefined, resolvedConfig.keyGenerator);
    
    const result = await checkRateLimit(key, functionName, resolvedConfig);
    
    // Agregar headers de rate limit
    response.set('X-RateLimit-Limit', resolvedConfig.maxRequests.toString());
    response.set('X-RateLimit-Remaining', result.remaining.toString());
    response.set('X-RateLimit-Reset', Math.ceil(result.resetAt.getTime() / 1000).toString());
    
    if (!result.allowed) {
      response.set('Retry-After', Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString());
      
      // Log intento bloqueado
      console.warn('Rate limit exceeded:', {
        function: functionName,
        key,
        resetAt: result.resetAt.toISOString(),
      });
      
      response.status(429).json({
        error: 'Too Many Requests',
        message: resolvedConfig.message || 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetAt.getTime() - Date.now()) / 1000),
      });
      return;
    }
    
    next();
  };
}

/**
 * Wrapper para aplicar rate limiting a Callable Functions
 */
export function withRateLimit<T = unknown, R = unknown>(
  handler: (data: T, context: functions.https.CallableContext) => Promise<R>,
  config: RateLimitConfig | keyof typeof RATE_LIMIT_PRESETS
): (data: T, context: functions.https.CallableContext) => Promise<R> {
  const resolvedConfig = typeof config === 'string' 
    ? RATE_LIMIT_PRESETS[config] 
    : config;
    
  return async (data: T, context: functions.https.CallableContext) => {
    const functionName = context.rawRequest?.path?.split('/').pop() || 'callable';
    const key = context.auth?.uid 
      ? `user_${context.auth.uid}` 
      : `ip_${context.rawRequest?.ip || 'unknown'}`;
    
    const result = await checkRateLimit(key, functionName, resolvedConfig);
    
    if (!result.allowed) {
      console.warn('Rate limit exceeded for callable:', {
        function: functionName,
        userId: context.auth?.uid,
        resetAt: result.resetAt.toISOString(),
      });
      
      throw new functions.https.HttpsError(
        'resource-exhausted',
        resolvedConfig.message || 'Rate limit exceeded',
        {
          retryAfter: Math.ceil((result.resetAt.getTime() - Date.now()) / 1000),
        }
      );
    }
    
    return handler(data, context);
  };
}

/**
 * Limpia entradas de rate limit expiradas
 * Ejecutar periódicamente como scheduled function
 */
export async function cleanupExpiredRateLimits(): Promise<{ deleted: number }> {
  const now = admin.firestore.Timestamp.now();
  const cutoff = admin.firestore.Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000); // 24 horas
  
  const snapshot = await db.collection(RATE_LIMIT_COLLECTION)
    .where('windowStart', '<', cutoff)
    .limit(500)
    .get();
  
  if (snapshot.empty) {
    return { deleted: 0 };
  }
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  
  console.log(`Cleaned up ${snapshot.size} expired rate limit entries`);
  return { deleted: snapshot.size };
}

export default {
  rateLimitHttp,
  withRateLimit,
  cleanupExpiredRateLimits,
  RATE_LIMIT_PRESETS,
};


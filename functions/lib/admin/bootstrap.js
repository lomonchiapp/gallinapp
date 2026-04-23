"use strict";
/**
 * Bootstrap del primer admin del SaaS.
 *
 * Idea:
 *  - `hasAnyAdmin` (callable, sin auth requerido) → indica al cliente si ya
 *    existe algún admin. El cliente lo usa para decidir si mostrar la pantalla
 *    de "Setup inicial" en vez del login.
 *  - `bootstrapFirstAdmin` (callable, sin auth requerido) → crea el primer
 *    SUPER_ADMIN. Solo funciona si no existe ningún admin previo. Una vez
 *    creado, queda inutilizable (idempotente / one-shot).
 *
 * Seguridad:
 *  - Doble verificación con transacción para evitar race condition
 *    (dos usuarios disparando el setup al mismo tiempo).
 *  - Si la cuenta de Firebase Auth ya existe con ese email, la reusa pero
 *    NO sobreescribe el password (el admin debe usar el flujo de "Olvidé mi
 *    contraseña" si quiere cambiarlo).
 *  - Setea custom claims (super_admin: true, admin: true, role: SUPER_ADMIN)
 *    para que las Firestore rules lo reconozcan inmediatamente.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapFirstAdmin = exports.hasAnyAdmin = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
if ((0, app_1.getApps)().length === 0) {
    (0, app_1.initializeApp)();
}
const auth = (0, auth_1.getAuth)();
const db = (0, firestore_1.getFirestore)();
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];
/**
 * Devuelve si ya existe al menos una cuenta con globalRole admin.
 * No requiere autenticación: el admin app lo llama antes del login.
 */
exports.hasAnyAdmin = (0, https_1.onCall)(async () => {
    const snap = await db
        .collection('users')
        .where('globalRole', 'in', ADMIN_ROLES)
        .limit(1)
        .get();
    return { hasAdmin: !snap.empty };
});
/**
 * Crea el primer SUPER_ADMIN del sistema.
 * Solo funciona si la colección users no tiene ninguna cuenta con
 * globalRole en {ADMIN, SUPER_ADMIN}.
 */
exports.bootstrapFirstAdmin = (0, https_1.onCall)(async (request) => {
    const { email, password, displayName } = (request.data || {});
    if (!email || !password || !displayName) {
        throw new https_1.HttpsError('invalid-argument', 'email, password y displayName son requeridos para crear el primer admin');
    }
    if (password.length < 8) {
        throw new https_1.HttpsError('invalid-argument', 'La contraseña debe tener al menos 8 caracteres');
    }
    // Verificación previa rápida (fuera de la transacción para fallar barato)
    const existingAdmins = await db
        .collection('users')
        .where('globalRole', 'in', ADMIN_ROLES)
        .limit(1)
        .get();
    if (!existingAdmins.empty) {
        throw new https_1.HttpsError('failed-precondition', 'Ya existe al menos un administrador. Pídele a un administrador existente que cree tu cuenta.');
    }
    // Crear o reutilizar usuario de Firebase Auth
    let userRecord;
    let createdAuthUser = false;
    try {
        userRecord = await auth.createUser({
            email,
            password,
            displayName,
            emailVerified: true,
        });
        createdAuthUser = true;
    }
    catch (err) {
        const code = err.code;
        if (code === 'auth/email-already-exists') {
            // Reusar el usuario existente, pero no sobreescribir la contraseña
            userRecord = await auth.getUserByEmail(email);
        }
        else {
            console.error('bootstrapFirstAdmin: createUser failed', err);
            throw new https_1.HttpsError('internal', 'No se pudo crear el usuario en Firebase Auth');
        }
    }
    // Transacción: re-chequear que sigue sin haber admins y crear el documento
    try {
        await db.runTransaction(async (tx) => {
            const recheck = await db
                .collection('users')
                .where('globalRole', 'in', ADMIN_ROLES)
                .limit(1)
                .get();
            if (!recheck.empty) {
                throw new https_1.HttpsError('failed-precondition', 'Otro administrador acaba de ser creado. Recarga la página e intenta iniciar sesión.');
            }
            const userRef = db.collection('users').doc(userRecord.uid);
            const existing = await tx.get(userRef);
            const baseData = {
                uid: userRecord.uid,
                email,
                displayName,
                globalRole: 'SUPER_ADMIN',
                isActive: true,
                bootstrappedAdmin: true,
                subscription: {
                    plan: 'FREE',
                    status: 'active',
                    startDate: firestore_1.FieldValue.serverTimestamp(),
                },
                farms: {},
                updatedAt: firestore_1.FieldValue.serverTimestamp(),
            };
            if (existing.exists) {
                tx.update(userRef, {
                    ...baseData,
                    // Preservar createdAt si ya existía
                });
            }
            else {
                tx.set(userRef, {
                    ...baseData,
                    createdAt: firestore_1.FieldValue.serverTimestamp(),
                });
            }
        });
    }
    catch (err) {
        // Si fallamos creando el doc Y nosotros creamos el auth user, deshacer
        if (createdAuthUser) {
            try {
                await auth.deleteUser(userRecord.uid);
            }
            catch (rollbackErr) {
                console.error('bootstrapFirstAdmin: rollback delete failed', rollbackErr);
            }
        }
        if (err instanceof https_1.HttpsError)
            throw err;
        console.error('bootstrapFirstAdmin: transaction failed', err);
        throw new https_1.HttpsError('internal', 'No se pudo registrar el primer administrador');
    }
    // Custom claims para que Firestore rules reconozcan el super_admin
    // sin esperar al trigger de sync.
    try {
        await auth.setCustomUserClaims(userRecord.uid, {
            super_admin: true,
            admin: true,
            role: 'SUPER_ADMIN',
        });
    }
    catch (err) {
        console.error('bootstrapFirstAdmin: setCustomUserClaims failed', err);
        // No abortamos: el trigger onUserDocWrite también lo intentará.
    }
    // Audit trail mínimo
    try {
        await db.collection('admin_audit_log').add({
            action: 'bootstrap_first_admin',
            actorUid: userRecord.uid,
            actorEmail: email,
            targetUid: userRecord.uid,
            details: { displayName },
            timestamp: firestore_1.FieldValue.serverTimestamp(),
        });
    }
    catch (err) {
        console.warn('bootstrapFirstAdmin: audit log failed (non-fatal)', err);
    }
    return {
        success: true,
        uid: userRecord.uid,
        message: 'Primer administrador creado. Ya puedes iniciar sesión.',
    };
});
//# sourceMappingURL=bootstrap.js.map
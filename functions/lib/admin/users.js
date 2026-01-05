"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserSubscription = exports.createUser = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
// Initialize Firebase Admin
if ((0, app_1.getApps)().length === 0) {
    (0, app_1.initializeApp)();
}
const auth = (0, auth_1.getAuth)();
const db = (0, firestore_1.getFirestore)();
// Roles that can perform admin actions
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];
/**
 * Verify that the caller is an admin
 */
async function verifyAdmin(uid) {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return { isAdmin: false, isSuperAdmin: false };
    }
    const globalRole = userDoc.data()?.globalRole;
    return {
        isAdmin: ADMIN_ROLES.includes(globalRole),
        isSuperAdmin: globalRole === 'SUPER_ADMIN',
    };
}
/**
 * Create a new user
 * Only callable by admins
 */
exports.createUser = (0, https_1.onCall)(async (request) => {
    // Verify authentication
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Debes estar autenticado para crear usuarios');
    }
    // Verify admin role
    const { isAdmin } = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Solo los administradores pueden crear usuarios');
    }
    const { email, password, displayName, globalRole, subscription } = request.data;
    // Validate required fields
    if (!email || !password || !displayName) {
        throw new https_1.HttpsError('invalid-argument', 'Email, contraseña y nombre son requeridos');
    }
    try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
            emailVerified: true, // Admin-created users are pre-verified
        });
        // Create user document in Firestore
        const userData = {
            uid: userRecord.uid,
            email,
            displayName,
            globalRole: globalRole || null,
            subscription: subscription ? {
                plan: subscription.plan || 'FREE',
                status: 'active',
                startDate: firestore_1.FieldValue.serverTimestamp(),
            } : {
                plan: 'FREE',
                status: 'active',
                startDate: firestore_1.FieldValue.serverTimestamp(),
            },
            farms: {}, // El usuario puede crear/unirse a granjas según su plan
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
            createdBy: request.auth.uid,
        };
        await db.collection('users').doc(userRecord.uid).set(userData);
        // Create admin notification
        await db.collection('admin_notifications').add({
            type: 'user_created',
            title: 'Nuevo usuario creado',
            message: `${displayName} (${email}) fue creado por un administrador`,
            data: { userId: userRecord.uid },
            read: false,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return {
            success: true,
            uid: userRecord.uid,
            message: 'Usuario creado exitosamente',
        };
    }
    catch (error) {
        console.error('Error creating user:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario';
        throw new https_1.HttpsError('internal', errorMessage);
    }
});
/**
 * Update user subscription
 * Only callable by admins
 */
exports.updateUserSubscription = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Debes estar autenticado');
    }
    const { isAdmin } = await verifyAdmin(request.auth.uid);
    if (!isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Solo los administradores pueden modificar suscripciones');
    }
    const { userId, plan, status } = request.data;
    if (!userId || !plan) {
        throw new https_1.HttpsError('invalid-argument', 'userId y plan son requeridos');
    }
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Usuario no encontrado');
        }
        const previousPlan = userDoc.data()?.subscription?.plan || 'FREE';
        await userRef.update({
            'subscription.plan': plan,
            'subscription.status': status || 'active',
            'subscription.updatedAt': firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Create notification if plan changed
        if (previousPlan !== plan) {
            await db.collection('admin_notifications').add({
                type: 'subscription_changed',
                title: 'Suscripción actualizada',
                message: `${userDoc.data()?.displayName || 'Usuario'} cambió de ${previousPlan} a ${plan}`,
                data: { userId, previousPlan, newPlan: plan },
                read: false,
                createdAt: firestore_1.FieldValue.serverTimestamp(),
            });
        }
        return {
            success: true,
            message: 'Suscripción actualizada exitosamente',
        };
    }
    catch (error) {
        console.error('Error updating subscription:', error);
        if (error instanceof https_1.HttpsError)
            throw error;
        throw new https_1.HttpsError('internal', 'Error al actualizar suscripción');
    }
});
/**
 * Delete/deactivate a user
 * Only callable by super admins
 */
exports.deleteUser = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Debes estar autenticado');
    }
    const { isSuperAdmin } = await verifyAdmin(request.auth.uid);
    if (!isSuperAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Solo los super administradores pueden eliminar usuarios');
    }
    const { userId, permanent } = request.data;
    if (!userId) {
        throw new https_1.HttpsError('invalid-argument', 'userId es requerido');
    }
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Usuario no encontrado');
        }
        const userData = userDoc.data();
        if (permanent) {
            // Permanent deletion
            await auth.deleteUser(userId);
            await userRef.delete();
        }
        else {
            // Soft delete (deactivate)
            await auth.updateUser(userId, { disabled: true });
            await userRef.update({
                isActive: false,
                deactivatedAt: firestore_1.FieldValue.serverTimestamp(),
                deactivatedBy: request.auth.uid,
                updatedAt: firestore_1.FieldValue.serverTimestamp(),
            });
        }
        // Create notification
        await db.collection('admin_notifications').add({
            type: 'user_deleted',
            title: permanent ? 'Usuario eliminado' : 'Usuario desactivado',
            message: `${userData?.displayName || 'Usuario'} (${userData?.email}) fue ${permanent ? 'eliminado' : 'desactivado'}`,
            data: { userId },
            read: false,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return {
            success: true,
            message: permanent ? 'Usuario eliminado permanentemente' : 'Usuario desactivado',
        };
    }
    catch (error) {
        console.error('Error deleting user:', error);
        if (error instanceof https_1.HttpsError)
            throw error;
        throw new https_1.HttpsError('internal', 'Error al eliminar usuario');
    }
});
//# sourceMappingURL=users.js.map
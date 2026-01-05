import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp();
}

const auth = getAuth();
const db = getFirestore();

// Roles that can perform admin actions
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

/**
 * Verify that the caller is an admin
 */
async function verifyAdmin(uid: string): Promise<{ isAdmin: boolean; isSuperAdmin: boolean }> {
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
export const createUser = onCall(async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes estar autenticado para crear usuarios');
  }

  // Verify admin role
  const { isAdmin } = await verifyAdmin(request.auth.uid);
  if (!isAdmin) {
    throw new HttpsError('permission-denied', 'Solo los administradores pueden crear usuarios');
  }

  const { email, password, displayName, globalRole, subscription } = request.data;

  // Validate required fields
  if (!email || !password || !displayName) {
    throw new HttpsError('invalid-argument', 'Email, contraseña y nombre son requeridos');
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
        startDate: FieldValue.serverTimestamp(),
      } : {
        plan: 'FREE',
        status: 'active',
        startDate: FieldValue.serverTimestamp(),
      },
      farms: {}, // El usuario puede crear/unirse a granjas según su plan
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
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
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      uid: userRecord.uid,
      message: 'Usuario creado exitosamente',
    };
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al crear usuario';
    throw new HttpsError('internal', errorMessage);
  }
});

/**
 * Update user subscription
 * Only callable by admins
 */
export const updateUserSubscription = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const { isAdmin } = await verifyAdmin(request.auth.uid);
  if (!isAdmin) {
    throw new HttpsError('permission-denied', 'Solo los administradores pueden modificar suscripciones');
  }

  const { userId, plan, status } = request.data;

  if (!userId || !plan) {
    throw new HttpsError('invalid-argument', 'userId y plan son requeridos');
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'Usuario no encontrado');
    }

    const previousPlan = userDoc.data()?.subscription?.plan || 'FREE';

    await userRef.update({
      'subscription.plan': plan,
      'subscription.status': status || 'active',
      'subscription.updatedAt': FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Create notification if plan changed
    if (previousPlan !== plan) {
      await db.collection('admin_notifications').add({
        type: 'subscription_changed',
        title: 'Suscripción actualizada',
        message: `${userDoc.data()?.displayName || 'Usuario'} cambió de ${previousPlan} a ${plan}`,
        data: { userId, previousPlan, newPlan: plan },
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return {
      success: true,
      message: 'Suscripción actualizada exitosamente',
    };
  } catch (error: unknown) {
    console.error('Error updating subscription:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'Error al actualizar suscripción');
  }
});

/**
 * Delete/deactivate a user
 * Only callable by super admins
 */
export const deleteUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const { isSuperAdmin } = await verifyAdmin(request.auth.uid);
  if (!isSuperAdmin) {
    throw new HttpsError('permission-denied', 'Solo los super administradores pueden eliminar usuarios');
  }

  const { userId, permanent } = request.data;

  if (!userId) {
    throw new HttpsError('invalid-argument', 'userId es requerido');
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'Usuario no encontrado');
    }

    const userData = userDoc.data();

    if (permanent) {
      // Permanent deletion
      await auth.deleteUser(userId);
      await userRef.delete();
    } else {
      // Soft delete (deactivate)
      await auth.updateUser(userId, { disabled: true });
      await userRef.update({
        isActive: false,
        deactivatedAt: FieldValue.serverTimestamp(),
        deactivatedBy: request.auth.uid,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Create notification
    await db.collection('admin_notifications').add({
      type: 'user_deleted',
      title: permanent ? 'Usuario eliminado' : 'Usuario desactivado',
      message: `${userData?.displayName || 'Usuario'} (${userData?.email}) fue ${permanent ? 'eliminado' : 'desactivado'}`,
      data: { userId },
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: permanent ? 'Usuario eliminado permanentemente' : 'Usuario desactivado',
    };
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'Error al eliminar usuario');
  }
});


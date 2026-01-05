"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onFarmCreated = exports.onUserUpdated = exports.onUserCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
// Initialize Firebase Admin
if ((0, app_1.getApps)().length === 0) {
    (0, app_1.initializeApp)();
}
const db = (0, firestore_2.getFirestore)();
/**
 * Trigger when a new user is created (via signup, not admin creation)
 * Creates a notification for admins
 */
exports.onUserCreated = (0, firestore_1.onDocumentCreated)('users/{userId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot)
        return;
    const userData = snapshot.data();
    const userId = event.params.userId;
    // Skip if created by admin (already has notification)
    if (userData.createdBy)
        return;
    try {
        await db.collection('admin_notifications').add({
            type: 'user_created',
            title: 'Nuevo usuario registrado',
            message: `${userData.displayName || 'Usuario'} (${userData.email}) se ha registrado`,
            data: {
                userId,
                email: userData.email,
                displayName: userData.displayName,
            },
            read: false,
            createdAt: firestore_2.FieldValue.serverTimestamp(),
        });
    }
    catch (error) {
        console.error('Error creating user notification:', error);
    }
});
/**
 * Trigger when user document is updated
 * Detects subscription changes and creates notifications
 */
exports.onUserUpdated = (0, firestore_1.onDocumentUpdated)('users/{userId}', async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    if (!beforeData || !afterData)
        return;
    const userId = event.params.userId;
    // Check if subscription changed
    const previousPlan = beforeData.subscription?.plan;
    const newPlan = afterData.subscription?.plan;
    if (previousPlan !== newPlan && previousPlan && newPlan) {
        try {
            await db.collection('admin_notifications').add({
                type: 'subscription_changed',
                title: 'Cambio de suscripción',
                message: `${afterData.displayName || 'Usuario'} cambió de ${previousPlan} a ${newPlan}`,
                data: {
                    userId,
                    previousPlan,
                    newPlan,
                    email: afterData.email,
                },
                read: false,
                createdAt: firestore_2.FieldValue.serverTimestamp(),
            });
        }
        catch (error) {
            console.error('Error creating subscription notification:', error);
        }
    }
});
/**
 * Trigger when a new farm is created
 */
exports.onFarmCreated = (0, firestore_1.onDocumentCreated)('farms/{farmId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot)
        return;
    const farmData = snapshot.data();
    const farmId = event.params.farmId;
    try {
        // Get owner info
        let ownerName = 'Usuario';
        if (farmData.ownerId) {
            const ownerDoc = await db.collection('users').doc(farmData.ownerId).get();
            if (ownerDoc.exists) {
                ownerName = ownerDoc.data()?.displayName || ownerDoc.data()?.email || 'Usuario';
            }
        }
        await db.collection('admin_notifications').add({
            type: 'farm_created',
            title: 'Nueva granja creada',
            message: `${ownerName} creó la granja "${farmData.displayName || farmData.name}"`,
            data: {
                farmId,
                farmName: farmData.displayName || farmData.name,
                ownerId: farmData.ownerId,
            },
            read: false,
            createdAt: firestore_2.FieldValue.serverTimestamp(),
        });
    }
    catch (error) {
        console.error('Error creating farm notification:', error);
    }
});
//# sourceMappingURL=notifications.js.map
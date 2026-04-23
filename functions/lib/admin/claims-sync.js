"use strict";
/**
 * Sincroniza el campo `globalRole` del documento users/{uid} con custom claims
 * de Firebase Auth, para que las Firestore rules puedan usar
 * `request.auth.token.super_admin` / `admin` sin tener que leer el doc.
 *
 * Trigger: onWrite de users/{uid}.
 *
 * Custom claims aplicados:
 *  - super_admin: true cuando globalRole === 'SUPER_ADMIN'
 *  - admin: true cuando globalRole ∈ {ADMIN, SUPER_ADMIN}
 *  - role: el valor literal del globalRole (útil para tooling)
 *
 * Cuando los claims cambian, el cliente debe llamar `getIdToken(true)` para
 * forzar el refresh del JWT — el admin app lo hace automáticamente al
 * iniciar sesión.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncGlobalRoleToClaims = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const auth_1 = require("firebase-admin/auth");
const app_1 = require("firebase-admin/app");
if ((0, app_1.getApps)().length === 0) {
    (0, app_1.initializeApp)();
}
const auth = (0, auth_1.getAuth)();
function buildClaims(globalRole) {
    const claims = {};
    if (globalRole === 'SUPER_ADMIN') {
        claims.super_admin = true;
        claims.admin = true;
        claims.role = 'SUPER_ADMIN';
    }
    else if (globalRole === 'ADMIN') {
        claims.admin = true;
        claims.role = 'ADMIN';
    }
    else if (globalRole === 'SUPPORT' || globalRole === 'ANALYST') {
        claims.role = globalRole;
    }
    return claims;
}
function claimsEqual(a, b) {
    return (!!a.super_admin === !!b.super_admin &&
        !!a.admin === !!b.admin &&
        (a.role ?? null) === (b.role ?? null));
}
exports.syncGlobalRoleToClaims = (0, firestore_1.onDocumentWritten)('users/{userId}', async (event) => {
    const userId = event.params.userId;
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    const beforeRole = before?.globalRole;
    const afterRole = after?.globalRole;
    // Si el rol no cambió y el doc sigue existiendo, no hay nada que hacer
    if (event.data?.before?.exists && event.data?.after?.exists && beforeRole === afterRole) {
        return;
    }
    // Doc borrado: limpiar claims
    if (!event.data?.after?.exists) {
        try {
            await auth.setCustomUserClaims(userId, null);
            console.log(`Cleared claims for deleted user ${userId}`);
        }
        catch (err) {
            console.error(`Failed to clear claims for user ${userId}`, err);
        }
        return;
    }
    const newClaims = buildClaims(afterRole);
    try {
        const userRecord = await auth.getUser(userId);
        const currentClaims = (userRecord.customClaims || {});
        if (claimsEqual(currentClaims, newClaims)) {
            return;
        }
        await auth.setCustomUserClaims(userId, newClaims);
        console.log(`Synced claims for ${userId}: globalRole=${afterRole ?? '(none)'} claims=${JSON.stringify(newClaims)}`);
    }
    catch (err) {
        const code = err.code;
        if (code === 'auth/user-not-found') {
            // Doc en Firestore sin Auth — probablemente data huérfana, ignorar
            console.warn(`User ${userId} has Firestore doc but no Auth record; skipping claims sync`);
            return;
        }
        console.error(`Failed to sync claims for user ${userId}`, err);
    }
});
//# sourceMappingURL=claims-sync.js.map
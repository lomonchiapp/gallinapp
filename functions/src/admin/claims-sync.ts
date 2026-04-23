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

import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

if (getApps().length === 0) {
  initializeApp();
}

const auth = getAuth();

interface ClaimsShape {
  super_admin?: boolean;
  admin?: boolean;
  role?: string | null;
}

function buildClaims(globalRole: string | undefined | null): ClaimsShape {
  const claims: ClaimsShape = {};
  if (globalRole === 'SUPER_ADMIN') {
    claims.super_admin = true;
    claims.admin = true;
    claims.role = 'SUPER_ADMIN';
  } else if (globalRole === 'ADMIN') {
    claims.admin = true;
    claims.role = 'ADMIN';
  } else if (globalRole === 'SUPPORT' || globalRole === 'ANALYST') {
    claims.role = globalRole;
  }
  return claims;
}

function claimsEqual(a: ClaimsShape, b: ClaimsShape): boolean {
  return (
    !!a.super_admin === !!b.super_admin &&
    !!a.admin === !!b.admin &&
    (a.role ?? null) === (b.role ?? null)
  );
}

export const syncGlobalRoleToClaims = onDocumentWritten('users/{userId}', async (event) => {
  const userId = event.params.userId;
  const before = event.data?.before?.data();
  const after = event.data?.after?.data();

  const beforeRole = before?.globalRole as string | undefined;
  const afterRole = after?.globalRole as string | undefined;

  // Si el rol no cambió y el doc sigue existiendo, no hay nada que hacer
  if (event.data?.before?.exists && event.data?.after?.exists && beforeRole === afterRole) {
    return;
  }

  // Doc borrado: limpiar claims
  if (!event.data?.after?.exists) {
    try {
      await auth.setCustomUserClaims(userId, null);
      console.log(`Cleared claims for deleted user ${userId}`);
    } catch (err) {
      console.error(`Failed to clear claims for user ${userId}`, err);
    }
    return;
  }

  const newClaims = buildClaims(afterRole);

  try {
    const userRecord = await auth.getUser(userId);
    const currentClaims = (userRecord.customClaims || {}) as ClaimsShape;

    if (claimsEqual(currentClaims, newClaims)) {
      return;
    }

    await auth.setCustomUserClaims(userId, newClaims);
    console.log(
      `Synced claims for ${userId}: globalRole=${afterRole ?? '(none)'} claims=${JSON.stringify(
        newClaims
      )}`
    );
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === 'auth/user-not-found') {
      // Doc en Firestore sin Auth — probablemente data huérfana, ignorar
      console.warn(`User ${userId} has Firestore doc but no Auth record; skipping claims sync`);
      return;
    }
    console.error(`Failed to sync claims for user ${userId}`, err);
  }
});

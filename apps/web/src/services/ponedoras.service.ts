/**
 * Servicios para el módulo de gallinas ponedoras (Web)
 */

import {
    collection,
    getDocs,
    orderBy,
    query,
    where
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
// Refresh force
import { EstadoLote } from '@gallinapp/types';
import type { LotePonedora } from '@gallinapp/types';

/**
 * Obtener todos los lotes con filtros opcionales
 */
export const obtenerLotesPonedoras = async (filtro?: { status?: EstadoLote }): Promise<LotePonedora[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('Usuario no autenticado, retornando array vacío');
      return [];
    }

    const constraints = [where('createdBy', '==', userId)];

    if (filtro?.status) {
      constraints.push(where('estado', '==', filtro.status));
    }
    
    const q = query(
      collection(db, 'lotesPonedoras'),
      ...constraints,
      orderBy('fechaInicio', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        fechaInicio: data.fechaInicio?.toDate ? data.fechaInicio.toDate() : new Date(data.fechaInicio),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      } as LotePonedora;
    });
  } catch (error) {
    console.error('Error al obtener lotes de ponedoras:', error);
    return [];
  }
};


import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { EstadoLote } from '@gallinapp/types';
import type { LoteLevante } from '@gallinapp/types';

export const obtenerLotesLevantes = async (filtro?: { status?: EstadoLote }): Promise<LoteLevante[]> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const constraints = [where('createdBy', '==', userId)];
    if (filtro?.status) constraints.push(where('estado', '==', filtro.status));
    
    const q = query(collection(db, 'lotesLevante'), ...constraints, orderBy('fechaInicio', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fechaInicio: doc.data().fechaInicio?.toDate?.() || new Date(doc.data().fechaInicio),
    } as LoteLevante));
  } catch (error) {
    console.error('Error al obtener lotes de levante:', error);
    return [];
  }
};

